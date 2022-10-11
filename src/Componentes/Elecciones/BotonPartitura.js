import React, {Component} from "react";
import './Elecciones.css';


class BotonPartitura extends Component {
    constructor(props){
        super(props);
        //Este elemento debe recibir si va a ser un boton de partitura o de tablatura y si esta habilitado o no
        this.state = {
            instrumento: this.props.instrumento,
            habilitado: this.props.habilitado,
            partitura: this.props.partitura
        }
        console.log(this.state);
    }

    render() {
        if (this.state.partitura === "si"){
            return (
                <button className="btnInstrumentoPequeño" disabled={!this.state.habilitado} onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento, this.state.partitura)}>
                    <h3 className="textoBotonEleccion">
                        Partitura
                    </h3>
                </button>
            );
        }else if (this.state.partitura === "no"){
            if (this.state.habilitado == "si"){
                return (
                    <div className="dropdown">
                         <button className="btnInstrumentoPequeño" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no")}>
                             <h3 className="textoBotonEleccion">Tablatura</h3>
                         </button>
                         <div className="dropdown-content">
                             {this.state.instrumento.compatibles.map((instrumento, index) => {
                                 return (
                                     <a onClick={() => this.props.elegirEsteInstrumento(instrumento,"no")}>{instrumento}</a>
                                 )
                             })}
                         </div>
                     </div>
                );
            }else{
                return (
                    <button className="btnInstrumentoPequeño" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no")} disabled={true}>
                        <h3 className="textoBotonEleccion">Tablatura</h3>
                    </button>
                )
            }
        }
    }
}

export default BotonPartitura;