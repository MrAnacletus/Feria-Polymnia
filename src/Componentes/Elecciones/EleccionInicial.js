import React, {Component} from "react";
import './Elecciones.css';
import PantalladeCarga from "../PantallaDeCarga/PantallaDeCarga";
import axios from "axios";


class EleccionInicial extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionInicial"
        }
        this.changePage = this.changePage.bind(this);
    }

    changePage(val,val2){
        this.props.sendData(val,val2);
    }

    elegirInstrumentos(){
        this.changePage("PantallaDeCarga", false);
        axios.post('http://34.139.161.175:3001/eleccioninicial', {
            eleccion: 'instrumentos'
                })
            .then(response => {
                //response contiene un json con los instrumentos
                this.changePage("EleccionInstrumentos", response.data);
                console.log(response.data);
            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    }

    elegirMelodia(){
        this.changePage("PantallaDeCarga", false);
        var formData = new FormData();
        formData.append("eleccion","melodia");
        axios.post('http://34.139.161.175:3001/eleccioninicial', {
            eleccion: 'melodia'
        })
            .then(response => {
                //response contiene un json con los instrumentos
                this.changePage("ExportarPartitura", response.data);
                console.log(response.data + " Ruta archivo a descargar");
            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    }


    render() {
        return (
            <div className="containerEleccion">
                <div className="containerTituloEleccion">
                    <h2 className="tituloEleccion">Elije que deseas hacer</h2>
                </div>
                <div className="containerBotones">
                    <button className="btnEleccion" onClick={() => this.elegirInstrumentos()} >Generar partitura de un instrumento</button>
                    <button className="btnEleccion" onClick={() => this.elegirMelodia()} >Generar partitura de melodía</button>
                </div>
            </div>
        );
    }
}

export default EleccionInicial;