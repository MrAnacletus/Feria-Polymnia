import React, {Component} from "react";
import './ExportarPartitura.css';

class ExportarPartitura extends Component {
    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
    }

    changePage(val){
        this.props.sendData(val);
    }

    render() {
        return (
            <div className="containerExportar">
                <div className="containerTitulo">
                    <h2 className="tituloExportar">Exportar Partitura</h2>
                </div>
                <button className="btnExportar" onClick={() => this.props.sendData("Menu")}>Descargar PDF</button>
            </div>
        );
    }
}

export default ExportarPartitura;