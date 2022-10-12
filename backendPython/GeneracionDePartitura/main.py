import procesamiento
import try1
import melodia
import tono
import separacion_manos
import acordes

#filepath = "pistas/hb.wav"
#try1.generar_partitura(

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from pydantic import BaseModel
import try1
import Transc.transcripcion as tc
import os
import instrumentos
import tabs

class ItemSubirArchivo(BaseModel):
    path: str
    nombre: str
    autor: str

origins = ["*"]
class ItemEleccionInicial(BaseModel):
    eleccion: str

class ItemEleccionInstrumentos(BaseModel):
    instrumento: str
    partitura: str
    melodia: str

class ItemSimplificar(BaseModel):
    tono: int
    acordes: str
    derecha: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/partitas")
async def create_item(item: ItemSubirArchivo):
  # path = "./backendPython/GeneracionDePartitura/Generados"  
  # tipo = item.type
  # if tipo == "voz":
  #   name_voice = melodia.generarMelodia(item.path)  
  #   d_pdf = try1.generar_partitura(path+"/"+name_voice+".mid", item.nombre, item.autor)
  # else:
  #   name = procesamiento.generar_midi(item.path)
  #   d_pdf = try1.generar_partitura(path+"/"+name+".mid", item.nombre, item.autor)
  # """ 
  # sep=os.path.split(item.path)
  # pathname=tc.transcripcion(sep[1], sep[0], path)
  # #d_pdf = try1.generar_partitura(pathname+"/vocals_basic_pitch.mid", item.nombre, item.autor)
  # d_pdf = try1.generar_partitura(pathname+"/no_vocals.mid", item.nombre, item.autor)
  # return {d_pdf}
  # return {d_pdf}"""

  open("./backendPython/GeneracionDePartitura/flujo.txt", "w").close()
  f = open("./backendPython/GeneracionDePartitura/flujo.txt", "a")
  f.write(item.path + "\n")
  f.write(item.nombre + "\n")
  f.write(item.autor + "\n")
  f.close()
  print(item)

@app.post("/eleccioninicial")

async def create_item(item: ItemEleccionInicial):
  f = open("./backendPython/GeneracionDePartitura/flujo.txt", "r")
  lineas = f.readlines()
  f.close()
  sep=os.path.split(lineas[0].strip())
  path = "./backendPython/GeneracionDePartitura/Generados"
  if item.eleccion == "instrumentos":
    """pathname = tc.transc_melodia(sep[1], sep[0], path)
    d_pdf = try1.generar_partitura(pathname+'/vocals_basic_pitch.mid', lineas[1].strip(), lineas[2].strip(),"Melodia")
    print(d_pdf)
    print(type(d_pdf))
    open("./backendPython/GeneracionDePartitura/flujo.txt", "w").close()
    return {d_pdf}"""
    pathname = tc.transc_intrumento(sep[1], sep[0], path)
    f = open("./backendPython/GeneracionDePartitura/flujo.txt", "a")
    f.write(pathname+"\n")
    f.close()
    intrus = instrumentos.reconocer_instrumentos(pathname+"/no_vocals")
    return intrus
  else:
    pathname = tc.transc_melodia(sep[1], sep[0], path)
    f = open("./backendPython/GeneracionDePartitura/flujo.txt", "a")
    f.write(pathname+"\n")
    f.close()
    return {pathname}

@app.post("/eleccioninstrumentos")

async def create_item(item: ItemEleccionInstrumentos):
  f = open("./backendPython/GeneracionDePartitura/flujo.txt", "r")
  lineas = f.readlines()
  f.close()
  path = "./backendPython/GeneracionDePartitura/Generados"
  pathname = lineas[3].strip()
  d_pdf=""
  if item.melodia == "no":
    instrumentos.limpiar_midi(pathname+"/no_vocals", item.instrumento)
    f = open("./backendPython/GeneracionDePartitura/flujo.txt", "a")
    f.write(pathname+"/no_vocals_new.mid\n")
    f.write(item.instrumento+"\n")
    f.close()
    if item.partitura == "no":
      tabs.get_tab(pathname+"/no_vocals_new.mid", file_path='./backend-js/temp/' + lineas[1].strip() + '.pdf',generate_file=True,author=lineas[2].strip(),title=lineas[1].strip(),instrument=item.instrumento, max_lenght=70)
      d_pdf = lineas[1].strip() + '.pdf'
    else:
      d_pdf = try1.generar_partitura(pathname+'/no_vocals_new.mid', lineas[1].strip(), lineas[2].strip(),item.instrumento)
  else:
    f = open("./backendPython/GeneracionDePartitura/flujo.txt", "a")
    f.write(pathname+"/vocals_basic_pitch.mid\n")
    f.write(item.instrumento+"\n")
    f.close()
    if item.partitura == "no":
      tabs.get_tab(pathname+"/vocals_basic_pitch.mid", file_path='./backend-js/temp/' + lineas[1].strip() + '.pdf',generate_file=True,author=lineas[2].strip(),title=lineas[1].strip(),instrument=item.instrumento, max_lenght=70)
      d_pdf = lineas[1].strip() + '.pdf'
    else:
      d_pdf = try1.generar_partitura(pathname+'/vocals_basic_pitch.mid', lineas[1].strip(), lineas[2].strip(),item.instrumento)
  #open("./backendPython/GeneracionDePartitura/flujo.txt", "w").close()
  return {d_pdf}

@app.post("/simplificar")

async def create_item(item: ItemSimplificar):
  d_pdf = ""
  f = open("./backendPython/GeneracionDePartitura/flujo.txt", "r")
  lineas = f.readlines()
  f.close()
  path = "./backendPython/GeneracionDePartitura/Generados"
  pathname = lineas[3].strip()
  pathtemp = lineas[4].strip()
  if item.tono != 0:
    tono.cambiar_tono(pathtemp, item.tono, pathname+"/"+lineas[1].strip()+"_"+lineas[5].strip()+"_tono.mid")
    pathtemp = pathname+"/"+lineas[1].strip()+"_"+lineas[5].strip()+"_tono.mid"
    #f = open("./backendPython/GeneracionDePartitura/flujo.txt", "w")
    #f.writelines(lineas)
    #f.close()
  if item.acordes == "si":
    val_acorde = 0 
    if lineas[5].strip() == "Piano":
      val_acorde = 60
    acordes.simplificar_acordes(pathtemp, pathname+"/"+lineas[1].strip()+"_"+lineas[5].strip()+"_acordes.mid", val_acorde)
    pathtemp = pathname+"/"+lineas[1].strip()+"_"+lineas[5].strip()+"_acordes.mid"
    #f = open("./backendPython/GeneracionDePartitura/flujo.txt", "w")
    #f.writelines(lineas)
    #f.close()
  if item.derecha == "si":
    separacion_manos.derecha_piano(pathtemp, pathname+"/"+lineas[1].strip()+"_"+lineas[5].strip()+"_derecha.mid", 60)
    pathtemp = pathname+"/"+lineas[1].strip()+"_"+lineas[5].strip()+"_derecha.mid"
    #f = open("./backendPython/GeneracionDePartitura/flujo.txt", "w")
    #f.writelines(lineas)
    #f.close()
  d_pdf = try1.generar_partitura(pathtemp, lineas[1].strip(), lineas[2].strip(), lineas[5].strip())
  print(d_pdf)
  return {d_pdf}


"""async def read_item(path_to_midi: str, q: Union[str, None] = None):
  print(path_to_midi)
  d_pdf, d_xml = try1.generar_partitura(path_to_midi)
  return {d_pdf, d_xml}"""