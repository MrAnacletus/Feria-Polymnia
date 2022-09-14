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

class Item(BaseModel):
    path: str
    type: str
    nombre: str
    autor: str

origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/partitas")

async def create_item(item: Item):
  path = "./backendPython/GeneracionDePartitura/Generados"  
  """
  tipo = item.type
  if tipo == "voz":
    name_voice = melodia.generarMelodia(item.path)  
    d_pdf = try1.generar_partitura(path+"/"+name_voice+".mid", item.nombre, item.autor)
  else:
    name = procesamiento.generar_midi(item.path)
    d_pdf = try1.generar_partitura(path+"/"+name+".mid", item.nombre, item.autor)
  """ 
  sep=os.path.split(item.path)
  pathname=tc.transcripcion(sep[1], sep[0], path)
  #d_pdf = try1.generar_partitura(pathname+"/vocals_basic_pitch.mid", item.nombre, item.autor)
  d_pdf = try1.generar_partitura(pathname+"/no_vocals.mid", item.nombre, item.autor)
  return {d_pdf}

"""async def read_item(path_to_midi: str, q: Union[str, None] = None):
  print(path_to_midi)
  d_pdf, d_xml = try1.generar_partitura(path_to_midi)
  return {d_pdf, d_xml}"""