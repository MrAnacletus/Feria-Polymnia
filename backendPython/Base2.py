import numpy as np

import librosa, librosa.display
import music21
music21.environment.set('musescoreDirectPNGPath', 'C:\\Program Files\\MuseScore 3\\bin\\MuseScore3.exe')
from music21.tempo import MetronomeMark
from music21.note import Note, Rest
from music21.stream import Stream
from music21 import metadata
from music21 import instrument

# Configurations
path = "music/"
file = "hb.wav"
Title = ""
Composer = ""

fs = 44100                       
nfft = 2048                        
overlap = 0.5                      
hop_length = int(nfft*(1-overlap))  
n_bins = 72                           
mag_exp = 2                    
pre_post_max = 7                     
cqt_threshold = -55

# Load Audio
# Loadinging audio file
filename = path + file
x, fs = librosa.load(filename, sr=None, mono=True)

x, fs = librosa.load(filename, sr=None, mono=True, duration=(x.shape[0]/fs)-1)

# Custom approximation
def aprox(num):
    '32nd'
    if num<0.15:
        return '32nd'
    elif num<0.3:
        return '16th'
    elif num<0.7:
        return 'eighth'
    elif num<1.4:
        return 'quarter'
    elif num<3:
        return 'half'
    else:
        return 'whole'

# CQT
def calc_cqt(x,fs=fs,hop_length=hop_length, n_bins=n_bins, mag_exp=mag_exp):
    C = librosa.cqt(x, sr=fs, hop_length=hop_length, fmin=None, n_bins=n_bins)
    C_mag = librosa.magphase(C)[0]**mag_exp
    CdB = librosa.core.amplitude_to_db(C_mag ,ref=np.max)
    return CdB

# CQT Threshold
def cqt_thresholded(cqt,thres=cqt_threshold):
    new_cqt=np.copy(cqt)
    new_cqt[new_cqt<thres]=-120
    return new_cqt

# Onset Envelope from Cqt
def calc_onset_env(cqt):
    return librosa.onset.onset_strength(S=cqt, sr=fs, aggregate=np.mean, hop_length=hop_length)

# Onset from Onset Envelope
def calc_onset(cqt, pre_post_max=pre_post_max, backtrack=True):
    onset_env=calc_onset_env(cqt)
    onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env,
                                           sr=fs, units='frames', 
                                           hop_length=hop_length, 
                                           backtrack=backtrack,
                                           pre_max=pre_post_max,
                                           post_max=pre_post_max)
    onset_boundaries = np.concatenate([[0], onset_frames, [cqt.shape[1]]])
    onset_times = librosa.frames_to_time(onset_boundaries, sr=fs, hop_length=hop_length)
    return [onset_times, onset_boundaries, onset_env]

# Convert Seconds to Quarter-Notes
def time_to_beat(duration, tempo):
    return (tempo*duration/60)

# Remap input to 0-1 for Sine Amplitude or to 0-127 for MIDI
def remap(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

# Generate Sinewave, MIDI Notes and music21 notes
def generate_sine_midi_note(f0_info, sr, n_duration, round_to_sixtenth=True):
    f0=f0_info[0]
    A=remap(f0_info[1], CdB.min(), CdB.max(), 0, 1)
    duration = librosa.frames_to_time(n_duration, sr=fs, hop_length=hop_length)
    #Generate Midi Note and music21 note
    note_duration = 0.02*np.around(duration/2/0.02) # Round to 2 decimal places for music21 compatibility
    midi_duration = time_to_beat(duration, tempo)
    midi_velocity=int(round(remap(f0_info[1], CdB.min(), CdB.max(), 0, 127)))
    if round_to_sixtenth:
        midi_duration=round(midi_duration*16)/16
    if f0==None:
        midi_note=None
        note_info=Rest(type=mm.secondsToDuration(note_duration).type)
        f0=0
    else:
        midi_note=round(librosa.hz_to_midi(f0))
        #note = Note(librosa.midi_to_note(midi_note).replace('♯','#'), type=mm.secondsToDuration(note_duration).type)
        note = Note(librosa.midi_to_note(midi_note).replace('♯','#'), type=aprox(midi_duration))
        #print("type: "+aprox(midi_duration)+" duration: "+str(midi_duration))
        note.volume.velocity = midi_velocity
        note_info = [note]
    midi_info = [midi_note, midi_duration, midi_velocity]
            
    # Generate Sinewave
    n = np.arange(librosa.frames_to_samples(n_duration, hop_length=hop_length ))
    sine_wave = A*np.sin(2*np.pi*f0*n/float(sr))
    return [sine_wave, midi_info, note_info]

#Estimate Pitch
def estimate_pitch(segment, threshold):
    freqs = librosa.cqt_frequencies(n_bins=n_bins, fmin=librosa.note_to_hz('C1'),
                            bins_per_octave=12)
    if segment.max()<threshold:
        return [None, np.mean((np.amax(segment,axis=0)))]
    else:
        f0 = int(np.mean((np.argmax(segment,axis=0))))
    return [freqs[f0], np.mean((np.amax(segment,axis=0)))]

# Generate notes from Pitch estimation
def estimate_pitch_and_notes(x, onset_boundaries, i, sr):
    n0 = onset_boundaries[i]
    n1 = onset_boundaries[i+1]
    f0_info = estimate_pitch(np.mean(x[:,n0:n1],axis=1),threshold=cqt_threshold)
    return generate_sine_midi_note(f0_info, sr, n1-n0)


global CdB
CdB = calc_cqt(x,fs,hop_length, n_bins, mag_exp)
new_cqt=cqt_thresholded(CdB,cqt_threshold)
global onsets
onsets=calc_onset(new_cqt,pre_post_max, True)
    

# Estimate Tempo
tempo, beats=librosa.beat.beat_track(y=None, sr=fs, onset_envelope=onsets[2], hop_length=hop_length,
               start_bpm=120.0, tightness=100, trim=True, bpm=None,
               units='frames')
tempo=int(2*round(tempo/2))
mm = MetronomeMark(referent='quarter', number=tempo)


# Array of music information - Sinewave, MIDI Notes and muisc21 Notes
notes=[]
for i in range(len(onsets[1])-1):
  notes.append(estimate_pitch_and_notes(CdB, onsets[1], i, sr=fs))
music_info=np.array(notes, dtype=object)


# Get muisc21 notes
note_info = list(music_info[:,2])

aux   = []
cont  = -1
resta = 0

for n in note_info:
    cont+=1
    if cont == 0:
        if not isinstance(n, Rest):
            if n[0].duration.quarterLength < 0.2:
                resta = n[0].duration.quarterLength
            else:
                aux.append(n)
        else:
            if n.duration.quarterLength < 0.2:
                resta = n.duration.quarterLength
            else:
                aux.append(n)
        continue
    if not isinstance(n, Rest):
        #print("Note: %s%d duración-%0.4f" % (n[0].pitch.name, n[0].pitch.octave, n[0].duration.quarterLength))
        #n[0]._activeSiteStoredOffset = n[0]._activeSiteStoredOffset - resta
        aux.append(n)
    else:
        #n._activeSiteStoredOffset = n._activeSiteStoredOffset - resta
        aux.append(n)
        #print(n)
        
note_info = aux


# Create music21 stream
s = Stream()
s.append(mm)
instr = instrument.fromString('piano')
instr.midiChannel=0
#instr.midiProgram=30  #Set program to Overdriven Guitar
s.append(instr)
s.insert(0, metadata.Metadata())
s.metadata.title = Title
s.metadata.composer = Composer
for note in note_info:
    s.append(note)
    
# Analyse music21 stream to get song Key
key=s.analyze('key')
# Insert Key to Stream
s.insert(0, key)


# Save MIdi to file
s.write('midi', 'music21.mid')