import music21
from tabs import open_midi

midi = open_midi("backendPython/GeneracionDePartitura/test/piano.mid")
midi.show('text')


llave=None
for i in midi.recurse():
    if isinstance(i, music21.key.Key):
        llave = i
        break
print(llave)

#cambio puede ir desde -11 a 11
cambio = 10

#lista de llaves musicales
llaves=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

nueva_llave = music21.key.Key(llaves[(llaves.index(llave.tonic.name)+cambio)%12], llave.mode)
print(nueva_llave)

if((llaves.index(llave.tonic.name)+cambio)%12 != llaves.index(llave.tonic.name)+cambio):
    print("Cambio de octava")
    if(cambio>0):
        #subir una octava
        midi.transpose(12, inPlace=True)
        pass
    else:
        #bajar una octava
        midi.transpose(-12, inPlace=True)
        pass

inter = music21.interval.Interval(llave.tonic, nueva_llave.tonic)
print(inter)

midi_nuevo = midi.transpose(inter)
#midi_nuevo.show('text')

midi_nuevo.write('midi', fp="backendPython/GeneracionDePartitura/test/test_tono.mid")