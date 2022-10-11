import music21
import pretty_midi

def cambiar_tono(midi_path, cambio, output):
    """Cambia el tono de la partitura midi en cambio semitonos y lo guarda en output

    Args:
        midi_path (string): Ruta del archivo midi
        cambio (int): Cantidad de semitonos a cambiar, puede ir desde -11 a 11
        output (string): Ruta donde se guardara el archivo midi con el cambio de tono
    """    

    mid = pretty_midi.PrettyMIDI(midi_path)
    for instrument in mid.instruments:
        for note in instrument.notes:
            note.pitch += cambio
    mid.write(output)
    
cambiar_tono("backendPython/GeneracionDePartitura/test/sparkle_new.mid", 9, "backendPython/GeneracionDePartitura/test/test_cambio_tono.mid")