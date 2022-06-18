# Instrucciones para nosotros Polymnia

## Distribución de archivos v1.0.0
Para una correcta organización de los archivos propongo la siguiente organización, esta se basará en lo conversado por nosotros en la reuniones y será actualizada conforme sea necesario

### Distribución
- my-app(debería cambiarle el nombre a esto, pero no se si al hacerlo rompo algo)
    - backendPython -> posición auxiliar del próximo backend en **Python**, nuestra amiga la pitón, aquí todo lo que tenga que ver con **IA**
    - public -> parte html del frontend
    - root(temporal) -> podría servir como carpeta raiz de todo lo que debamos guardar en el server/github, llamese canciones etc.
    - src -> carpeta raiz de todo lo que tiene que ver con frontend/backend con **JavaScript**
        - Componentes -> todos los **componentes de React**, po ahora uso una jerarquía de uso, ***si x usa a y, x contiene a la carpeta de y***.
        Todos los componentes inician su nombre con ***MAYUSCULAS***, ¿Por qué?, porque yo quise :D (y ya inicié así porfavor mantengamoslo así)
        - logos -> Imagenes y logos que deban ser usados por uno o mas componentes de React
        - backendJS -> posición **auxiliar** del backend que conecta directamente frontend **React.js** con **BackendPython**
## Versión de las cosas que estamos usando

- Para Node.js estamos utilizando la versión v16.15.1
- Para node package manager (npm) estamos usando la versión 8.11.0
- Desarrollado en WSL1
- Distribución de Ubuntu 20.04 LTS