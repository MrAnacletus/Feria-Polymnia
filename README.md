# Instrucciones para nosotros Polymnia

## Distribución de archivos v1.0.0
Para una correcta organización de los archivos propongo la siguiente organización, esta se basará en lo conversado por nosotros en la reuniones y será actualizada conforme sea necesario

### Distribución
- my-app(debería cambiarle el nombre a esto, pero no se si al hacerlo rompo algo)
    - backendPython -> posición auxiliar del próximo backend en **Python**, nuestra amiga la pitón, aquí todo lo que tenga que ver con **IA**
    - backendJS -> posición **auxiliar** del backend que conecta directamente frontend **React.js** con **BackendPython**
    - public -> parte html del frontend
    - root(temporal) -> podría servir como carpeta raiz de todo lo que debamos guardar en el server/github, llamese canciones etc.
    - src -> carpeta raiz de todo lo que tiene que ver con frontend/backend con **JavaScript**
        - Componentes -> todos los **componentes de React**, po ahora uso una jerarquía de uso, ***si x usa a y, x contiene a la carpeta de y***.
        Todos los componentes inician su nombre con ***MAYUSCULAS***, ¿Por qué?, porque yo quise :D (y ya inicié así porfavor mantengamoslo así)
        - logos -> Imagenes y logos que deban ser usados por uno o mas componentes de React
## Versión de las cosas que estamos usando

- Para Node.js estamos utilizando la versión v16.15.1
- Para node package manager (npm) estamos usando la versión 8.11.0
- Desarrollado en WSL1
- Distribución de Ubuntu 20.04 LTS
- Para correr el sercer de python se utiliza Uvicorn con:
    - sudo apt install uvicorn
- Utilizando las librerías de npm:
    - React
    - Express
- Utilizando las librerías de pip
    - librosa
    - music21
    - numpy 1.20.1
    - fastapi
- Utilizando museScore3 desde:
    - https://ourcodeworld.com/articles/read/1408/how-to-install-musescore-3-in-ubuntu-2004



## Comandos para correr todo desde root de carpetas (es decir /my-app/)
- export QT_QPA_PLATFORM=offscreen -> quita la necesidad de pantalla de museScore3
- npm start -> inicia server de React
- node ./backend-js/server.js -> Iniciar server de backend Js
- uvicorn main:app --reload --app-dir ./backendPython/GeneracionDePartitura/ --reload-dir ./backendPython/GeneracionDePartitura/ -> Inicia server de backend de Python