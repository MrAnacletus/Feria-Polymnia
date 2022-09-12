import React, { Component } from 'react';
import './Elecciones.css';

class EleccionMelodia extends Component {
    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
    }
    changePage(value,value2){
        this.props.sendData(value,value2);
    }

    render(){
        return(
            <div className="containerEleccion">
                <div className="containerTituloEleccion">
                    <h2 className="tituloEleccion">Elije una melodía</h2>
                </div>
                <div className="containerBotones">
                    <button className="btnEleccion" onClick={() => this.changePage("EleccionInicial",false)}>Volver</button>
                </div>
            </div>
        );
    }
}

export default EleccionMelodia;