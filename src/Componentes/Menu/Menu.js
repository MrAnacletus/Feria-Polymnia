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
            <div className="container-fluid d-flex flex-row justify-content-around">
                <div className="col-7 d-flex flex-column justify-content-start">
                    <h1 className="tituloMenu">¡Sube tu archivo!</h1>
                    <div className="d-flex justify-content-start">
                        <p className="text-left">
                            Partitas generará una partitura a partir de un archivo de audio. Puedes subir un archivo de audio tipo WAV, MP3, OGG o FLAC, a partir de el cual Partitas generará una partitura.
                        </p>
                    </div>
                    <div className="container-fluid d-flex justify-content-start ">
                        <h3>¿Cómo se generará mi partitura?</h3>
                        <ul>
                            <li>
                                <p>Mediante inteligencia artificial y aprendizaje automático, Partitas analizará tu archivo de audio y generará una partitura a partir de él.</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-3">
                    <SubirArchivo sendData={this.changePage}/>
                </div>
            </div>
        )   
    }
}

export default Menu;