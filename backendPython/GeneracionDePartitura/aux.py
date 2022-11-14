import pretty_midi, numpy as np
from tabs import *

midi = pretty_midi.PrettyMIDI("backendPython/GeneracionDePartitura/test/sparkle_new.mid")

notes = get_notes(midi)

# String notes
strings=["E4","B3","G3","D3","A2","E2"]
strings_num = np.array(list(map(note_to_num, strings)))

# 2D array with MIDI numerical values of the instrument's notes
note_table = [list(range(x, x+21)) for x in map(note_to_num, strings)]

tabs = create_tab_array(notes, note_table, strings_num, 21)
p = format_tablature(tabs, strings, max_length=100)
for x in p:
    print(x)

