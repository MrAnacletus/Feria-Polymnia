import music21
import json

def chord_notation(chord):
    """Change the chord notation, p.e. from  C-major-third to C or from C-minor-third to Cm

    Args:
        chord (string): Chord(output de chord.pitchedCommonName)

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
    
    return chord

#diccionario de acordes, la clave es el nombre del acorde, p.e. Cm7
#el valor es una lista con dos listas dentro, la primera con maneras de tocar el acorde usando cejillos, la segunda con maneras de tocar el acorde sin cejillos
#las maneras de tocar los acordes se representan con una lista de strings, p.e. ["x", "1", "2", "3", "4", "0"] es un acorde donde la primera cuerda no se toca, la segunda cuerda se toca en el traste 1, la tercera cuerda se toca en el traste 2, etc.
acordes = {}
with open('backendPython/GeneracionDePartitura/acordes.json', 'r') as file:
    acordes = json.loads(file.read())


inp = input("Introduce las notas del acorde: ")

acorde = music21.chord.Chord(inp.split())
print(f'Acorde según music21: {acorde.pitchedCommonName}')
print(f'Acorde según la función: {chord_notation(acorde.pitchedCommonName)}')
print(f'Posible manera de tocar el acorde con cejillos: {acordes[chord_notation(acorde.pitchedCommonName)][0][0]}')
print(f'Posible manera de tocar el acorde sin cejillos: {acordes[chord_notation(acorde.pitchedCommonName)][1][0]}')