import React, { Component } from "react";
import './PantallaDeCarga.css';
import carga from "./carga.gif"

class PantalladeCarga extends Component {
    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
        this.handleTime = this.handleTime.bind(this);
    }

    componentDidMount(){
        //this.handleTime("ExportarPartitura")
    }

    changePage(val){
        this.props.sendData(val);
    }

    handleTime(val){
        setTimeout(() => {this.changePage(val)}, 3000);
    }

    render(){
        return (
            <div className="PantallaDeCarga">
                <div className="containerTituloCarga">
                    <h2 className="tituloCarga">Cargando, porfavor espere</h2>
                    <img className="cat" src={carga}></img>
                </div>
            </div>
        )
    }
}




export default PantalladeCarga;