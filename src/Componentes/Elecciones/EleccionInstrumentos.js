import React, {Component} from "react";
import './Elecciones.css';
import instrumentos from "./instrumentos";
import axios from "axios";
import BotonPartitura from "./BotonPartitura";



class EleccionInstrumentos extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionInicial"
        }
        this.changePage = this.changePage.bind(this);
        this.elegirEsteInstrumento = this.elegirEsteInstrumento.bind(this);
    }

    changePage(val,val2){
        this.props.sendData(val,val2);
    }

    elegirEsteInstrumento(instrumento, tipo, instrumento2){
        // Realizar un post a la api con el instrumento elegido y si es partitura o tablatura
        console.log(instrumento);
        console.log(instrumento2);
        console.log(tipo);
        this.changePage("PantallaDeCarga", false);
        axios.post('http://34.139.161.175:3001/eleccioninstrumentos', {
            instrumento: instrumento,
            instrumento2: instrumento2,
            partitura: tipo,
            melodia: 'no'
        })
            .then(response => {
                //response contiene un json con los instrumentos
                this.props.seleccionarInstrumento(instrumento, tipo);
                console.log(response.data + " Ruta archivo a descargar");
                this.changePage("ExportarPartitura", response.data);
            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    }

    render() {
        console.log(this.props, "props de eleccion instrumentos");
        if (this.props.boolean === false){
            return (
                <div className="container">
                    <div className="containerTituloEleccion">
                        <h2 className="tituloEleccion">Elige que deseas hacer</h2>
                    </div>
                    <div className="container row">
                        {
                            this.props.instrumentos.map((instrumento, index) => {
                                for (let i = 0; i < this.props.instrumentos.length; i++) {
                                    if (this.props.instrumentos[i] === instrumento.nombre) {
                                        return (
                                            <div className="containerBotonInstrumento">
                                                <div className="InstrumentoGrande">
                                                    <img className="imagenBotonEleccion" src={instrumento.imagen} alt={instrumento.nombre}/>
                                                    <h3 className="textoBotonEleccion">{instrumento.nombre}</h3>
                                                </div>
                                                <button className="btnInstrumentoPequeño" onClick={() => this.elegirEsteInstrumento(instrumento.nombre,"si")}>
                                                    <h3 className="textoBotonEleccion">Partitura</h3>
                                                </button>
                                                <button className="btnInstrumentoPequeño" onClick={() => this.elegirEsteInstrumento(instrumento.nombre,"no")} disabled={instrumento.tablatura === "no"}>
                                                    <h3 className="textoBotonEleccion">Tablatura</h3>
                                                </button>
                                            </div>
                                        )
                                        }
                                    }
                                }
                            )
                        }
                    </div>
                    <button className="btnEleccion" onClick={() => this.changePage()}>Regresar</button>
                </div>
            );
        }else{
            return (
                <div className="container-fluid d-flex flex-md-row flex-sm-column flex-column justify-content-around mt-5 mb-5 flex-nowrap gap-5">
                    <div className="container col-md-5 text-start">
                        <h1 className="tituloMenu">Bienvenido a Partitas</h1>
                        <div className="d-flex justify-content-start">
                            <p className="d-block text-start">
                                Partitas generará una partitura a partir de un archivo de audio. Puedes subir un archivo de audio tipo WAV, MP3, OGG o FLAC, a partir de el cual Partitas generará una partitura.
                            </p>
                        </div>
                        <h3 className="text-left col-12">1. ¿Cómo Partitas genera una partitura?</h3>
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
                    <div className="container col-md-5 order-sm-1">
                        <h2 className="tituloMenu">Elige que deseas hacer</h2>
                        <div className="container row">
                            {
                                instrumentos.map((instrumento, index) => {
                                    return (
                                        <div className="container col-4 form-group-inline">
                                            <div className="InstrumentoGrande">
                                                <img className="imagenBotonEleccion" src={instrumento.imagen} alt={instrumento.nombre}/>
                                                <h3 className="textoBotonEleccion">{instrumento.nombre}</h3>
                                            </div>
                                            <BotonPartitura instrumento={instrumento} elegirEsteInstrumento={this.elegirEsteInstrumento} habilitado={instrumento.tablatura} partitura={"si"} melodia="no"/>
                                            <BotonPartitura instrumento={instrumento} elegirEsteInstrumento={this.elegirEsteInstrumento} habilitado={instrumento.tablatura} partitura={"no"} melodia="no"/>
                                        </div>
                                        )
                                    }
                                )
                            }
                        </div>
                        <button className="btnInstrumentoPequeño" onClick={() => this.changePage()}>
                            <h3 className="textoBotonEleccion">Volver</h3>
                        </button>
                    </div>
                </div>
            );
        }
        
    }
}

export default EleccionInstrumentos;