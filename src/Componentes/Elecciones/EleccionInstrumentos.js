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
                <div className="container">
                    <div className="containerTituloEleccion">
                        <h2 className="tituloEleccion">Elige que deseas hacer</h2>
                    </div>
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
            );
        }
        
    }
}

export default EleccionInstrumentos;