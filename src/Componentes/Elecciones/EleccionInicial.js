import React, {Component} from "react";
import './Elecciones.css';
import PantalladeCarga from "../PantallaDeCarga/PantallaDeCarga";
import axios from "axios";
import EleccionMelodia from "./EleccionMelodia";

var rutaArchivo = '';

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

    toRender(value){
        this.setState({
            toRender: value
        });
    }

    elegirInstrumentos(){
        if (this.props.boolean === true){
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
        if (this.props.boolean === true){
            this.toRender("EleccionMelodia");
        }else{
            this.toRender("PantallaDeCarga");
            axios.post('http://34.139.161.175:3001/eleccioninicial', {
                eleccion: 'melodia'
            })
                .then(response => {
                    //response contiene un json con los instrumentos
                    rutaArchivo = response.data;
                    this.toRender("EleccionMelodia");
                    console.log(response.data + " Ruta archivo a descargar");
                })
                .catch(error => {
                    this.setState({ errorMessage: error.message });
                    console.error('There was an error!', error);
                });
        }
    }

    
    render() {
        console.log(this.props, "props de eleccion inicial");
        if (this.state.toRender === "EleccionInicial"){
            return (
                <div className="container-fluid d-flex flex-md-row flex-sm-column flex-column justify-content-around mt-5 mb-5 flex-nowrap gap-5">
                    <div className="col-md-5 d-flex flex-column justify-content-start gap-3 text-start order-sm-2 order-md-2 order-lg-1">
                        <h1 className="tituloMenu">Paso3: Elegir entre melodia o instrumentos</h1>
                        <div className="d-flex justify-content-start">
                            <p className="d-block text-start">
                                Partitas analizará la canción que le entregaste en busca de una voz y uno o varios instrumentos, tu siguiente decición es si quieres que Partitas te entregue una melodía o una selección de instrumentos.
                            </p>
                        </div>
                        <h3 className="text-left col-12">1. ¿Cómo Partitas generará la melodía?</h3>
                        <ul>
                            <li><p className="d-block text-start">Mediante inteligencia artificial Partitas reconoce la voz presente en la cacnión, a partir de esta se generará la melodía siguiento las notas
                            de la voz.</p></li>
                        </ul>
                        <h3 className="text-left col-12">2. ¿Si elijo una u otra, puedo volver atrás si cambio de opinión?</h3>
                        <ul>
                            <li><p className="d-block text-start">Si eliges cualquiera de las 2 opciones puedes volver a esta pantalla, sientete libre de elegir hasta antes de elegir que instrumento.</p></li>
                        </ul>
                    </div>
                    <div className="flex-column col-md-5 order-sm-1">
                        <h1 className="tituloMenu">¿Qué quieres hacer?</h1>
                        <div className="containerBotones">
                            <button className="btnEleccion" onClick={() => this.elegirInstrumentos()}>Elegir instrumentos</button>
                            <button className="btnEleccion" onClick={() => this.elegirMelodia()}>Elegir melodía</button>
                        </div>
                    </div>
                </div>
            );
        }else if (this.state.toRender === "EleccionMelodia"){
            return (
                <div className="container">
                    <div className="container">
                        <h2 className="tituloEleccion">¿Qué quieres hacer?</h2>
                    </div>
                    <div className="containerBotones">
                        <button className="btnEleccion" onClick={() => this.toRender("EleccionMelodiaGenerada partitura")} >Generar partitura de la melodía</button>
                        <button className="btnEleccion" onClick={() => this.toRender("EleccionMelodiaGenerada tablatura")} >Generar tablatura de la melodía</button>
                        {/* boton de  volver */}
                        <button className="btnEleccion" onClick={() => this.toRender("EleccionInicial")}>Volver</button>
                    </div>
                </div>
            );
        }else if (this.state.toRender === "PantallaDeCarga"){
            return (
                <PantalladeCarga />
            );
        }else if (this.state.toRender === "EleccionMelodiaGenerada partitura"){
            return (
                <EleccionMelodia boolean = {this.props.boolean} toRender={this.toRender} sendData={this.props.sendData} partitura="si" seleccionarInstrumento={this.props.seleccionarInstrumento}/>
            )
        }else if (this.state.toRender === "EleccionMelodiaGenerada tablatura"){
            return (
                <EleccionMelodia boolean = {this.props.boolean} toRender={this.toRender} sendData={this.props.sendData} partitura="no" seleccionarInstrumento={this.props.seleccionarInstrumento}/>
            )
        }

    }
}

export default EleccionInicial;