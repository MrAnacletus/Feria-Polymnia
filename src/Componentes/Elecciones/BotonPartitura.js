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
        console.log(this.props, "props de boton partitura");
        if (this.state.partitura === "si"){
            return (
                <button className="btnInstrumentoPequeño" disabled={!this.state.habilitado} onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre, this.state.partitura)}>
                    <h3 className="textoBotonEleccion">
                        Partitura
                    </h3>
                </button>
            );
        }else if (this.state.partitura === "no"){
            if (this.state.habilitado == "si" && this.props.melodia === "no"){
                if (this.state.instrumento.compatibles.length == 0){
                    return(
                        <button className="btnInstrumentoPequeño" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no")}>
                            <h3 className="textoBotonEleccion">Tablatura</h3>
                        </button>
                    );
                }else{
                return (
                    <div className="dropdown">
                         <button className="btnInstrumentoPequeño" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no")}>
                             <h3 className="textoBotonEleccion">Tablatura<b class="caret dropdown-toggle"/></h3>
                         </button>
                         <div className="dropdown-content">
                             {this.state.instrumento.compatibles.map((instrumento, index) => {
                                 return (
                                     <a onClick={() => this.props.elegirEsteInstrumento(instrumento,"no")}>{instrumento}</a>
                                 )
                             })}
                         </div>
                     </div>
                );}
            }else if(this.state.habilitado == "si" && this.props.melodia === "si"){
                return (
                    <button className="btnInstrumentoPequeño" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no")}>
                        <h3 className="textoBotonEleccion">Tablatura</h3>
                    </button>
                );
            }
            else{
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