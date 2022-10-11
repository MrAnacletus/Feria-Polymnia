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
        axios.post('http://127.0.0.1:3001/eleccioninstrumentos', {
            instrumento: instrumento.nombre,
            partitura: tipo,
            melodia: "si"
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

    render(){
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
                                            <BotonPartitura instrumento={instrumento} habilitado={instrumento.tablatura} elegirEsteInstrumento={this.elegirEsteInstrumento} partitura={this.props.partitura}/>
                                        </div>
                                    )
                                }
                                
                            })}
                        </div>
                    </div>
                    {/* boton volver */}
                    <button className="botonVolver" onClick={() => this.props.toRender("EleccionInicial")}>Volver</button>
                </div>
            )
    }
}

export default EleccionMelodia;