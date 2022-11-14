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
            toRender: "EleccionInicial",
            showSideBar: false,
        }
        this.changePage = this.changePage.bind(this);
        this.toRender = this.toRender.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
    }

    toggleSideBar () {
        this.setState({
            showSideBar: !this.state.showSideBar
        });
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
                    {this.state.showSideBar &&
                    <div className="container col-md-5 d-flex flex-column justify-content-start gap-3 text-start order-sm-2 order-md-2 order-lg-1">
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
                        <div className="container-fluid">
                            <button class="btn btn-light" onClick={this.toggleSideBar} role="button">Cerrar ayuda</button>
                        </div>
                    </div>
                    }
                    {!this.state.showSideBar &&
                    <div className="verticaltext">
                        <button class="verticaltext_content btn btn-light" onClick={this.toggleSideBar} role="button">Ayuda</button>
                    </div>
                    }
                    <div className="container flex-column col-md-5 order-sm-1">
                        <h1 className="tituloMenu">¿Qué quieres hacer?</h1>
                        <div className="containerBotones">
                            <button className="btn btn-light" onClick={() => this.elegirInstrumentos()}>Elegir instrumentos</button>
                            <button className="btn btn-light" onClick={() => this.elegirMelodia()}>Elegir melodía</button>
                        </div>
                    </div>
                </div>
            );
        }else if (this.state.toRender === "EleccionMelodia"){
            return (
                <div className="container-fluid d-flex flex-md-row flex-sm-column flex-column justify-content-around mt-5 mb-5 flex-nowrap gap-5">
                    {this.state.showSideBar &&
                    <div className="container col-md-5 d-flex flex-column justify-content-start gap-3 text-start order-sm-2 order-md-2 order-lg-1 text-white">
                        <h1 className="tituloMenu">Paso 4: Elige como quieres tu melodía</h1>
                        <div className="d-flex justify-content-start">
                            <p className="d-block text-start">
                                Partitas analizará la canción que le entregaste en busca de una voz y uno o varios instrumentos, tu siguiente decición es si quieres que Partitas te entregue una melodía o una selección de instrumentos.
                            </p>
                        </div>
                        <h3 className="text-left col-12">1. ¿Cuál es la diferencia?</h3>
                        <ul>
                            <li><p className="d-block text-start">Las partituras son una forma universal te entender el como tocar un instrumento mientras que las tablaturas son solo para instrumentos de cuerdas.</p></li>
                        </ul>
                        <h3 className="text-left col-12">2. ¿Si elijo una u otra, puedo volver atrás si cambio de opinión?</h3>
                        <ul>
                            <li><p className="d-block text-start">Si eliges cualquiera de las 2 opciones puedes volver a esta pantalla, sientete libre de elegir hasta antes de elegir que instrumento.</p></li>
                        </ul>
                        <div className="col-12" Style="width: 100%; text-align: center;">
                            <button className="btn btn-dark btn-md col-12" Style="border-color: #950740; width:55%" onClick={this.toggleSideBar} role="button">Cerrar ayuda</button>
                        </div>
                    </div>
                    }
                    {!this.state.showSideBar &&
                    <div className="verticaltext">
                        <button class="verticaltext_content btn btn-dark btn-md" Style="border-color: #950740;" onClick={this.toggleSideBar} role="button">Ayuda</button>
                    </div>
                    }
                    <div className="container flex-column col-md-5 order-sm-1">
                        <h1 className="tituloMenu">¿Como la deseas?</h1>
                        <div className="row" Style="height: 100%;">
                            <div className="col-lg-6 p-1">
                                <button className="btn btn-dark btn-md" Style="border-color: #950740; width: 55%;" onClick={() => this.toRender("EleccionMelodiaGenerada partitura")} >En partitura</button>
                            </div>    
                            <div className="col-lg-6 p-1">    
                                <button className="btn btn-dark btn-md" Style="border-color: #950740; width: 55%;" onClick={() => this.toRender("EleccionMelodiaGenerada tablatura")} >En tablatura</button>
                            </div>
                            
                            <div className="col-12" Style="width: 100%;">
                                <button className="btn btn-dark btn-md" Style="border-color: #950740; width: 45%;" onClick={() => this.toRender("EleccionInicial")}>Volver</button>
                            </div>
                        </div>
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