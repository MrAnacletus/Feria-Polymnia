import procesamiento
import try1
import melodia

#filepath = "pistas/hb.wav"
#try1.generar_partitura(

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from pydantic import BaseModel
import try1
import Transc.transcripcion as tc
import os

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
  if item.eleccion == "melodia":
    name_voice = melodia.generarMelodia(lineas[0].strip())
    path = "./backendPython/GeneracionDePartitura/Generados"
    d_pdf = try1.generar_partitura(path+'/'+name_voice+'.mid', lineas[1].strip(), lineas[2].strip())
    print(d_pdf)
    print(type(d_pdf))
    open("./backendPython/GeneracionDePartitura/flujo.txt", "w").close()
    return {d_pdf}
  else:
    name = procesamiento.generar_midi(lineas[0].strip())
    f = open("./backendPython/GeneracionDePartitura/flujo.txt", "a")
    f.write(name)
    f.close()
    return ["Piano", "Guitarra eléctrica", "Bajo"]

@app.post("/eleccioninstrumentos")

async def create_item(item: ItemEleccionInstrumentos):
  f = open("./backendPython/GeneracionDePartitura/flujo.txt", "r")
  lineas = f.readlines()
  f.close()
  path = "./backendPython/GeneracionDePartitura/Generados"
  if item.instrumento == "Guitarra eléctrica":
    d_pdf = try1.generar_partitura(path+'/'+lineas[3].strip()+'.mid', lineas[1].strip(), lineas[2].strip())
    #open("./backendPython/GeneracionDePartitura/flujo.txt", "w").close()
    return {d_pdf}

"""async def read_item(path_to_midi: str, q: Union[str, None] = None):
  print(path_to_midi)
  d_pdf, d_xml = try1.generar_partitura(path_to_midi)
  return {d_pdf, d_xml}"""