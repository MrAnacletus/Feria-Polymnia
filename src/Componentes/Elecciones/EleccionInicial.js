import React, {Component} from "react";
import './EleccionInicial.css';
import PantalladeCarga from "../PantallaDeCarga/PantallaDeCarga";


class EleccionInicial extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionInicial"
        }
        this.changePage = this.changePage.bind(this);
    }

    changePage(val,val2){
        this.props.sendData(val,val2);
    }

    elegirInstrumentos(){
        this.changePage("PantallaDeCarga", true);
    }

    render() {
        return (
            <div className="containerEleccion">
                <div className="containerTituloEleccion">
                    <h2 className="tituloEleccion">Elije que deseas hacer</h2>
                </div>
                <div className="containerBotones">
                    <button className="btnEleccion" onClick={() => this.elegirInstrumentos()} >Generar partitura de un instrumento</button>
                    <button className="btnEleccion" >Generar partitura de melodía</button>
                </div>
            </div>
        );
    }
}

export default EleccionInicial;