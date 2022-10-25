import React, { Component } from "react";
import SubirArchivo from "./SubirArchivo/SubirArchivo";
import './Menu.css';

class Menu extends Component {

    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
    }

    changePage(value,value2){
        this.props.sendData(value,value2);
    }

    render() {
		return (
            <div className="container-fluid d-md-flex flex-md-row justify-content-around mt-5 mb-5 ">
                <div className="col-md-5 d-flex flex-column justify-content-start gap-3 text-start">
                    <h1 className="tituloMenu">Bienvenido a Partitas</h1>
                    <div className="d-flex justify-content-start">
                        <p className="d-block text-start">
                            Partitas generará una partitura a partir de un archivo de audio. Puedes subir un archivo de audio tipo WAV, MP3, OGG o FLAC, a partir de el cual Partitas generará una partitura.
                        </p>
                    </div>
                    <h3 className="text-left col-12 ">1. ¿Cómo Partitas genera una partitura?</h3>
                    <ul>
                        <li><p className="d-block text-start">Mediante inteligencia artificial Partitas reconoce nota a nota los diferentes instrumentos presentes en la pieza musical, si estos instrumentos son soportados por Partitas
                            podrás generar una partitura o tablatura para ellos.</p></li>
                    </ul>
                    <h3 className="text-left col-12">2. ¿Puede ser de cualquier instrumento que yo quiera?</h3>
                    <ul>
                        <li><p className="d-block text-start">No exactamente de cualquiera, pero tenemos una larga lista de instrumentos soportados que seguirá creciendo mientras adaptemos nuestro sistema a ellos.</p></li>
                    </ul>
                    <h3 className="text-left col-12">3. Luego de generar mi partitura, ¿Qué pasa si es muy dificil?</h3>
                    <ul>
                        <li><p className="d-block text-start">Al momento de generar tu partitura tienes la opción de simplificarla con los métodos otorgados, puedes simplificar los acordes, reducir las notas, tocar una sola mano si toca piano,
                            e incluso ¡puedes eliminar cejillos si utilizas un instrumento de cuerdas!</p></li>
                    </ul>
                </div>
                <div className="col-md-5">
                    <SubirArchivo sendData={this.changePage}/>
                </div>
            </div>
        )   
    }
}

export default Menu;