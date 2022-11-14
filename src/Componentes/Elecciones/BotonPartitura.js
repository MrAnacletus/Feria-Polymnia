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
                <button type="button" className="btn btn-dark btn-estilo" disabled={!this.state.habilitado} onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre, this.state.partitura,"a")}>
                    Partitura
                </button>
            );
        }else if (this.state.partitura === "no"){
            if (this.state.habilitado == "si" && this.props.melodia === "no"){
                if (this.state.instrumento.compatibles.length == 0){
                    return(
                        <button type="button" className="btn btn-dark btn-estilo" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no","a")}>
                            Tablatura
                        </button>
                    );
                }else{
                return (
                    <div className="dropdown">
                         <button type="button" className="btn btn-dark btn-estilo dropdown-toggle" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no","a")}>
                            Tablatura
                         </button>
                         <div className="dropdown-content">
                             {this.state.instrumento.compatibles.map((instrumento, index) => {
                                 return (
                                     <a onClick={() => this.props.elegirEsteInstrumento(this.props.instrumento.nombre,"no",instrumento)}>{instrumento}</a>
                                 )
                             })}
                         </div>
                     </div>
                );}
            }else if(this.state.habilitado == "si" && this.props.melodia === "si"){
                return (
                    <button type="button" className="btn btn-dark btn-estilo" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no","a")}>
                        Tablatura
                    </button>
                );
            }
            else{
                return (
                    <button type="button" className="btn btn-dark btn-estilo" onClick={() => this.props.elegirEsteInstrumento(this.state.instrumento.nombre,"no","a")} disabled={true}>
                        Tablatura
                    </button>
                )
            }
        }
    }
}

export default BotonPartitura;