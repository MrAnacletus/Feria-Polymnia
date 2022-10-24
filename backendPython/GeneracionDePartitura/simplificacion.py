#Simplificación de partituras, no mas de una nota por mano y menos notas en rapida sucesion

import pretty_midi

def simplificar(midi_path, output, nota_corte = 60, threshold = 0.05):
    """Simplifica el midi y lo guarda en output

    Args:
        midi_path (string): Ruta del archivo midi
        output (string): Ruta donde se guardara el archivo midi con los acordes simplificados
        nota_corte (int): Nota que se considera como corte
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
    
    #lista para almacenar notas despues de eliminar los acordes
    aux_notas = []
    duraciones = []
    #duración de las figuras musicales en función del tempo del midi(60/tempo deberia ser la duracion de una negra)
    figuras = {"cuadrada": 8*60/tempo, "redonda": 4*60/tempo, "blanca": 2*60/tempo, "negra": 60/tempo, "corchea": 30/tempo, "semicorchea": 15/tempo, "fusa": 7.5/tempo}
    
    for instrument in mid.instruments[:1]:
        #VER SI LOS ACORDES SE PUEDEN METER A UNA LISTA PARA SOLO AGREGAR LAS DOS NOTAS MAS ALTAS
        
        #Simplificar acordes
        #acordes en la mano izquierda
        notas = sorted(instrument.notes, key=lambda x: (x.start, -x.pitch))
        ultimo_tiempo = -1
        for n in notas:
            if(n.pitch < nota_corte or n.start - ultimo_tiempo <= threshold):
                continue
            else:
                aux_notas.append(n)
                ultimo_tiempo=n.start
            
        #acordes en la mano derecha
        notas = sorted(instrument.notes, key=lambda x: (x.start, -x.pitch))
        ultimo_tiempo = -1
        for n in notas:
            if(n.pitch >= nota_corte or n.start - ultimo_tiempo <= threshold):
                continue
            else:
                aux_notas.append(n)
                ultimo_tiempo=n.start
                
                
        #Simplificar figuras musicales
        for n in aux_notas:
            duraciones.append(n.end - n.start)
        duraciones = [min(figuras, key=lambda k: abs(figuras[k]-valor)) for valor in duraciones]
        maximo = "corchea"
        #agrupar notas de misma figura musical(segun lista duraciones y diccionario figuras), contiguas(segun start y end en aux_notas) de igual o menor duracion que la variable maximo
        i = 0
        while i < len(aux_notas):
            #print(f'nota {i}, {len(duraciones)} duraciones, {len(aux_notas)} notas')
            if figuras[duraciones[i]] > figuras[maximo]:
                i+=1
                continue
            if duraciones[i] == duraciones[i+1] and aux_notas[i+1].start - aux_notas[i].end <= figuras[duraciones[i]]/2:
                aux_notas[i].end = aux_notas[i+1].end
                aux_notas[i].velocity = max(aux_notas[i].velocity, aux_notas[i+1].velocity)
                aux_notas.pop(i+1)
                duraciones[i] = min(figuras, key=lambda k: abs(figuras[k]-(aux_notas[i].end-aux_notas[i].start)))
                duraciones.pop(i+1)
            i+=1
        for n in aux_notas:
            instrumento.notes.append(n)
            
    result.instruments.append(instrumento)
    result.write(output)

#simplificar("backendPython/GeneracionDePartitura/test/test.mid", "backendPython/GeneracionDePartitura/test/test_simplificacion.mid", 0)