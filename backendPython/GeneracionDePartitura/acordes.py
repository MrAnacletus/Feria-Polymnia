import pretty_midi

def simplificar_acordes(midi_path, output, nota_corte = 60, notas_por_acorde = 2, threshold = 0.05):
    """Simplifica los acordes de la partitura midi y lo guarda en output

    Args:
        midi_path (string): Ruta del archivo midi
        output (string): Ruta donde se guardara el archivo midi con los acordes simplificados
        nota_corte (int): Nota que se considera como corte
        notas_por_acorde (int): Cantidad de notas que tendrán los acordes simplificados
        threshold (float): Umbral para considerar que dos notas son tocadas al mismo tiempo
    """    
    mid = pretty_midi.PrettyMIDI(midi_path)
    
    tempo = 0
    for t in mid.get_tempo_changes():
        if(t[0] != 0):
            tempo = t[0]
            break
    if(tempo == 0):
        tempo = mid.estimate_tempo()
    
    result = pretty_midi.PrettyMIDI(initial_tempo=tempo, resolution=mid.resolution)
    #obtener instrument program del midi original
    programa = mid.instruments[0].program
    #piano_program = pretty_midi.instrument_name_to_program('Acoustic Grand Piano')
    instrumento = pretty_midi.Instrument(program=programa)
    
    for instrument in mid.instruments[:1]:
        #acordes en la mano izquierda
        notas = sorted(instrument.notes, key=lambda x: (x.start, -x.pitch))
        notas_en_acorde = 0
        ultimo_tiempo = -1
        for n in notas:
            if(n.pitch < nota_corte):
                continue
            if(n.start - ultimo_tiempo <= threshold):
                notas_en_acorde += 1
                if(notas_en_acorde<=notas_por_acorde):
                    instrumento.notes.append(n)
            else:
                instrumento.notes.append(n)
                notas_en_acorde=1
            ultimo_tiempo=n.start
            
        #acordes en la mano derecha
        notas = sorted(instrument.notes, key=lambda x: (x.start, -x.pitch))
        notas_en_acorde = 0
        ultimo_tiempo = -1
        for n in notas:
            if(n.pitch >= nota_corte):
                continue
            if(n.start - ultimo_tiempo <= threshold):
                notas_en_acorde += 1
                if(notas_en_acorde<=notas_por_acorde):
                    instrumento.notes.append(n)
            else:
                instrumento.notes.append(n)
                notas_en_acorde=1
            ultimo_tiempo=n.start
            
    result.instruments.append(instrumento)
    
    result.write(output)

simplificar_acordes("backendPython/GeneracionDePartitura/test/inception_mt3.mid", "backendPython/GeneracionDePartitura/test/test_simplificar_acordes.mid")