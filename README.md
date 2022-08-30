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
- Para NVM estamos usando la versión 0.39.1 (creo que no importa)
- Para Node.js estamos utilizando la versión v16.15.1
- Para node package manager (npm) estamos usando la versión 8.11.0
- Desarrollado en WSL1
- Distribución de Ubuntu 20.04 LTS
### Librerias de python
- librosa 0.9.1
- music21 7.3.3
- numpy 1.20.1
- fastapi 0.78.0
- uvicorn [standard]0.17.6
- pypianoroll 0.5.3
- scipy 1.7.0
- pytorch 1.12.0
- pysoundfile 0.9.0
### Librerias NPM
- @testing-library/jest-dom": "^5.16.4",
- "@testing-library/react": "^13.3.0",
- "@testing-library/user-event": "^13.5.0",
- "axios": "^0.27.2",
- "body-parser": "^1.20.0",
- "bootstrap": "^5.1.3",
- "cors": "^2.8.5",
- "express": "^4.18.1",
- "express-fileupload": "^1.4.0",
- "js-file-download": "^0.4.12",
- "multer": "^1.4.5-lts.1",
- "react": "^18.2.0",
- "react-dom": "^18.1.0",
- "react-router-dom": "^6.3.0",
- "react-scripts": "^2.1.3",
- "web-vitals": "^2.1.4"

## Para la instalación de todo:
#### Actualizar Ubuntu
- ```sudo apt-get update```
- ```sudo apt-get upgrade```
#### Obtener repo de git
- ```git clone https://github.com/MrAnacletus/Feria-Polymnia.git```
#### Cambiar a una branch nueva
- ```git checkout -b <Nombre-branch>```

#### Instalar NVM
- ```curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash```
- ```export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"```
- ```[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm```
#### Instalar node
- ```nvm install 16.15.1```
#### Instalar pip3
- ```sudo apt install python3-pip```
#### Instalar museScore3 desde https://ourcodeworld.com/articles/read/1408/how-to-install-musescore-3-in-ubuntu-2004
- ```sudo add-apt-repository ppa:mscore-ubuntu/mscore3-stable```
- ```sudo apt-get install musescore3```
#### Instalar librosa 0.9.1
- ```pip3 install librosa==0.9.1```
#### Instalar music21 7.3.3
- ```pip3 install music21==7.3.3```
#### Instalar numpy 1.20.1
- ```pip3 install numpy==1.20.1```
#### Instalar fastapi 0.78.0
- ```pip3 install fastapi==0.78.0```
#### Instalar uvicorn 0.17.6
- ```pip3 install uvicorn[standard]==0.17.6```
#### Instalar pypianoroll 0.5.3
- ```pip3 install pypianoroll==0.5.3```
#### Instalar scipy 1.7.0
- ```pip3 install scipy==1.7.0```
#### Instalar pytorch 1.12.0
- ```pip3 install torch==1.12.0```
#### Instalar pysoundfile 0.9.0
- ```pip3 install pysoundfile==0.9.0```
#### Instalar dependencias de npm
- ```npm ci```

#### Si es que hay problemas con libQt5Core.so.5
- ```sudo strip --remove-section=.note.ABI-tag /usr/lib/x86_64-linux-gnu/libQt5Core.so.5```

## Para correr todo:
#### Terminal 1
- ```npm start```
#### Terminal 2
- ```node ./backend-js/server.js```
#### Terminal 3
- ```export QT_QPA_PLATFORM=offscreen```
- ```python3 -m uvicorn main:app --reload --app-dir ./backendPython/GeneracionDePartitura/ --reload-dir ./backendPython/GeneracionDePartitura/ --port 3001```