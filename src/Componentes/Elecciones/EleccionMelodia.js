import React, {Component} from "react";
import './Elecciones.css';
import axios from "axios";
import instrumentos from "./instrumentos";
import BotonPartitura from "./BotonPartitura";


class EleccionMelodia extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionMelodia"
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
        axios.post('http://34.139.161.175:3001/eleccioninstrumentos', {
            instrumento: instrumento,
            partitura: tipo,
            melodia: "si"
        })
            .then(response => {
                //response contiene un json con los instrumentos
                this.props.seleccionarInstrumento(instrumento);
                console.log(response.data + " Ruta archivo a descargar");
                this.changePage("ExportarPartitura", response.data);
                // seleccionar instrumento

            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    }

    render(){
        console.log(this.props, "props de eleccion melodia");
            return(
                <div className="containerEleccion">
                    <div className="containerTituloEleccion">
                        <h2 className="tituloEleccion">Elige un instrumento compatible</h2>
                    </div>
                    <div className="container">
                        <div className="row">
                            {instrumentos.map((instrumento, index) => {
                                if (instrumento.melodia === "si"){
                                    return (
                                        <div className="containerBotonInstrumento col-3">
                                            <div className="InstrumentoGrande">
                                                <img className="imagenBotonEleccion" src={instrumento.imagen} alt={instrumento.nombre}/>
                                                <h3 className="textoBotonEleccion">{instrumento.nombre}</h3>
                                            </div>
                                            <BotonPartitura instrumento={instrumento} habilitado={instrumento.tablatura} elegirEsteInstrumento={this.elegirEsteInstrumento} partitura={this.props.partitura} melodia="si"/>
                                        </div>
                                    )
                                }
                                
                            })}
                        </div>
                    </div>
                    {/* boton volver */}
                    <button className="btnInstrumentoPequeño" onClick={() => this.changePage()}>
                        <h3 className="textoBotonEleccion">Volver</h3>
                    </button>
                </div>
            )
    }
}

export default EleccionMelodia;