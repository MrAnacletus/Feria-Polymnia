import React, { Component } from "react";
import './Menu.css';

class Menu extends Component {
    render() {
		return (
            <div className="containerTimeLine">
                <div className="infoMenu">
                    <h1 className="tituloMenu">¡Sube tu archivo!</h1>
                    <button className="SubirBoton">Subir archivo</button>
                </div>
            </div>
        )   
    }
}

export default Menu;