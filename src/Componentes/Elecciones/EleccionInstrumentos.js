import React, {Component} from "react";
import './Elecciones.css';
import PantallaDeCarga from "../PantallaDeCarga/PantallaDeCarga";
import instrumentos from "./instrumentos";


class EleccionInstrumentos extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionInicial"
        }
        this.changePage = this.changePage.bind(this);
    }

    changePage(val){
        this.props.sendData(val);
    }

    render() {
        return (
            <div className="containerEleccion">
                <div className="containerTituloEleccion">
                    <h2 className="tituloEleccion">Elije que deseas hacer</h2>
                </div>
                <div className="containerBotones">
                    {
                        instrumentos.map((instrumento, index) => {
                            return (
                                <div className="containerBotonInstrumento">
                                    <button className="btnEleccionInstrumentos" onClick={() => this.changePage(instrumento.nombre)}>
                                        <img className="imagenBotonEleccion" src={instrumento.imagen} alt={instrumento.nombre}/>
                                        <p className="textoBotonEleccion">{instrumento.nombre}</p>
                                    </button>
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

export default EleccionInstrumentos;