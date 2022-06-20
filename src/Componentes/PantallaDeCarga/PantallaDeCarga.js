import React, { Component } from "react";
import './PantallaDeCarga.css';

class PantalladeCarga extends Component {
    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
        this.handleTime = this.handleTime.bind(this);
    }

    componentDidMount(){
        this.handleTime("ExportarPartitura");
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
                <div className="containerTitulo">
                    <h2 className="tituloCarga">Cargando, porfavor espere</h2>
                </div>
            </div>
        )
    }
}




export default PantalladeCarga;