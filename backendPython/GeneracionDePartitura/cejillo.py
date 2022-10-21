import music21
from pychord import find_chords_from_notes

doMayor = [60, 63, 67, 71]

acorde = music21.chord.Chord(doMayor)
#print(acorde.root())
#print(acorde.commonName)
print(acorde.pitchedCommonName)
#print(acorde.pitches)
print(acorde.pitchNames)
#print(acorde.sortAscending())

def chord_notation(chord):
    """Change the chord notation, p.e. from  C-major-third to C or from C-minor-third to Cm

    Args:
        chord (string): Chord

    Returns:
        string: chord notation
    """    
    #words to delete
    ban = ["major", "-", "triad", " ", "tetrachord", "chord"]
    
    chord = chord.replace("dominant seventh", "7")
    chord = chord.replace("major seventh", "maj7")
    chord = chord.replace("seventh", "7")
    chord = chord.replace("minor", "m")
    chord = chord.replace("third", "3")
    chord = chord.replace("fifth", "5")
    chord = chord.replace("ninth", "9")
    chord = chord.replace("eleventh", "11")
    chord = chord.replace("thirteenth", "13")
    chord = chord.replace("diminished", "dim")
    chord = chord.replace("augmented", "aug")
    
    for b in ban:
        chord = chord.replace(b, "")
    
    #Faltan los suspendidos, que en music21 aparecen como quartal, falta averiguar
    #chord = chord.replace("quartal", "sus")
    
    print(chord)

chord_notation(acorde.pitchedCommonName)