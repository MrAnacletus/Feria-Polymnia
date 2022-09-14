# Script for generating tablatures from MIDI files
import numpy as np
np.set_printoptions(linewidth=np.inf)
import music21
from itertools import product
import numpy as np
# sudo pip3 install fpdf
from fpdf import FPDF

def unique_product(*l, repeat=1):
    """Cartesian product of input iterables, ignoring repeated elements"""
    prod = []
    for combo in product(*l, repeat=repeat):
        if len(set(combo)) == len(combo):  #  all values unique
            prod.append(combo)
    return prod

def open_midi(midi_path):
    """Open MIDI file"""
    """ mf = music21.midi.MidiFile()
    mf.open(midi_path)
    mf.read()
    mf.close()
    if (remove_drums):
        for i in range(len(mf.tracks)):
            mf.tracks[i].events = [ev for ev in mf.tracks[i].events if ev.channel != 10]   
    s = music21.midi.translate.midiFileToStream(mf)"""  

    s = music21.converter.parse(midi_path)
        
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
    for i in range(len(strings)):
        tab_print[i]+=strings[i][0]
        tab_print[i]+="|"
        
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
                to_print.append(tab_print[st][i*max_length:(i+1)*max_length])
            to_print.append(" ")
    else:
        for st in range(len(tab_print)):
            to_print.append(tab_print[st])
    return to_print

def get_notes(midi):
    """Get notes from MIDI"""
    notes = []

    for note in midi.recurse().notes:
        if(isinstance(note, music21.note.Note)):
            notes.append(note_to_num(note.nameWithOctave))
        elif(isinstance(note, music21.chord.Chord)):
            notes.append([note_to_num(n.nameWithOctave) for n in note])
   
    # print(notes)
    return notes

def place_note(note, prev, note_table, frets):
    """Place a note in the tablature in relation to the previous note, so it is easier to play
    TODO: Improve algorithm, if previous note was placed without pressing a fret, 
    then its fret value(0) sould not be taken into account.
    Do something with notes that are not in the instrument range

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

def place_chord(chord, note_table, strings_num, frets):
    """Place a chord in the tablature
    TODO: Do something if some notes cant be played
    
    Args:
        chord (int array): MIDI numerical values of the notes of the chord to place
        note_table (2D int array): array with information of the notes in the format of [string,fret]
        strings_num (int array): array with MIDI note numbers of the strings
        frets (int): number of frets of the instrument

    Returns:
        2D int array: array with information of the placed notes in the format of [string,fret]
    """
    # Strings that can play the note, and the fret where it is played
    candidates = []
    l=[]
    for note in chord:
        candidate_positions = [[note_table.index(x), x.index(note)] for x in note_table if note in x]
        # print(candidate_positions)
        candidates.append(candidate_positions)
        l.append([x[0] for x in candidate_positions])
        
    # print("l: "+str(l))
        
    result = []  
    dist=1000
    temp=[]    
    uni = unique_product(*l)
    # print("uni: "+str(uni))
    if(len(uni)==0):
        print("could not place chord "+str(chord))
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
    # print("Res: "+str(result))
    return result

def create_tab_array(notes, note_table, strings_num, frets):
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
        if(isinstance(note, int)):
            tab.append(place_note(note, prev, note_table, frets))
            prev = tab[-1]
        elif(isinstance(note, list)):
            tab.append(place_chord(note, note_table, strings_num, frets))
            prev = tab[-1][0]
    return tab

def get_tab(midi_path, strings=["E4","B3","G3","D3","A2","E2"], frets=21, max_lenght=77, generate_file=False, file_path="", title="", author=""):
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
    """       
    if isinstance(strings, str):
        if strings.lower() == "guitar":
            strings=["E4","B3","G3","D3","A2","E2"]
        elif strings.lower() == "bass":
            strings=["G2","D2","A1","E1"]
        elif strings.lower() == "ukulele":
            strings=["G4","C4","E4","A3"]

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
    tabs = create_tab_array(notes, note_table, strings_num, frets)
    p = format_tablature(tabs, strings, max_length=max_lenght)
    if(generate_file):
        pdf = FPDF()
 
        # Add a page
        pdf.add_page()
        
        # Title
        pdf.set_font('Times', 'B', 14)
        pdf.cell(200, 10, title, align = 'C', ln = 1)
        
        # Author
        pdf.set_font('Times', '', 12)
        pdf.cell(200, 10, txt = author, ln = 2, align = 'C')
        
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

