import React, {Component} from "react";
import './Elecciones.css';


class BotonPartitura extends Component {
    constructor(props){
        super(props);
        this.state = {
            instrumento: this.props.instrumento,
            habilitado: this.props.habilitado
        }
        console.log(this.state);
    }

    render() {
        if (this.state.habilitado == "si"){
            return (
                <div className="dropdown">
                    <button className="btnInstrumentoPequeño" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento,"si")}>
                        <h3 className="textoBotonEleccion">Tablatura</h3>
                    </button>
                    <div className="dropdown-content">
                        {this.state.instrumento.compatibles.map((instrumento, index) => {
                            return (
                                <a onClick={() => this.props.elegirEsteInstrumento(instrumento,"si")}>{instrumento}</a>
                            )
                        })}
                    </div>
                </div>
            );
        } else {
        return (
            <div className="dropdown">
                <button className="btnInstrumentoPequeño" disabled={this.state.habilitado === "no"}>
                    <h3 className="textoBotonEleccion">No disponible</h3>
                </button>
            </div>
        );
        }
    }
}

export default BotonPartitura;