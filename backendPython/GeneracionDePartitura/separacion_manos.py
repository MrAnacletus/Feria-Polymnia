import music21
import pretty_midi
import copy

def derecha_piano(midi_path, output, nota_corte):
    """Obtiene la mano derecha de un archivo midi de piano y la guarda en output

    Args:
        midi_path (string): Ruta del archivo midi
        output (string): Ruta donde se guardara el archivo midi de la mano derecha del piano
        nota_corte (int): Nota que se considera como corte, se recomienda 60
    """    

    midi = music21.converter.parse(midi_path)

    izq = music21.stream.Score()
    der = music21.stream.Score()
    todo = music21.stream.Score()

    cont = 0
    if(len(midi.parts)>1):
        for i in midi.parts:
            if(i.partName == "Piano"):
                todo.append(i)
                if(cont == 0):
                    der.append(i)
                elif(cont == 1):
                    izq.append(i)
                    break
                cont += 1
        der.write('mid', fp=output)
    else:
        #separar
        mid = pretty_midi.PrettyMIDI(midi_path)
        #low_notes = copy.deepcopy(mid)
        high_notes = copy.deepcopy(mid)

        """ for instrument in low_notes.instruments:
            for note in instrument.notes:
                if note.pitch > nota_corte:
                    note.velocity = 0 """

        for instrument in high_notes.instruments:
            for note in instrument.notes:
                if note.pitch < nota_corte:
                    note.velocity = 0

        #low_notes.write("low_notes.mid")
        high_notes.write(output)
        """ parte = music21.stream.Part()
        temp_measure = music21.stream.Measure()
        #iterar todos los measures
        contador_measures = 0
        for me in midi.recurse().getElementsByClass('Measure'):
            contador_measures+=1
            print(me.__dict__)
            for i in me:
                #agregar todo lo que no sea nota o acorde al measure temporal
                if(not isinstance(i, music21.note.Note) and not isinstance(i, music21.chord.Chord)):
                    temp_measure.append(i)
                #agregar notas mayores o iguales a la nota de corte al measure temporal
                elif(isinstance(i, music21.note.Note)):
                    if(i.pitch.midi >= nota_corte):
                        temp_measure.append(i)
                #agregar notas de los acordes que sean mayores o iguales a la nota de corte al measure temporal
                else:
                    notas_acorde=[]
                    for n in i.notes:
                        if(n.pitch.midi >= nota_corte):
                            notas_acorde.append(n)
                    if(len(notas_acorde)>0):
                        temp_acorde = music21.chord.Chord(notas_acorde)
                        temp_measure.append(temp_acorde)
            #agregar el measure temporal a la parte
            parte.append(temp_measure)
            #limpiar el measure temporal
            temp_measure = music21.stream.Measure()
            
            if(contador_measures >= 4):
                break
        #agregar la parte a la partitura
        der.append(parte) """

    
derecha_piano("backendPython/GeneracionDePartitura/test/sparkle_new.mid", "backendPython/GeneracionDePartitura/test/test_derecha_piano.mid", 60)