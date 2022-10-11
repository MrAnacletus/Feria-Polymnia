import React, {Component} from "react";
import './Elecciones.css';
import PantallaDeCarga from "../PantallaDeCarga/PantallaDeCarga";
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

    elegirEsteInstrumento(instrumento, tipo){
        // Realizar un post a la api con el instrumento elegido y si es partitura o tablatura
        this.changePage("PantallaDeCarga", false);
        axios.post('http://127.0.0.1:3001/eleccioninstrumentos', {
            instrumento: instrumento.nombre,
            partitura: tipo
        })
            .then(response => {
                //response contiene un json con los instrumentos
                this.changePage("ExportarPartitura", response.data);
                console.log(response.data + " Ruta archivo a descargar");
            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    }

    render() {
        if (this.props.boolean === false){
            return (
                <div className="containerEleccion">
                    <div className="containerTituloEleccion">
                        <h2 className="tituloEleccion">Elige que deseas hacer</h2>
                    </div>
                    <div className="containerBotones">
                        {
                            instrumentos.map((instrumento, index) => {
                                for (let i = 0; i < this.props.instrumentos.length; i++) {
                                    if (this.props.instrumentos[i] === instrumento.nombre) {
                                        return (
                                            <div className="containerBotonInstrumento">
                                                <div className="InstrumentoGrande">
                                                    <img className="imagenBotonEleccion" src={instrumento.imagen} alt={instrumento.nombre}/>
                                                    <h3 className="textoBotonEleccion">{instrumento.nombre}</h3>
                                                </div>
                                                <button className="btnInstrumentoPequeño" onClick={() => this.elegirEsteInstrumento(instrumento,"si")}>
                                                    <h3 className="textoBotonEleccion">Partitura</h3>
                                                </button>
                                                <button className="btnInstrumentoPequeño" onClick={() => this.elegirEsteInstrumento(instrumento,"no")} disabled={instrumento.tablatura === "no"}>
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
                <div className="containerEleccion">
                    <div className="containerTituloEleccion">
                        <h2 className="tituloEleccion">Elige que deseas hacer</h2>
                    </div>
                    <div className="containerBotones">
                        {
                            this.props.instrumentos.map((instrumento, index) => {
                                return (
                                    <div className="containerBotonesInstrumento">
                                        <div className="InstrumentoGrande">
                                            <img className="imagenBotonEleccion" src={instrumento.imagen} alt={instrumento.nombre}/>
                                            <h3 className="textoBotonEleccion">{instrumento.nombre}</h3>
                                        </div>
                                        <button className="btnInstrumentoPequeño" onClick={() => this.elegirEsteInstrumento(instrumento,"no")}>
                                            <h3 className="textoBotonEleccion">Partitura</h3>
                                        </button>
                                        <BotonPartitura instrumento={instrumento} elegirEsteInstrumento={this.elegirEsteInstrumento} habilitado={instrumento.tablatura}/>
                                    </div>
                                    )
                                }
                            )
                        }
                    </div>
                    <button className="btnEleccion" onClick={() => this.changePage()}>Regresar</button>
                </div>
            );
        }
        
    }
}

export default EleccionInstrumentos;