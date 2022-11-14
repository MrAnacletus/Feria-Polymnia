import os
import shutil

def copiar(source, destination):
    shutil.copy(source, destination)

def borrar(folder):
    for file_name in os.listdir(folder):
        source = folder + file_name
        print(source)
        if ".mid" in source:
            if os.path.isfile(source):
                os.remove(source)

#copiar("./voz.mid", "./testing/voz.mid")
#borrar("./testing/")