import React, { Component } from "react";
import SubirArchivo from "./SubirArchivo/SubirArchivo";
import './Menu.css';

class Menu extends Component {

    constructor(){
        super();
        this.state ={
            showSideBar: false,
        }
        this.changePage = this.changePage.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
    }

    toggleSideBar(){
        this.setState({
            showSideBar: !this.state.showSideBar
        })
    }

    changePage(value,value2){
        this.props.sendData(value,value2);
    }

    render() {
		return (
            <div className="container-fluid d-flex flex-md-row flex-sm-column flex-column justify-content-around mt-5 mb-5 flex-nowrap gap-5 text-white">
                {this.state.showSideBar &&
                    <div className="container col-md-5 d-flex flex-column justify-content-start gap-3 text-start order-sm-2 order-md-2 order-lg-1">
                        <h1 className="tituloMenu">Bienvenido a Partitas</h1>
                        <div className="d-flex justify-content-start">
                            <p className="d-block text-start">
                                Partitas generará una partitura o tablatura desde un archivo de audio. Puedes subir un archivo de tipo WAV, MP3, OGG o FLAC, a partir de la voz o un instrumento presentes.
                            </p>
                        </div>
                        <h3 className="text-left col-12">1. ¿Cómo funciona Partitas?</h3>
                        <ul>
                            <li><p className="d-block text-start">Mediante inteligencia artificial Partitas reconoce nota a nota la voz y los diferentes instrumentos presentes en la pieza musical, si estos instrumentos son soportados por Partitas
                                podrás generar una partitura o tablatura para ellos.</p></li>
                        </ul>
                        <h3 className="text-left col-12">2. ¿Puede ser de cualquier instrumento que yo quiera?</h3>
                        <ul>
                            <li><p className="d-block text-start">No exactamente de cualquiera, pero tenemos una larga lista de instrumentos soportados que seguirá creciendo mientras adaptemos nuestro sistema a ellos.</p></li>
                        </ul>
                        <h3 className="text-left col-12">3. Luego de generar mi partitura o tablatura, ¿Qué puedo hacer si es muy dificil?</h3>
                        <ul>
                            <li><p className="d-block text-start">Al momento de generar tu partitura o tablatura tienes la opción de simplificarla con los métodos otorgados. Si generaste una partitura puedes reducir las notas y tocar una sola mano si es un piano. Si generaste una tablatura puedes eliminar cejillos si utilizas un instrumento de cuerdas </p></li>
                        </ul>
                        <div className="container-fluid text-center">
                            <button class="btn btn-light bg-dark btn-estilo" onClick={() => this.toggleSideBar()}  role="button">Cerrar ayuda</button>
                        </div>
                    </div>
                }
                {!this.state.showSideBar &&
                    <div className="verticaltext">
                        <button class="verticaltext_content btn btn-light btn-estilo dropdown-toggle"  onClick={() => this.toggleSideBar()} role="button">Ayuda</button>
                    </div>
                }
                <div className="container col-md-5 order-sm-1">
                    <SubirArchivo sendData={this.changePage}/>
                </div>
            </div>
        )   
    }
}

export default Menu;