import pretty_midi
import copy

def simplificar_acordes(midi_path, output, nota_corte = 60, notas_por_acorde = 2):
    """Simplifica los acordes de la partitura midi y lo guarda en output

    Args:
        midi_path (string): Ruta del archivo midi
        output (string): Ruta donde se guardara el archivo midi con los acordes simplificados
        nota_corte (int): Nota que se considera como corte
        notas_por_acorde (int): Cantidad de notas que tendrán los acordes simplificados
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
    piano_program = pretty_midi.instrument_name_to_program('Acoustic Grand Piano')
    piano = pretty_midi.Instrument(program=piano_program)
    
    for instrument in mid.instruments:
        #acordes en la mano izquierda
        notas = sorted(instrument.notes, key=lambda x: (x.start, -x.pitch))
        notas_en_acorde = 0
        ultimo_tiempo = -1
        for n in notas:
            if(n.pitch < nota_corte):
                continue
            if(n.start == ultimo_tiempo):
                notas_en_acorde += 1
                if(notas_en_acorde<=notas_por_acorde):
                    piano.notes.append(n)
            else:
                piano.notes.append(n)
                notas_en_acorde=1
            ultimo_tiempo=n.start
            
        #acordes en la mano derecha
        notas = sorted(instrument.notes, key=lambda x: (x.start, -x.pitch))
        notas_en_acorde = 0
        ultimo_tiempo = -1
        for n in notas:
            if(n.pitch >= nota_corte):
                continue
            if(n.start == ultimo_tiempo):
                notas_en_acorde += 1
                if(notas_en_acorde<=notas_por_acorde):
                    piano.notes.append(n)
            else:
                piano.notes.append(n)
                notas_en_acorde=1
            ultimo_tiempo=n.start
            
    result.instruments.append(piano)        
    
    result.write(output)       

#simplificar_acordes("backendPython/GeneracionDePartitura/test/sparkle_new.mid", "backendPython/GeneracionDePartitura/test/test_simplificar_acordes.mid", 60)