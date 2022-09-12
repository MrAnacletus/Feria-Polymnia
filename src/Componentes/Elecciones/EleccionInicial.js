import React, {Component} from "react";
import './Elecciones.css';
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
        this.changePage("PantallaDeCarga", false);
        // Acá se debe hacer un fetch para obtener los instrumentos
        // y luego cambiar el estado de toRender a "EleccionInstrumentos"
        setTimeout(() => {
            this.changePage("EleccionInstrumentos", false);
        }, 4000);
    }

    elegirMelodia(){
        this.changePage("PantallaDeCarga", false);
        // Acá se debe hacer un fetch para obtener la melodía
        // y luego cambiar el estado de toRender a "EleccionMelodia"
        setTimeout(() => {
            this.changePage("EleccionMelodia", false);
        }, 4000);
    }


    render() {
        return (
            <div className="containerEleccion">
                <div className="containerTituloEleccion">
                    <h2 className="tituloEleccion">Elije que deseas hacer</h2>
                </div>
                <div className="containerBotones">
                    <button className="btnEleccion" onClick={() => this.elegirInstrumentos()} >Generar partitura de un instrumento</button>
                    <button className="btnEleccion" onClick={() => this.elegirMelodia()} >Generar partitura de melodía</button>
                </div>
            </div>
        );
    }
}

export default EleccionInicial;