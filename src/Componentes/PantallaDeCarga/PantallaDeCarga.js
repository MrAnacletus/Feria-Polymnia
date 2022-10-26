import React, { Component } from "react";
import './PantallaDeCarga.css';
import carga from "./carga.gif"

class PantallaDeCarga extends Component {
    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
        this.handleTime = this.handleTime.bind(this);
    }

    componentDidMount(){
        if (this.props.boolean){
            this.handleTime(this.props.pagina);
        }
    }

    changePage(val){
        this.props.sendData(val);
    }

    handleTime(val){
        setTimeout(() => {this.changePage(val)}, 3000);
    }

    render(){
        return (
            <div className="PantallaDeCarga container-fluid d-flex flex-column align-items-center justify-content-center">
                <div className="container d-flex">
                    <div className="containerTituloCarga">
                        <h2 className="tituloCarga">Procesando, por favor espere</h2>
                        <img className="cat" src={carga}></img>
                    </div>
                </div>
            </div>
            
        )
    }
}




export default PantallaDeCarga;