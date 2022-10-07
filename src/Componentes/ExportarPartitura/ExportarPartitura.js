import axios from "axios";
import React, {Component} from "react";
import './ExportarPartitura.css';

axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
class ExportarPartitura extends Component {
    constructor(){
        super();
        this.changePage = this.changePage.bind(this);
        this.exportarPartitura = this.exportarPartitura.bind(this);
        this.simplificar = this.simplificar.bind(this);
    }

    changePage(val){
        this.props.sendData(val);
    }

    exportarPartitura = () => { 
        console.log(this.props.nombreArchivo + " nombre archivo a exportar");
        let path_a_exportar = this.props.nombreArchivo;
        // axios({
        //     url: 'http://localhost:8000/single',
        //     method: 'GET',
        //     responseType: 'blob', // important
        //     path: path_a_exportar,
        //   }).then((response) => {
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', 'foto.jpg');
        //     document.body.appendChild(link);
        //     link.click();
        //   });
        axios.get('http://34.139.161.175:8000/single?path='+path_a_exportar,{
            responseType:'blob',
            crossDomain: true,
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', path_a_exportar);
            document.body.appendChild(link);
            link.click();
          });
    };

    simplificar = () => {
        console.log("simplificar");
    }

    render() {
        return (
            <div className="containerExportar">
                <div className="containerTituloExportar">
                    <h2 className="tituloExportar">Exportar Partitura</h2>
                </div>
                <button className="btnExportar" onClick={() => this.exportarPartitura()}>Descargar PDF</button>
                <div className="containerTituloExportar">
                    <h4 className="tituloExportarChico">¿Muy dificil? ¡Simplificala!</h4>
                </div>
                <div>
                    <button className="btnExportarChico" onClick={() => this.simplificar()}>Simplificar</button>
                </div>

            </div>
        );
    }
}

export default ExportarPartitura;