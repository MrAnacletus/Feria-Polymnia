import os
os.environ['TF_GPU_ALLOCATOR'] = 'cuda_malloc_async'
import io
from pathlib import Path
import select
from shutil import rmtree
import subprocess as sp
import sys
from typing import Dict, Tuple, Optional, IO

from basic_pitch.inference import predict_and_save

import functools
import numpy as np
import tensorflow.compat.v2 as tf

import functools
import gin
import jax
import librosa
import note_seq
import seqio
import t5
import t5x

from mt3 import metrics_utils
from mt3 import models
from mt3 import network
from mt3 import note_sequences
from mt3 import preprocessors
from mt3 import spectrograms
from mt3 import vocabularies

import multiprocessing
import gc
from time import time
import nest_asyncio
# Customize the following options!
model = "mdx_extra"
extensions = ["mp3", "wav", "ogg", "flac"]  # we will look for all those file types.
two_stems = "vocals"   # only separate one stems from the rest, for instance
# two_stems = "vocals"

# Options for the output audio.
mp3 = False
mp3_rate = 320
float32 = True  # output as float 32 wavs, unsused if 'mp3' is True.
int24 = False    # output as int24 wavs, unused if 'mp3' is True.
# You cannot set both `float32 = True` and `int24 = True` !!

clamp=False
shifts=False
suffix="mp3"
if not mp3:
      suffix="wav"

in_path = 'input/'
out_path = 'audio_temp/'
if not os.path.exists("backendPython/GeneracionDePartitura/Transc/audio_temp"):
    os.makedirs("backendPython/GeneracionDePartitura/Transc/audio_temp")

#@title Config Demucs

def find_files(in_path):
    out = []
    for file in Path(in_path).iterdir():
        if file.suffix.lower().lstrip(".") in extensions:
            out.append(file)
    return out

def copy_process_streams(process: sp.Popen):
    def raw(stream: Optional[IO[bytes]]) -> IO[bytes]:
        assert stream is not None
        if isinstance(stream, io.BufferedIOBase):
            stream = stream.raw
        return stream

    p_stdout, p_stderr = raw(process.stdout), raw(process.stderr)
    stream_by_fd: Dict[int, Tuple[IO[bytes], io.StringIO, IO[str]]] = {
        p_stdout.fileno(): (p_stdout, sys.stdout),
        p_stderr.fileno(): (p_stderr, sys.stderr),
    }
    fds = list(stream_by_fd.keys())

    while fds:
        # `select` syscall will wait until one of the file descriptors has content.
        ready, _, _ = select.select(fds, [], [])
        for fd in ready:
            p_stream, std = stream_by_fd[fd]
            raw_buf = p_stream.read(2 ** 16)
            if not raw_buf:
                fds.remove(fd)
                continue
            buf = raw_buf.decode()
            std.write(buf)
            std.flush()

def separate(archname,inp=None, outp=None):
    inp = inp or in_path
    outp = outp or out_path
    cmd = ["python3.7", "-m", "demucs.separate", "-o", str(outp), "-n", model]
    if mp3:
        cmd += ["--mp3", f"--mp3-bitrate={mp3_rate}"]
    if float32:
        cmd += ["--float32"]
    if int24:
        cmd += ["--int24"]
    if two_stems is not None:
        cmd += [f"--two-stems={two_stems}"]
    if clamp:
        cmd+=['--clip-mode clamp']
    if shifts:
        cmd+=['--shifts=SHIFTS']
    cmd+=[f'{inp}/{archname}']
    print("Going to separate the files:")
    print(f'\n{archname}')
    print("With command: ", " ".join(cmd))
    p = sp.Popen(cmd, stdout=sp.PIPE, stderr=sp.PIPE)
    copy_process_streams(p)
    p.wait()
    if p.returncode != 0:
        print("Command failed, something went wrong.")
        
    


SAMPLE_RATE = 16000
SF2_PATH = 'SGM-v2.01-Sal-Guit-Bass-V1.3.sf2'

def upload_audio(inp,sample_rate):
    return librosa.load(inp, sr=sample_rate)

class InferenceModel(object):
    """Wrapper of T5X model for music transcription."""

    def __init__(self, checkpoint_path, model_type='mt3'):

        # Model Constants.
        if model_type == 'ismir2021':
            num_velocity_bins = 127
            self.encoding_spec = note_sequences.NoteEncodingSpec
            self.inputs_length = 512
        elif model_type == 'mt3':
            num_velocity_bins = 1
            self.encoding_spec = note_sequences.NoteEncodingWithTiesSpec
            self.inputs_length = 256
        else:
            raise ValueError('unknown model_type: %s' % model_type)

        gin_files = ['backendPython/GeneracionDePartitura/Transc/mt3/gin/model.gin',
                     f'backendPython/GeneracionDePartitura/Transc/mt3/gin/{model_type}.gin']

        self.batch_size = 8
        self.outputs_length = 1024
        self.sequence_length = {'inputs': self.inputs_length, 
                                'targets': self.outputs_length}

        self.partitioner = t5x.partitioning.PjitPartitioner(
            num_partitions=1)

        # Build Codecs and Vocabularies.
        self.spectrogram_config = spectrograms.SpectrogramConfig()
        self.codec = vocabularies.build_codec(
            vocab_config=vocabularies.VocabularyConfig(
                num_velocity_bins=num_velocity_bins))
        self.vocabulary = vocabularies.vocabulary_from_codec(self.codec)
        self.output_features = {
            'inputs': seqio.ContinuousFeature(dtype=tf.float32, rank=2),
            'targets': seqio.Feature(vocabulary=self.vocabulary),
        }

        # Create a T5X model.
        self._parse_gin(gin_files)
        self.model = self._load_model()

        # Restore from checkpoint.
        self.restore_from_checkpoint(checkpoint_path)

    @property
    def input_shapes(self):
        return {
              'encoder_input_tokens': (self.batch_size, self.inputs_length),
              'decoder_input_tokens': (self.batch_size, self.outputs_length)
        }

    def _parse_gin(self, gin_files):
        """Parse gin files used to train the model."""
        gin_bindings = [
            'from __gin__ import dynamic_registration',
            'from mt3 import vocabularies',
            'VOCAB_CONFIG=@vocabularies.VocabularyConfig()',
            'vocabularies.VocabularyConfig.num_velocity_bins=%NUM_VELOCITY_BINS'
        ]
        with gin.unlock_config():
            gin.parse_config_files_and_bindings(
                gin_files, gin_bindings, finalize_config=False)

    def _load_model(self):
        """Load up a T5X `Model` after parsing training gin config."""
        model_config = gin.get_configurable(network.T5Config)()
        module = network.Transformer(config=model_config)
        return models.ContinuousInputsEncoderDecoderModel(
            module=module,
            input_vocabulary=self.output_features['inputs'].vocabulary,
            output_vocabulary=self.output_features['targets'].vocabulary,
            optimizer_def=t5x.adafactor.Adafactor(decay_rate=0.8, step_offset=0),
            input_depth=spectrograms.input_depth(self.spectrogram_config))


    def restore_from_checkpoint(self, checkpoint_path):
        """Restore training state from checkpoint, resets self._predict_fn()."""
        train_state_initializer = t5x.utils.TrainStateInitializer(
          optimizer_def=self.model.optimizer_def,
          init_fn=self.model.get_initial_variables,
          input_shapes=self.input_shapes,
          partitioner=self.partitioner)

        restore_checkpoint_cfg = t5x.utils.RestoreCheckpointConfig(
            path=checkpoint_path, mode='specific', dtype='float32')

        train_state_axes = train_state_initializer.train_state_axes
        self._predict_fn = self._get_predict_fn(train_state_axes)
        self._train_state = train_state_initializer.from_checkpoint_or_scratch(
            [restore_checkpoint_cfg], init_rng=jax.random.PRNGKey(0))

    @functools.lru_cache()
    def _get_predict_fn(self, train_state_axes):
        """Generate a partitioned prediction function for decoding."""
        def partial_predict_fn(params, batch, decode_rng):
            return self.model.predict_batch_with_aux(
                params, batch, decoder_params={'decode_rng': None})
        return self.partitioner.partition(
            partial_predict_fn,
            in_axis_resources=(
                train_state_axes.params,
                t5x.partitioning.PartitionSpec('data',), None),
            out_axis_resources=t5x.partitioning.PartitionSpec('data',)
        )

    def predict_tokens(self, batch, seed=0):
        """Predict tokens from preprocessed dataset batch."""
        prediction, _ = self._predict_fn(
            self._train_state.params, batch, jax.random.PRNGKey(seed))
        return self.vocabulary.decode_tf(prediction).numpy()

    def __call__(self, audio):
        """Infer note sequence from audio samples.
        
        Args:
          audio: 1-d numpy array of audio samples (16kHz) for a single example.

        Returns:
          A note_sequence of the transcribed audio.
        """
        ds = self.audio_to_dataset(audio)
        ds = self.preprocess(ds)

        model_ds = self.model.FEATURE_CONVERTER_CLS(pack=False)(
            ds, task_feature_lengths=self.sequence_length)
        model_ds = model_ds.batch(self.batch_size)

        inferences = (tokens for batch in model_ds.as_numpy_iterator()
                      for tokens in self.predict_tokens(batch))

        predictions = []
        for example, tokens in zip(ds.as_numpy_iterator(), inferences):
            predictions.append(self.postprocess(tokens, example))

        result = metrics_utils.event_predictions_to_ns(
            predictions, codec=self.codec, encoding_spec=self.encoding_spec)
        return result['est_ns']

    def audio_to_dataset(self, audio):
        """Create a TF Dataset of spectrograms from input audio."""
        frames, frame_times = self._audio_to_frames(audio)
        return tf.data.Dataset.from_tensors({
            'inputs': frames,
            'input_times': frame_times,
        })

    def _audio_to_frames(self, audio):
        """Compute spectrogram frames from audio."""
        frame_size = self.spectrogram_config.hop_width
        padding = [0, frame_size - len(audio) % frame_size]
        audio = np.pad(audio, padding, mode='constant')
        frames = spectrograms.split_audio(audio, self.spectrogram_config)
        num_frames = len(audio) // frame_size
        times = np.arange(num_frames) / self.spectrogram_config.frames_per_second
        return frames, times

    def preprocess(self, ds):
        pp_chain = [
            functools.partial(
                t5.data.preprocessors.split_tokens_to_inputs_length,
                sequence_length=self.sequence_length,
                output_features=self.output_features,
                feature_key='inputs',
                additional_feature_keys=['input_times']),
            # Cache occurs here during training.
            preprocessors.add_dummy_targets,
            functools.partial(
                preprocessors.compute_spectrograms,
                spectrogram_config=self.spectrogram_config)
        ]
        for pp in pp_chain:
            ds = pp(ds)
        return ds

    def postprocess(self, tokens, example):
        tokens = self._trim_eos(tokens)
        start_time = example['input_times'][0]
        # Round down to nearest symbolic token step.
        start_time -= start_time % (1 / self.codec.steps_per_second)
        return {
            'est_tokens': tokens,
            'start_time': start_time,
            # Internal MT3 code expects raw inputs, not used here.
            'raw_inputs': []
        }

    @staticmethod
    def _trim_eos(tokens):
        tokens = np.array(tokens, np.int32)
        if vocabularies.DECODED_EOS_ID in tokens:
            tokens = tokens[:np.argmax(tokens == vocabularies.DECODED_EOS_ID)]
        return tokens

def mt3_aux_4(foldername,outp):
    MODEL = "mt3"
    checkpoint_path = f'/home/zeo/partitas/magenta/checkpoints/{MODEL}/'
    inference_model = InferenceModel(checkpoint_path, MODEL)
    audio_b,sr = upload_audio(f'audio_temp/mdx_extra/{foldername}/bass.{suffix}',SAMPLE_RATE)
    audio_d,sr = upload_audio(f'audio_temp/mdx_extra/{foldername}/drums.{suffix}',SAMPLE_RATE)
    audio_o,sr = upload_audio(f'audio_temp/mdx_extra/{foldername}/other.{suffix}',SAMPLE_RATE)
    est_ns_b = inference_model(audio_b)
    est_ns_d = inference_model(audio_d)
    est_ns_o = inference_model(audio_o)
    note_seq.sequence_proto_to_midi_file(est_ns_b, f'{outp}/{foldername}/bass.mid')
    note_seq.sequence_proto_to_midi_file(est_ns_d, f'{outp}/{foldername}/drums.mid')
    note_seq.sequence_proto_to_midi_file(est_ns_o, f'{outp}/{foldername}/other.mid')

def mt3_aux_2(foldername,outp):
    MODEL = "mt3"
    checkpoint_path = os.path.abspath(f'backendPython/GeneracionDePartitura/Transc/checkpoints/{MODEL}/')
    inference_model = InferenceModel(checkpoint_path, MODEL)
    audio,sr = upload_audio(f'backendPython/GeneracionDePartitura/Transc/audio_temp/mdx_extra/{foldername}/no_vocals.{suffix}',SAMPLE_RATE)
    est_ns = inference_model(audio)
    note_seq.sequence_proto_to_midi_file(est_ns, f'{outp}/{foldername}/no_vocals.mid')

def transcripcion(name,inp,outp):
    gc.collect()
    t_ini=time()
    foldername=Path(name).with_suffix('')
    if not os.path.exists(f"{outp}/{foldername}"):
        os.makedirs(f"{outp}/{foldername}")
    separate(name,inp,"backendPython/GeneracionDePartitura/Transc/audio_temp")
    t_dem=time()
    print('Demucs: {}:{}'.format(int(t_dem-t_ini)//60,int(t_dem-t_ini)%60))
    gc.collect()
    mt3proc=multiprocessing.Process(target=mt3_aux_2,args=(foldername,outp,))
    mt3proc.start()
    mt3proc.join()
    gc.collect()
    t_mt3=time()
    print('Mt3: {}:{}'.format(int(t_mt3-t_dem)//60,int(t_mt3-t_dem)%60))
    bpproc=multiprocessing.Process(target=predict_and_save,args=([f"backendPython/GeneracionDePartitura/Transc/audio_temp/mdx_extra/{foldername}/vocals.{suffix}"],f"{outp}/{foldername}",True,False,False,False),)
    bpproc.start()
    bpproc.join()
    t_fin=time()
    print('Basic Pitch: {}:{}'.format(int(t_fin-t_mt3)//60,int(t_fin-t_mt3)%60))
    print('Completo: {}:{}'.format(int(t_fin-t_ini)//60,int(t_fin-t_ini)%60))
    rmtree(f"backendPython/GeneracionDePartitura/Transc/audio_temp/mdx_extra/{foldername}")
    os.remove(inp+"/"+name)
    gc.collect()
    return f"{outp}/{foldername}"
 