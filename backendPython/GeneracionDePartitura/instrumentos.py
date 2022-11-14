import pretty_midi
import music21

instrumentos = {
    "0": "Piano",
    "1": "Piano",
    "2": "Piano",
    "24": "Guitarra acústica",
    "25": "Guitarra acústica",
    "26": "Guitarra eléctrica",
    "27": "Guitarra eléctrica",
    "28": "Guitarra eléctrica",
    "29": "Guitarra eléctrica",
    "33": "Bajo",
    "34": "Bajo",
    "40": "Violín",
    "41": "Viola",
    "42": "Violoncello",
    "43": "Contrabajo",
    "74": "Flauta",
    "76": "Flauta"
    }

traducción = {"Piano": "Piano",
        "Acoustic Guitar": "Guitarra acústica",
        "Electric Guitar": "Guitarra eléctrica",
        "Bass": "Bajo",
        "Electric Bass": "Bajo",
        "Violin": "Violín",
        "Viola": "Viola",
        "Violoncello": "Violoncello",
        }

def filtro(midi_path):
    s = music21.converter.parse(midi_path+".mid")

    note_threshold = 10

    partStream = s.parts.stream()
    sacar = []
    sacar_t = []
    inst_temp = []
    perc = 0
    notas_totales=0
    for p in partStream:
        notes = 0
        for note in p.recurse():
            if(isinstance(note, music21.note.Note)):
                notes+=1
                notas_totales+=1
            elif(isinstance(note, music21.chord.Chord)):
                notes+=len(note.pitches)
                notas_totales+=len(note.pitches)
        inst_temp.append([p.partName, notes])
    filtro = (notas_totales)*0.03
    #print(filtro)
    for i in inst_temp:
        if i[1] < filtro:
            sacar.append(i[0])
    for i in sacar:
        for j in traducción:
            if i == j:
                sacar_t.append(traducción[j])
    return sacar_t

"""def reconocer_instrumentos(midi):
    instrumentos_presentes = []
    midi_data = pretty_midi.PrettyMIDI(midi+'.mid')
    for instrument in midi_data.instruments:
        if instrument.is_drum:
            instrumentos_presentes.append("Batería")
        for i in instrumentos.keys():
            if str(instrument.program) == i:
                if instrumentos[i] not in instrumentos_presentes:
                    instrumentos_presentes.append(instrumentos[i])
    return instrumentos_presentes"""

def reconocer_instrumentos(midi):
    instrumentos_presentes = []
    instrumentos_filtrados = []
    midi_data = pretty_midi.PrettyMIDI(midi+'.mid')
    print("original: ", midi_data.instruments)
    for instrument in midi_data.instruments:
        if instrument.is_drum:
            instrumentos_presentes.append("Batería")
        for i in instrumentos.keys():
            if str(instrument.program) == i:
                if instrumentos[i] not in instrumentos_presentes:
                    instrumentos_presentes.append(instrumentos[i])
    filtros = filtro(midi)
    #print(filtros)
    #print(instrumentos_presentes)
    for j in instrumentos_presentes:
        if j not in filtros:
            instrumentos_filtrados.append(j)
    print("filtrados: ", instrumentos_filtrados)
    return instrumentos_filtrados

#print(reconocer_instrumentos("daniel2"))

def get_programs(midi):
    midi_data = pretty_midi.PrettyMIDI(midi+'.mid')
    new_midi = pretty_midi.PrettyMIDI()
    for instrument in midi_data.instruments:
            print(instrument.program)
    #a = midi_data.instruments[2]
    #b = midi_data.instruments[9]
    #new_midi.instruments.append(a)
    #new_midi.instruments.append(b)
    #new_midi.write('eye2.mid')

#get_programs("aleluya")

def limpiar_midi(midi, instrumento):
    l_instrumentos = []
    midi_data = pretty_midi.PrettyMIDI(midi+'.mid')
    midi_limpio = pretty_midi.PrettyMIDI()
    if instrumento == "Batería":
        for instrument in midi_data.instruments:
            if instrument.is_drum:
                midi_limpio.instruments.append(instrument)
    else:
        for i in instrumentos:
            if instrumentos[i] == instrumento:
                l_instrumentos.append(i)
        for instrument in midi_data.instruments:
            if str(instrument.program) in l_instrumentos and not instrument.is_drum:
                midi_limpio.instruments.append(instrument)
    midi_limpio.write(midi+'_new'+'.mid')

#limpiar_midi("aleluya", "0")


    

#get_programs("eye")
"""new_midi = pretty_midi.PrettyMIDI()
a = midi_data.instruments[1]
b = midi_data.instruments[2]
c = midi_data.instruments[3]
k = midi_data.instruments[0]
new_midi.instruments.append(a)
new_midi.instruments.append(b)
new_midi.instruments.append(c)
new_midi.instruments.append(k)
# Print an empirical estimate of its global tempo
print(midi_data.estimate_tempo())

#for instrument in midi_data.instruments:
    #print(instrument)
new_midi.write('aleluya3.mid')
print(midi_data.instruments[1])"""