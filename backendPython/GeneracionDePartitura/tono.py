import music21
from tabs import open_midi

def cambiar_tono(midi, cambio, output):
    """Cambia el tono de la partitura midi en cambio semitonos y lo guarda en output

    Args:
        midi (string): Ruta del archivo midi
        cambio (int): Cantidad de semitonos a cambiar, puede ir desde -11 a 11
        output (string): Ruta donde se guardara el archivo midi con el cambio de tono
    """    
    midi = open_midi(midi)
    #midi.show('text')

    llave=None
    for i in midi.recurse():
        if isinstance(i, music21.key.Key):
            llave = i
            break
    #print(llave)

    #lista de llaves musicales
    llaves=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

    nueva_llave = music21.key.Key(llaves[(llaves.index(llave.tonic.name)+cambio)%12], llave.mode)
    #print(nueva_llave)

    if((llaves.index(llave.tonic.name)+cambio)%12 != llaves.index(llave.tonic.name)+cambio):
        #print("Cambio de octava")
        if(cambio>0):
            #subir una octava
            midi.transpose(12, inPlace=True)
        else:
            #bajar una octava
            midi.transpose(-12, inPlace=True)

    inter = music21.interval.Interval(llave.tonic, nueva_llave.tonic)
    #print(inter)

    midi_nuevo = midi.transpose(inter)
    #midi_nuevo.show('text')

    midi_nuevo.write('midi', fp=output)
    
cambiar_tono("backendPython/GeneracionDePartitura/test/piano.mid", 9, "backendPython/GeneracionDePartitura/test/test_cambio_tono.mid")