import music21

def simplificar_acordes(midi_path, output):
    m= music21.converter.parse(midi_path)

    for chord in m.recurse().getElementsByClass('Chord'):
        n = chord.notes
        chord.notes=n[-3:]
        
    m.write('midi', fp=output)

simplificar_acordes("backendPython/GeneracionDePartitura/test/piano3.mid", "backendPython/GeneracionDePartitura/test/test_simplificar_acordes.mid")