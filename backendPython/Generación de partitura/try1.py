import music21
import shutil

def generar_partitura(path):

    #print(path)
    music21.environment.set('musescoreDirectPNGPath', 'C:/Program Files/MuseScore 3/bin/MuseScore3.exe')

    parsed = music21.converter.parse(path)
    fp = parsed.write('musicxml.pdf')
    xml = str(fp).split('.')[0]+'.musicxml'
    name = path.split('/')[-1].split('.')[0]
    d_pdf = 'C:/Users/salva/Desktop/Feria-Polymnia/backend-js/temp/' + name + '.pdf'
    d_xml = 'C:/Users/salva/Desktop/Feria-Polymnia/backend-js/temp/' + name + '.musicxml'
    shutil.copyfile(fp, d_pdf)
    shutil.copyfile(xml, d_xml)
    return name + ".pdf"