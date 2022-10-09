import music21
from tabs import open_midi

def derecha_piano(midi, output):
    """Obtiene la mano derecha de un archivo midi de piano y la guarda en output

    Args:
        midi (string): Ruta del archivo midi
        output (string): Ruta donde se guardara el archivo midi de la mano derecha del piano
    """    

    midi = open_midi(midi)

    #midi.show('text')

    izq = music21.stream.Score()
    der = music21.stream.Score()
    todo = music21.stream.Score()

    cont = 0
    for i in midi.parts:
        if(i.partName == "Piano"):
            todo.append(i)
            if(cont == 0):
                der.append(i)
            elif(cont == 1):
                izq.append(i)
                break
            cont += 1

    der.write('midi', fp=output)
    
derecha_piano("backendPython/GeneracionDePartitura/test/piano.mid", "backendPython/GeneracionDePartitura/test/test_derecha_piano.mid")