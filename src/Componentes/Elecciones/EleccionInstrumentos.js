import React, {Component} from "react";
import './Elecciones.css';
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
                    <button className="btnEleccion" onClick={() => this.changePage("Flauta")}>Flauta</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Saxofon")}>Saxofon</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Trompeta")}>Trompeta</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Trombon")}>Trombon</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Oboe")}>Oboe</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Clarinete")}>Clarinete</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Tuba")}>Tuba</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Timbal")}>Timbal</button>
                    <button className="btnEleccion" onClick={() => this.changePage("Marimba")}>Marimba</button>
                    <button className="btnEleccion" onClick={() => this.changePage("EleccionInicial",false)}>Volver</button>
                </div>
            </div>
        );
    }
}

export default EleccionInstrumentos;