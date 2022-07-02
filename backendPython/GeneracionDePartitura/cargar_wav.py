import librosa

def cargar(filename):
    x, fs = librosa.load(filename, sr=None, mono=True)
    x, fs = librosa.load(filename, sr=None, mono=True, duration=(x.shape[0]/fs)-1)
    return x, fs