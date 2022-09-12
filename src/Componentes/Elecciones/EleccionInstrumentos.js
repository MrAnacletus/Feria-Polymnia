import React, {Component} from "react";
import './EleccionInstrumentos.css';
import PantallaDeCarga from "../PantallaDeCarga/PantallaDeCarga";


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
                    {/* instrumentos */}
                    <button className="btnEleccion" onClick={() => this.changePage("Piano")}>Piano</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Guitarra")}>Guitarra</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Bajo")}>Bajo</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Bateria")}>Bateria</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Violin")}>Violin</button>
                    <button className="btnEleccion" onClick={() => this.changePage("EleccionInicial",false)}>Volver</button>
                </div>
            </div>
        );
    }
}

export default EleccionInstrumentos;