import music21
import shutil

def generar_partitura(path, name, autor):

    #print(path)
    music21.environment.set('musescoreDirectPNGPath', '/usr/bin/mscore3')

    parsed = music21.converter.parse(path)
    parsed.insert(0, music21.metadata.Metadata())
    parsed.metadata.title = name
    parsed.metadata.composer = autor
    fp = parsed.write('musicxml.pdf')
    xml = str(fp).split('.')[0]+'.musicxml'
    #name = path.split('/')[-1].split('.')[0]
    d_pdf = './backend-js/temp/' + name + '.pdf'
    d_xml = './backend-js/temp/' + name + '.musicxml'
    shutil.copyfile(fp, d_pdf)
    shutil.copyfile(xml, d_xml)
    return name + ".pdf"