import music21
import pretty_midi
import copy

def derecha_piano(midi_path, output, nota_corte):
    """Obtiene la mano derecha de un archivo midi de piano y la guarda en output

    Args:
        midi_path (string): Ruta del archivo midi
        output (string): Ruta donde se guardara el archivo midi de la mano derecha del piano
        nota_corte (int): Nota que se considera como corte, se recomienda 60
    """   

    mid = pretty_midi.PrettyMIDI(midi_path)
    #low_notes = copy.deepcopy(mid)
    high_notes = copy.deepcopy(mid)

    """ for instrument in low_notes.instruments:
        for note in instrument.notes:
            if note.pitch > nota_corte:
                note.velocity = 0 """

    for instrument in high_notes.instruments:
        for note in instrument.notes:
            if note.pitch < nota_corte:
                note.velocity = 0

    #low_notes.write("low_notes.mid")
    high_notes.write(output)

    
derecha_piano("backendPython/GeneracionDePartitura/test/sparkle_new.mid", "backendPython/GeneracionDePartitura/test/test_derecha_piano.mid", 60)