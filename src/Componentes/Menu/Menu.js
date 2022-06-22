import React, { Component } from "react";
import SubirArchivo from "./SubirArchivo/SubirArchivo";
import './Menu.css';

class Menu extends Component {

    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
    }

    changePage(value,value2){
        this.props.sendData(value,value2);
    }

    render() {
		return (
            <div className="containerTimeLine">
                <div className="containerMenu">
                    <h1 className="tituloMenu">¡Sube tu archivo!</h1>
                </div>
                <SubirArchivo sendData={this.changePage}/>
            </div>
        )   
    }
}

export default Menu;