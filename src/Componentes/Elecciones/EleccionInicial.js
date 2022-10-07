import React, {Component} from "react";
import './Elecciones.css';
import PantalladeCarga from "../PantallaDeCarga/PantallaDeCarga";
import axios from "axios";
import EleccionMelodia from "./EleccionMelodia";


class EleccionInicial extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionInicial"
        }
        this.changePage = this.changePage.bind(this);
        this.toRender = this.toRender.bind(this);
    }

    changePage(val,val2){
        this.props.sendData(val,val2);
    }

    elegirInstrumentos(){
        if (this.props.boolean){
            this.changePage("EleccionInstrumentos", true);
        }else{
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
        
    }

    elegirMelodia(){
        if (this.props.boolean){
            this.toRender("EleccionMelodiaGenerada");
        }else{
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
        
    }

    toRender(value){
        this.setState({
            toRender: value
        });
    }


    render() {
        if (this.state.toRender === "EleccionInicial"){
            return (
                <div className="containerEleccion">
                    <div className="containerTituloEleccion">
                        <h2 className="tituloEleccion">¿Qué quieres hacer?</h2>
                    </div>
                    <div className="containerBotones">
                        <button className="btnEleccion" onClick={() => this.elegirInstrumentos()}>Elegir instrumentos</button>
                        <button className="btnEleccion" onClick={() => this.toRender("EleccionMelodia")}>Elegir melodía</button>
                    </div>
                </div>
            );
        }else if (this.state.toRender === "EleccionMelodia"){
            return (
                <div className="containerEleccion">
                    <div className="containerTituloEleccion">
                        <h2 className="tituloEleccion">¿Qué quieres hacer?</h2>
                    </div>
                    <div className="containerBotones">
                        <button className="btnEleccion" onClick={() => this.elegirMelodia()} >Generar partitura de la melodía</button>
                        <button className="btnEleccion" onClick={() => this.elegirMelodia()} >Generar tablatura de la melodía</button>
                        {/* boton de  volver */}
                        <button className="btnEleccion" onClick={() => this.toRender("EleccionInicial")}>Volver</button>
                    </div>
                </div>
            );
        }else if (this.state.toRender === "PantallaDeCarga"){
            return (
                <PantalladeCarga />
            );
        }else if (this.state.toRender === "EleccionMelodiaGenerada"){
            return (
                <EleccionMelodia boolean = {this.props.boolean} sendData={this.props.sendData}/>
            )
        }

    }
}

export default EleccionInicial;