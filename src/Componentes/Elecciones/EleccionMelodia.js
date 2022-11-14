import React, {Component} from "react";
import './Elecciones.css';
import axios from "axios";
import instrumentos from "./instrumentos";
import BotonPartitura from "./BotonPartitura";
import EleccionInicial from "./EleccionInicial";


class EleccionMelodia extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionMelodia",
            showSideBar: false,
        }
        this.changePage = this.changePage.bind(this);
        this.elegirEsteInstrumento = this.elegirEsteInstrumento.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.toRender = this.toRender.bind(this);
    }

    toggleSideBar() {
        this.setState({
            showSideBar: !this.state.showSideBar
        });
    }
    changePage(val,val2){
        this.props.sendData(val,val2);
    }
    toRender(value){
        this.props.toRender(value);
    }

    elegirEsteInstrumento(instrumento, tipo, instrumento2){
        // Realizar un post a la api con el instrumento elegido y si es partitura o tablatura
        this.changePage("PantallaDeCarga", false);
        axios.post('http://34.139.161.175:3001/eleccioninstrumentos', {
            instrumento: instrumento,
            instrumento2: instrumento2,
            partitura: tipo,
            melodia: "si"
        })
            .then(response => {
                //response contiene un json con los instrumentos
                this.props.seleccionarInstrumento(instrumento, tipo);
                console.log(response.data + " Ruta archivo a descargar");
                this.changePage("ExportarPartitura", response.data);
                // seleccionar instrumento

            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    }
    render(){
        console.log(this.props, "props de eleccion melodia");
        return(
            <div>
                <div className="container-fluid d-flex flex-md-row flex-sm-column flex-column justify-content-around mt-5 mb-5 flex-nowrap gap-5">
                    {this.state.showSideBar &&
                    <div className="container col-md-5 text-start text-white">
                        <h1 className="tituloMenu">Paso 5: Elige tu instrumento</h1>
                        <div className="d-flex justify-content-start ">
                            <p className="d-block text-start">
                                Partitas es capaz de compatibilizar la melodía y el formato solicitado para los siguientes instrumentos, escoge el que prefieras.
                            </p>
                        </div>
                        <h3 className="text-left col-12">1. ¿Porqué mi instrumento no aparece?</h3>
                        <ul>
                            <li><p className="d-block text-start">Mediante inteligencia artificial Partitas reconoce una cierta cantidad de instrumentos, la lista incluye batería, guitarra electrica y acustica,
                            piano, violín y violonchelo, entre muchos otros. Sin embargo, Partitas no es perfecto y no puede reconocer todos y cada uno de los instrumentos existentes.</p></li>
                        </ul>
                        <h3 className="text-left col-12">2. Puedo generar tanto partitura y tablatura, pero, ¿Puedo simplificar ambas?</h3>
                        <ul>
                            <li><p className="d-block text-start">No exactamente de cualquiera, pero tenemos una larga lista de instrumentos soportados que seguirá creciendo mientras adaptemos nuestro sistema a ellos.</p></li>
                        </ul>
                        <h3 className="text-left col-12">3. Si genero tablatura, ¿Puedo simplificarla?</h3>
                        <ul>
                            <li><p className="d-block text-start">Por ahora solo tenemos implementada la simplificación para partituras por lo tanto no podrás simplificar tus tablaturas, te invitamos a utilizar y probar la función en partituras.</p></li>
                        </ul>
                        <div className="col-12" Style="width: 100%; text-align: center;">
                            <button className="btn btn-dark btn-md col-12" Style="border-color: #950740; width:45%" onClick={this.toggleSideBar} role="button">Cerrar ayuda</button>
                        </div>
                    </div>}
                    {!this.state.showSideBar &&
                        <div className="verticaltext">
                            <a class="verticaltext_content btn btn-dark btn-md dropdown-toggle" Style="border-color: #950740;" onClick={this.toggleSideBar} role="button">Ayuda</a>
                        </div>
                    }
                    <div className="container col-md-5 order-sm-1">
                        <h2 className="tituloMenu">Elija su instrumento</h2>
                        <div className="container row mt-2">
                            {instrumentos.map((instrumento, index) => {
                                if (instrumento.melodia === "si"&& !(instrumento.tablatura==="no"&&this.props.partitura==="no")){
                                    return (
                                        <div className="card col-lg-3 col-md-5 col-sm-6 col-12 mt-2" Style="background-color: #212125 !important; border-color: #C3073F !important;">
                                            <div className="container-fluid d-flex justify-content-center flex-column align-items-center">
                                                <img className="card-img-top" Style="width: 60%; height: 70%; margin-top: 15px; margin-bottom: 15px; filter: invert(90);" src={instrumento.imagen} alt={instrumento.nombre}/>
                                                <h3 className="textoBotonEleccion" Style="color: #ffffff !important; font-size: 95%;">{instrumento.nombre}</h3>
                                            </div>
                                            <div className="card-body">
                                                <BotonPartitura className="d-block" instrumento={instrumento} habilitado={instrumento.tablatura} elegirEsteInstrumento={this.elegirEsteInstrumento} partitura={this.props.partitura} melodia="si"/>
                                            </div>
                                        </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className="d-inherit m-2">
                            <button type="button" className="btn" Style="border-color: #C3073F !important; color: #FFFFFF; width: 30%;" onClick={() => this.toRender("EleccionMelodia")}>
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EleccionMelodia;