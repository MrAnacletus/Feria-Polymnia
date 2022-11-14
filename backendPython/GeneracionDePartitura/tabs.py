# Script for generating tablatures from MIDI files
import numpy as np, pretty_midi, json, logging, music21
import mingus.core.chords as chords
from itertools import combinations
logging.basicConfig(level=logging.ERROR, format='%(levelname)-8s: %(message)s')
np.set_printoptions(linewidth=np.inf)
from itertools import product
from fpdf import FPDF

#diccionario de acordes, la clave es el nombre del acorde, p.e. Cm7
#el valor es una lista con dos listas dentro, la primera con maneras de tocar el acorde usando cejillos, la segunda con maneras de tocar el acorde sin cejillos
#las maneras de tocar los acordes se representan con una lista de strings, p.e. ["x", "1", "2", "3", "4", "0"] es un acorde donde la primera cuerda no se toca, la segunda cuerda se toca en el traste 1, la tercera cuerda se toca en el traste 2, etc.
global acordes
acordes = {}

def unique_product(*l, repeat=1):
    """Cartesian product of input iterables, ignoring repeated elements"""
    prod = []
    for combo in product(*l, repeat=repeat):
        if len(set(combo)) == len(combo):  #  all values unique
            prod.append(combo)
    return prod

def open_midi(midi_path):
    """Open MIDI file""" 

    s = pretty_midi.PrettyMIDI(midi_path)
        
    return s

def note_to_num(s):
    """Get midi note number from name

    Args:
        s (string): name of the note(p.e. "C4")

    Returns:
        int: midi note number(p.e. 60)
    """
    d = {"C":0,"D":2,"E":4,"F":5,"G":7,"A":9,"B":11}
    num = 0
    num += (int(s[-1])+1)*12
    num += d[s[0]]
    if(len(s)>=3):
        num += s.count("# ") - s.count("-")
    return num

def num_to_note(n):
    """Get midi note name from number

    Args:
        n (int): midi note number(p.e. 60)

    Returns:
        string: name of the note(p.e. "C4")
    """
    d = {0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"}
    s = str(int(n/12)-1)
    note = n%12
    if(note not in d.keys()):
        note-=1
        s = "# "+s
    s=d[note]+s
    return s

def format_tablature(tablature, strings, max_length=100):
    """Formats tablature for printing

    Args:
        tablature (2D int array): array with information of the notes in the format of [string,fret]
        max_length (int, optional): Max length of the strings to print(to adjust for page width) . Defaults to 100.
    
    Returns:
        string array: array with lines of the tablature to print
    """
    tab_print = ["" for _ in range(len(strings))]

    # First line
    #for i in range(len(strings)):
        #tab_print[i]+=strings[i][0]
        #tab_print[i]+="|"
        
    for note in tablature:
        for i in range(len(strings)):
            tab_print[i]+="--"

        guiones = 1
        if(not isinstance(note[0], list)):
            if note[1]>=10:
                guiones=2
            for i in range(len(strings)):
                if i==note[0]:
                    tab_print[i]+=str(note[1])
                else:
                    tab_print[i]+="-"*guiones
        else:
            for n in note:
                if n[1]>=10:
                    guiones=2
            for i in range(len(strings)):
                used = False
                for j in range(len(note)):
                    if i==note[j][0]:
                        tab_print[i]+=str(note[j][1])
                        #if the fret number is a numebr of one digit, add a "-" to keep the format
                        if guiones==2 and len(str(note[j][1]))==1:
                            tab_print[i]+="-"
                        used = True
                if(not used):
                    tab_print[i]+="-"*guiones

    to_print=[]
    
    """ if(len(tab_print[0])>max_length):
        lineas = int(len(tab_print[0])/max_length)+1
        for i in range(lineas):
            for st in range(len(tab_print)):
                print(tab_print[st][i*max_length:(i+1)*max_length])
            print(" ")
    else:
        for st in range(len(tab_print)):
            print(tab_print[st]) """
    if(len(tab_print[0])>max_length):
        lineas = int(len(tab_print[0])/max_length)+1
        for i in range(lineas):
            for st in range(len(tab_print)):
                cuerda = strings[st][0]+"|"
                to_print.append(cuerda+tab_print[st][i*max_length:(i+1)*max_length])
            to_print.append(" ")
    else:
        for st in range(len(tab_print)):
            to_print.append(tab_print[st])
    
    #print(to_print)
    return to_print

def get_notes(midi, threshold=0.05, notas_por_acorde=6):
    """Get notes from MIDI"""
    lista = []

    """ for note in midi.recurse().notes:
        if(isinstance(note, music21.note.Note)):
            notes.append(note_to_num(note.nameWithOctave))
        elif(isinstance(note, music21.chord.Chord)):
            notes.append([note_to_num(n.nameWithOctave) for n in note]) """
            
    notas = sorted(midi.instruments[0].notes, key=lambda x: (x.start, -x.pitch))
    notas_en_acorde = 0
    ultimo_tiempo = -1
    for no in notas:
        if(no.start - ultimo_tiempo <= threshold):
            notas_en_acorde += 1
            if(notas_en_acorde<=notas_por_acorde):
                lista[-1].append(no.pitch)
        else:
            lista.append([no.pitch])
            notas_en_acorde=1
        ultimo_tiempo=no.start
    # print(notes)
    return lista

def place_note(note, prev, note_table, frets):
    """Place a note in the tablature in relation to the previous note, so it is easier to play
    TODO: Improve algorithm, if previous note was placed without pressing a fret, 
    then its fret value(0) sould not be taken into account.

    Args:
        note (int): MIDI numerical value of the note to place
        prev (int array): previous note in the format of [string, fret], -1 if "note" is the first placed note
        note_table (2D int array): array with information of the notes in the format of [string,fret]
        frets (int): number of frets of the instrument

    Returns:
        int array: array with information of the placed note in the format of [string,fret]
    """
    # Strings that can play the note, and the fret where it is played
    candidate_positions = [[note_table.index(x), x.index(note)] for x in note_table if note in x]
    if len(candidate_positions)==0:
        # If the note is not in the instrument range, change its value to be in range
        max_note = max([max(x) for x in note_table])
        min_note = min([min(x) for x in note_table])
        while note>max_note:
            note -= 12
        while note<min_note:
            note += 12
        candidate_positions = [[note_table.index(x), x.index(note)] for x in note_table if note in x]

    position = -1
    temp = 1000
    if(prev==-1):
        prev = [0,int(frets/2)]
    for string in candidate_positions:
            if(abs(string[1] - prev[1])<temp):
                temp=abs(string[1] - prev[1])
                position = string
    if(position==-1):
        # panic("could not place note "+str(note))")
        position=[3,5]
    return position

def chord_notation(chord):
    """Change the chord notation, p.e. from  C-major-third to C or from C-minor-third to Cm

    Args:
        chord (string): Chord(output de chord.pitchedCommonName)

    Returns:
        string: chord notation
    """    
    if chord[-1] == "M":
        chord = chord[:-1]
    chord = chord.replace("m/M", "mmaj")
    chord = chord.replace("M6", "6")
    chord = chord.replace("M", "maj")
    
    return chord

def place_chord(chord, note_table, strings_num, frets, cejillo=True, brute_force=False):
    """Place a chord in the tablature
    
    Args:
        chord (int array): MIDI numerical values of the notes of the chord to place
        note_table (2D int array): array with information of the notes in the format of [string,fret]
        strings_num (int array): array with MIDI note numbers of the strings
        frets (int): number of frets of the instrument
        cejillo (bool, optional): If the chord is played with a cejillo. Defaults to True.
        brute_force (bool, optional): If the chord is placed with brute force. Defaults to False.

    Returns:
        2D int array: array with information of the placed notes in the format of [string,fret]
    """
    global acordes
    
    acorde = music21.chord.Chord(chord)
    if(len(set(acorde.pitchNames)) <= 2):
        chord = chord[:2]
    
    result = [] 
    if len(chord)==2 or brute_force:
        # Strings that can play the note, and the fret where it is played(p.e. [[[0,3],[1,5]], [[0,5],[1,7]]])
        candidates = []
        # Strings that can play the notes(p.e. [[0, 1, 2, 4], [0, 1, 2, 3]])
        l=[]
        for note in chord:
            candidate_positions = [[note_table.index(x), x.index(note)] for x in note_table if note in x]
            if len(candidate_positions)==0:
                # If the note is not in the instrument range, change its value to be in range
                max_note = max([max(x) for x in note_table])
                min_note = min([min(x) for x in note_table])
                while note>max_note:
                    note -= 12
                while note<min_note:
                    note += 12
                candidate_positions = [[note_table.index(x), x.index(note)] for x in note_table if note in x]
            # print(candidate_positions)
            candidates.append(candidate_positions)
            l.append([x[0] for x in candidate_positions])
            
        # print("l: "+str(l)) 
        dist=1000
        temp=[]    
        uni = unique_product(*l)
        # print("uni: "+str(uni))
        while(len(uni)==0):
            # drop the last note
            chord = chord[:-1]
            l = l[:-1]
            uni = unique_product(*l)

        else:
            for u in uni:
                for r in range(len(u)):
                    for i in candidates[r]:
                        if(i[0]==u[r]):
                            temp.append(i)
                            break
                # print([x[1] for x in temp])
                if(np.std([x[1] for x in temp])<dist):
                    dist=np.std([x[1] for x in temp])
                    result=temp
                temp=[]
    else:
        #Acorde de 3+ notas
        acorde = music21.chord.Chord(chord)
        m21 = acorde.pitchedCommonName
        #Se quita el numero de la octava de las notas y se ordenan segun la lista n_list
        n_list = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"]
        aux = [x.replace("-", "b") for x in list(set(acorde.pitchNames))]
        n =  sorted(aux, key=lambda x: n_list.index(x))
        det = chords.determine(n, True)
        #Si no se determinó un acorde o si se determinó pero no está en la base de datos
        if len(det) == 0 or chord_notation(chords.determine(n, True)[0]) not in acordes:
            if len(det) == 0:
                logging.error(f"No se reconoció ningún acorde con las notas: {n}, probando combinatoria...")
            else:
                logging.error(f"Acorde no encontrado: {chord_notation(chords.determine(n, True)[0])} a partir de {m21}, notas: {n}, probando combinatorias...")
            #probar eliminando una de las notas del acorde si es que el acorde tiene mas de 3 notas
            if len(n) > 3:
                intentos = []
                
                for num in reversed(range(3, len(n))):
                    intentos += map(list, list(combinations(n, num)))
                for intento in intentos:
                    logging.debug(f'-Intentando con notas: {intento}...')
                    det = chords.determine(intento, True)
                    #Si se determinó un acorde y está en la base de datos
                    if len(det) > 0 and chord_notation(chords.determine(intento, True)[0]) in acordes:
                        logging.info(f"-Se reconoció el acorde {det[0]} con las notas {intento}")
                        n = intento
                        break
                else:
                    logging.error(f"-No se logró encontrar un acorde, se usará fuerza bruta")
                    #result = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]
                    result = place_chord(chord, note_table, strings_num, frets, cejillo, brute_force=True)
                    logging.debug(f'result: {result}')
                    return result
            else:
                logging.error(f"-El acorde tiene 3 notas, no se puede eliminar ninguna, fuerza bruta moment")
                #result = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]
                result = place_chord(chord, note_table, strings_num, frets, cejillo, brute_force=True)
                logging.debug(f'result: {result}')
                return result
        custom = chord_notation(chords.determine(n, True)[0])
        
        logging.info(f'Notas: {acorde.pitchNames}')
        logging.info(f'Notas filtradas: {n}')
        logging.info(f'Acorde según amingus: {chords.determine(n, True)}')
        logging.info(f'Acorde según la función: {custom}')
        logging.debug(f'Acorde según music21: {m21}')

        if custom in acordes:
            #Se encontró el nombre del acorde en la base de datos
            if cejillo:
                if len(acordes[custom][0])>0:
                    #Hay una manera de tocar el acorde con cejillos
                    logging.info(f'Posible manera de tocar el acorde con cejillos: {acordes[custom][0][0]}')
                    r = acordes[custom][0][0]
                else:
                    logging.info(f"No hay forma de tocar {custom} con cejillo, cambiando a sin cejillo")
                    cejillo = False
            if not cejillo:
                if len(acordes[custom][1])>0:
                    #Hay una manera de tocar el acorde sin cejillos
                    logging.info(f'Posible manera de tocar el acorde sin cejillos: {acordes[custom][1][0]}')
                    r = acordes[custom][1][0]
                else:
                    logging.info(f"No hay forma de tocar {custom} sin cejillo, cambiando a la otra cosa que no se que es")
                    if len(acordes[custom][2])>0:
                        #Hay una manera de tocar el acorde
                        logging.info(f'Posible manera de tocar el acorde alternativa: {acordes[custom][2][0]}')
                        r = acordes[custom][2][0]
                    else:
                        logging.error(f"No se encontró cómo tocar {custom}, se usará fuerza bruta")
                        #r = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]
                        r = place_chord(chord, note_table, strings_num, frets, cejillo, brute_force=True)
            for i, fret in enumerate(reversed(r)):
                if fret != 'x':
                    result.append([i, int(fret)])
        else:
            logging.debug(f"Diccionario en place chord: {list(acordes.keys())[:5]}")
            logging.error(f"Acorde no encontrado: {custom} a partir de {m21}, notas: {n}, se usará fuerza bruta")
            #result = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]
            result = place_chord(chord, note_table, strings_num, frets, cejillo, brute_force=True)
    
    logging.debug(f'result: {result}')
    return result

def create_tab_array(notes, note_table, strings_num, frets, cejillo=True):
    """Create a tablature from a list of notes

    Args:
        notes (int array): list of MIDI numerical values of the notes to place
        note_table (2D int array): array with information of the notes in the format of [string,fret]
        strings_num (int array): array with MIDI note numbers of the strings
        frets (int): number of frets of the instrument

    Returns:
        2D int array: array with information of the placed notes in the format of [string,fret]
    """
    tab = []
    prev = -1
    for note in notes:
        if(len(note)==1):
            tab.append(place_note(note[0], prev, note_table, frets))
            prev = tab[-1]
        else:
            tab.append(place_chord(note, note_table, strings_num, frets, cejillo))
            prev = tab[-1][0]
    return tab

def get_tab(midi_path, strings=["E4","B3","G3","D3","A2","E2"], frets=21, max_lenght=77, generate_file=False, file_path="", title="", author="", instrument="", cejillo=True):
    """Generate a tablature from a MIDI file and print it on the console or generate a pdf file with the tablature

    Args:
        midi_path (string): path to the MIDI file
        strings (list, optional): The notes of the strings of the instrument. Also supports writing "guitar", "bass" and "ukelele". Defaults to "guitar": ["E4","B3","G3","D3","A2","E2"].
        frets (int, optional): Number of notes per string. Defaults to 21.
        max_lenght (int, optional): Max length of the strings to print(to adjust for page width) . Defaults to 100.
        generate_file (bool, optional): Generate a pdf file with the tablature, prints on console if false. Defaults to False.
        file_path (str, optional): Path to the file to generate. Defaults to "".
        title (str, optional): Title of the tablature. Defaults to "".
        author (str, optional): Author of the tablature. Defaults to "".
        instrument (str, optional): Instrument of the tablature. Defaults to "".
        cejillo (bool, optional): Use cejillos or not. Defaults to True.
    """       
    if isinstance(strings, str):
        if strings.lower() == "guitar":
            strings=["E4","B3","G3","D3","A2","E2"]
        elif strings.lower() == "bass":
            strings=["G2","D2","A1","E1"]
        elif strings.lower() == "ukulele":
            strings=["A3","E4","C4","G4"]
            
    global acordes
    with open('backendPython/GeneracionDePartitura/acordes_v2.json', 'r') as file:
        acordes = json.loads(file.read())
    logging.debug(f"Diccionario en get tab: {list(acordes.keys())[:5]}")

    base_midi = open_midi(midi_path)
    notes = get_notes(base_midi)

    # String notes
    strings_num = np.array(list(map(note_to_num, strings)))

    # 2D array with MIDI numerical values of the instrument's notes
    note_table = [list(range(x, x+frets)) for x in map(note_to_num, strings)]
    """ 
    Array with the notes of the instrument in the format of [string][fret]
    p.e. guitar with 21 frets:
    note_table=[
        [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84], 
        [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79], 
        [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75], 
        [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70], 
        [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65], 
        [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
    ] 
    """
    # print(np.array([list(map(num_to_note, x)) for x in note_table]))
    tabs = create_tab_array(notes, note_table, strings_num, frets, cejillo)
    p = format_tablature(tabs, strings, max_length=max_lenght)
    if(generate_file):
        pdf = FPDF()
        pdf.set_left_margin(4.0)
        pdf.set_right_margin(4.0)
 
        # Add a page
        pdf.add_page()
        
        # Title
        pdf.set_font('Times', 'B', 14)
        pdf.cell(200, 10, title, align = 'C', ln = 1)
        
        # Author
        pdf.set_font('Times', '', 12)
        pdf.cell(200, 10, txt = author, ln = 2, align = 'C')

        # Instrument
        pdf.set_font('Times', '', 12)
        pdf.cell(195, 10, txt = instrument, ln = 3, align = 'R')
        
        # add another cell
        for line in range(len(p)):
            pdf.set_font('Courier', '', 12)
            pdf.cell(w=0, h=5, txt = p[line], align = '', ln = line+4)
        
        # Save the pdf
        pdf.output(file_path)  
        """ with open(file_path, "w") as f:
            for line in p:
                f.write(line+"\n") """
    else:
        for line in p:
            print(line)

#get_tab("backendPython/GeneracionDePartitura/test/mi_guitarra.mid", generate_file=False, instrument = "guitarra", cejillo=True, max_lenght=140)
#get_tab("backendPython/GeneracionDePartitura/test/mi_guitarra.mid", generate_file=False, instrument = "guitarra", cejillo=False, max_lenght=140)
#get_tab("backendPython/GeneracionDePartitura/test/wonderwall.mid", generate_file=False, instrument = "guitarra", cejillo=True, max_lenght=140)
#get_tab("backendPython/GeneracionDePartitura/test/wonderwall.mid", generate_file=False, instrument = "guitarra", cejillo=False, max_lenght=140)