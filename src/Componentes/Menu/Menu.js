import React, { Component } from "react";
import './Menu.css';

class Menu extends Component {

    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
    }

    changePage(value){
        this.props.sendData(value);
    }

    render() {
		return (
            <div className="containerTimeLine">
                <div className="containerMenu">
                    <h1 className="tituloMenu">¡Sube tu archivo!</h1>
                </div>
                <button className="SubirBoton" onClick={() => this.changePage("PantallaDeCarga")}>Subir archivo</button>
            </div>
        )   
    }
}

export default Menu;