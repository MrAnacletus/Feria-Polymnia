import React, {Component} from "react";
import './Elecciones.css';
import instrumentos from "./instrumentos";
import axios from "axios";
import BotonPartitura from "./BotonPartitura";



class EleccionInstrumentos extends Component {
    constructor(){
        super();
        this.state = {
            toRender: "EleccionInicial",
            showSidebar: false,
        }
        this.changePage = this.changePage.bind(this);
        this.elegirEsteInstrumento = this.elegirEsteInstrumento.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    changePage(val,val2){
        this.props.sendData(val,val2);
    }

    toggleSidebar() {
        this.setState({
            showSidebar: !this.state.showSidebar
        });
    }

    elegirEsteInstrumento(instrumento, tipo, instrumento2){
        // Realizar un post a la api con el instrumento elegido y si es partitura o tablatura
        console.log(instrumento);
        console.log(instrumento2);
        console.log(tipo);
        this.changePage("PantallaDeCarga", false);
        axios.post('http://34.139.161.175:3001/eleccioninstrumentos', {
            instrumento: instrumento,
            instrumento2: instrumento2,
            partitura: tipo,
            melodia: 'no'
        })
            .then(response => {
                //response contiene un json con los instrumentos
                this.props.seleccionarInstrumento(instrumento, tipo);
                console.log(response.data + " Ruta archivo a descargar");
                this.changePage("ExportarPartitura", response.data);
            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    }

    render() {
        console.log(this.props, "props de eleccion instrumentos");
        if (this.props.boolean === false){
            return (
                <div className="container">
                    <div className="container col-md-5 text-start">
                        <h1 className="tituloMenu">Paso4: Elegir instrumento</h1>
                        <div className="d-flex justify-content-start">
                            <p className="d-block text-start">
                                Partitas ha analizado la canción y ha encontrado los siguientes instrumentos, elige el que desees para generar la partitura o tablatura.
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
                    </div>
                    <div className="container-fluid d-flex flex-row col-md-5 order-sm-1 p-2">
                        <div className="container-fluid">
                            <h1 className="tituloMenu">Elige que deseas hacer</h1>
                        </div>
                        <div className="container p-2">
                            {
                                this.props.instrumentos.map((instrumento, index) => {
                                    for (let i = 0; i < this.props.instrumentos.length; i++) {
                                        if (this.props.instrumentos[i] === instrumento.nombre) {
                                            return (
                                                <div className="card">
                                                    <div className="InstrumentoGrande">
                                                        <img className="imagenBotonEleccion" src={instrumento.imagen} alt={instrumento.nombre}/>
                                                        <h3 className="card-title textoBotonEleccion">{instrumento.nombre}</h3>
                                                    </div>
                                                    <div className="card-body">
                                                        <button className="btnInstrumentoPequeño" onClick={() => this.elegirEsteInstrumento(instrumento.nombre,"si")}>
                                                            <h3 className="textoBotonEleccion">Partitura</h3>
                                                        </button>
                                                        <button className="btnInstrumentoPequeño" onClick={() => this.elegirEsteInstrumento(instrumento.nombre,"no")} disabled={instrumento.tablatura === "no"}>
                                                            <h3 className="textoBotonEleccion">Tablatura</h3>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                            }
                                        }
                                    }
                                )
                            }
                        </div>
                        <button onClick={() => this.changePage()}>Regresar</button>
                        
                    </div>
                    
                </div>
            );
        }else{
            return (
                <div className="container-fluid d-flex flex-md-row flex-sm-column flex-column justify-content-around mt-5 mb-5 flex-nowrap gap-5">
                    {this.state.showSidebar &&
                    <div className="container col-md-5 text-start text-white">
                        <h1 className="tituloMenu">Paso4: Elegir instrumento</h1>
                        <div className="d-flex justify-content-start ">
                            <p className="d-block text-start">
                                Partitas ha analizado la canción y ha encontrado los siguientes instrumentos, elige el que desees para generar la partitura o tablatura.
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
                        <div className="container-fluid">
                            <a class="btn btn-light btn-estilo" onClick={this.toggleSidebar} role="button">Cerrar ayuda</a>
                        </div>
                    </div>}
                    {!this.state.showSidebar &&
                        <div className="verticaltext">
                            <a class="verticaltext_content btn btn-light btn-estilo" onClick={this.toggleSidebar} role="button">Ayuda</a>
                        </div>
                    }
                    <div className="container col-md-5 order-sm-1">
                        <h2 className="tituloMenu">Elige que deseas hacer</h2>
                        <div className="container row mt-2">
                            {
                                instrumentos.map((instrumento, index) => {
                                    return (
                                        <div className="card col-lg-3 col-md-5 col-sm-6 col-12 mt-2" Style="background-color: #212125 !important; border-color: #C3073F !important;">
                                            <div className="container-fluid d-flex justify-content-center flex-column align-items-center">
                                                <img className="card-img-top" Style="width: 60%; height: 70%; margin-top: 15px; margin-bottom: 15px; filter: invert(90);" src={instrumento.imagen} alt={instrumento.nombre}/>
                                                <h3 className="textoBotonEleccion" Style="color: #ffffff !important; font-size: 95%;">{instrumento.nombre}</h3>
                                            </div>
                                            <div className="card-body">
                                                <BotonPartitura className="d-block" instrumento={instrumento} elegirEsteInstrumento={this.elegirEsteInstrumento} habilitado={instrumento.tablatura} partitura={"si"} melodia="no"/>
                                                <BotonPartitura className="d-block" instrumento={instrumento} elegirEsteInstrumento={this.elegirEsteInstrumento} habilitado={instrumento.tablatura} partitura={"no"} melodia="no"/>
                                            </div>
                                        </div>
                                        )
                                    }
                                )
                            }
                        </div>
                        <div className="d-inherit m-2">
                            <button type="button" className="btn btn-estilo" onClick={() => this.changePage()}>
                                Volver
                            </button>
                        </div>
                        
                    </div>
                </div>
            );
        }
    }
}

export default EleccionInstrumentos;