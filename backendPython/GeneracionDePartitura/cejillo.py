#Script para probar reconocimiento de acordes y output de busqueda de los acordes en el json

import music21, json, logging
import mingus.core.chords as chords
logging.basicConfig(level=logging.INFO, format='%(levelname)-8s: %(message)s')

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

#diccionario de acordes, la clave es el nombre del acorde, p.e. Cm7
#el valor es una lista con dos listas dentro, la primera con maneras de tocar el acorde usando cejillos, la segunda con maneras de tocar el acorde sin cejillos
#las maneras de tocar los acordes se representan con una lista de strings, p.e. ["x", "1", "2", "3", "4", "0"] es un acorde donde la primera cuerda no se toca, la segunda cuerda se toca en el traste 1, la tercera cuerda se toca en el traste 2, etc.
acordes = {}
with open('backendPython/GeneracionDePartitura/acordes_v2.json', 'r') as file:
    acordes = json.loads(file.read())

inp = input("Introduce las notas del acorde: ")
while inp:
    acorde = music21.chord.Chord(inp.split(" - "))
    m21 = acorde.pitchedCommonName
    custom = chord_notation(chords.determine(inp.split(" - "), True)[0])
    logging.debug(f'Acorde según music21: {m21}')
    logging.debug(f'Acorde según music21: {acorde.fullName}')
    logging.info(f'Acorde según amingus: {chords.determine(inp.split(" - "), True)}')
    logging.info(f'Acorde según la función: {custom}')
    

    if custom in acordes:
        logging.info(f'Posible manera de tocar el acorde con cejillos: {acordes[custom][0][0]}')
        logging.info(f'Posible manera de tocar el acorde sin cejillos: {acordes[custom][1][0]}')
    else:
        logging.error(f"Acorde no encontrado: {custom} a partir de {chords.determine(inp.split(' - '), True)[0]}")
        
    inp = input("\nIntroduce las notas del acorde: ")