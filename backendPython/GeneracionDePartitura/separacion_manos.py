import music21
from tabs import open_midi

midi = open_midi("backendPython/GeneracionDePartitura/test/piano.mid")

#midi.show('text')

izq = music21.stream.Score()
der = music21.stream.Score()
todo = music21.stream.Score()
print(midi)
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

for i in der.recurse():
    #if i is note, print all note information, else, print i
    if isinstance(i, music21.note.Note):
        print(i.name, i.octave, i.quarterLength, i.offset, i.tie)        
    else:
        print(i)

#Falta agregarle el tempo a la mano izquierda
#print("izq")
#izq.show('text')
#izq.write('midi', fp="backendPython/GeneracionDePartitura/test/test_izq.mid")

#print("der")
#der.show('text')
der.write('midi', fp="backendPython/GeneracionDePartitura/test/test_der.mid")

#todo.write('midi', fp="backendPython/GeneracionDePartitura/test/test_todo.mid")

#midi.write('midi', fp="backendPython/GeneracionDePartitura/test/test_midi.mid")

""" der_midi = open_midi("backendPython/GeneracionDePartitura/test/test_der.mid")

print("-----------------------------------------------")
for i in der_midi.recurse():
    #if i is note, print all note information, else, print i
    if isinstance(i, music21.note.Note):
        print(i.name, i.octave, i.quarterLength, i.offset)        
    else:
        print(i)
 """