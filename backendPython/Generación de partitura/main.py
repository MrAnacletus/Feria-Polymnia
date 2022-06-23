import procesamiento
import try1

#filepath = "pistas/hb.wav"
#try1.generar_partitura(

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from pydantic import BaseModel
import try1

class Item(BaseModel):
    path: str

origins = ["http://localhost:3000", "localhost:3000"]

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
  path = "C:/Users/salva/Desktop/Feria-Polymnia/backendPython/Generación de partitura"  
  name = procesamiento.generar_midi(item.path)  
  d_pdf = try1.generar_partitura(path+"/"+name+".mid")
  return {d_pdf}

"""async def read_item(path_to_midi: str, q: Union[str, None] = None):
  print(path_to_midi)
  d_pdf, d_xml = try1.generar_partitura(path_to_midi)
  return {d_pdf, d_xml}"""