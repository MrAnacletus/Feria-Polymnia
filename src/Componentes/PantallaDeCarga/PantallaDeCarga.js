import React, { Component } from "react";
import './PantallaDeCarga.css';

class PantalladeCarga extends Component {
    render(){
        return (
            <div className="PantallaDeCarga">
                <div className="containerTitulo">
                    <h2 className="tituloCarga">Cargando, porfavor espere</h2>
                </div>
                {/* <div className="containerCarga">
                    Insertar Gif
                </div> */}
            </div>
        )
    }
}




export default PantalladeCarga;