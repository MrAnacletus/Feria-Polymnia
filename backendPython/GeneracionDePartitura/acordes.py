import music21
from tabs import open_midi

def simplificar_acordes(midi, output):
    m=open_midi(midi)

    for chord in m.recurse().getElementsByClass('Chord'):
        n = chord.notes
        chord.notes=n[-3:]
        
    m.write('midi', fp=output)

simplificar_acordes("backendPython/GeneracionDePartitura/test/piano3.mid", "backendPython/GeneracionDePartitura/test/test_simplificar_acordes.mid")