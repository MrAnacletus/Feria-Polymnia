import axios from "axios";
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

    exportarPartitura = () => { 
        axios({
            url: 'http://localhost:8000/single',
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'foto.jpg');
            document.body.appendChild(link);
            link.click();
          });
    };

    render() {
        return (
            <div className="containerExportar">
                <div className="containerTituloExportar">
                    <h2 className="tituloExportar">Exportar Partitura</h2>
                </div>
                <button className="btnExportar" onClick={() => this.exportarPartitura()}>Descargar PDF</button>
            </div>
        );
    }
}

export default ExportarPartitura;