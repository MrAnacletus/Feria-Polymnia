import axios from "axios";
import React, {Component} from "react";
import './ExportarPartitura.css';

axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
class ExportarPartitura extends Component {
    constructor(){
        super();
        this.state = {
            Tono: 0,
            acordes: '',
            manoIzq: '',

        }
        this.changePage = this.changePage.bind(this);
        this.exportarPartitura = this.exportarPartitura.bind(this);
        this.simplificar = this.simplificar.bind(this);
        this.sumarTono = this.sumarTono.bind(this);
    }

    changePage(val,val2){
        this.props.sendData(val,val2);
    }

    sumarTono(valor){
        if (this.state.Tono + valor >= -11 && this.state.Tono + valor <= 11){
            this.setState({Tono: this.state.Tono + valor})
        }
        if (this.state.Tono + valor < -11){
            this.setState({Tono: 11})
        }
        if (this.state.Tono + valor > 11){
            this.setState({Tono: -11})
        }
    }

    aplicarCambios(){
        // Realizar un post a la api con el instrumento elegido y si es partitura o tablatura
        // primero recuperar los valores de los inputs
        let tono = parseInt(this.state.Tono);
        let acordes = "";
        let derecha = "";
        if (this.state.acordes === "si"){
            acordes = "si"
        }else{
            acordes = "no"
        }
        if (this.state.manoIzq === "si"){
            derecha = "si"
        }
        else{
            derecha = "no"
        }
        console.log(tono);
        console.log(acordes);
        console.log(derecha);
        this.changePage("PantallaDeCarga", false);
        axios.post('http://34.139.161.175:3001/simplificar', {
            tono: tono,
            acordes: acordes,
            derecha: derecha,
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

    exportarPartitura = () => { 
        console.log(this.props.nombreArchivo + " nombre archivo a exportar");
        let path_a_exportar = this.props.nombreArchivo;
        // axios({
        //     url: 'http://localhost:8000/single',
        //     method: 'GET',
        //     responseType: 'blob', // important
        //     path: path_a_exportar,
        //   }).then((response) => {
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', 'foto.jpg');
        //     document.body.appendChild(link);
        //     link.click();
        //   });
        axios.get('http://34.139.161.175:8000/single?path='+path_a_exportar,{
            responseType:'blob',
            crossDomain: true,
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', path_a_exportar);
            document.body.appendChild(link);
            link.click();
          });
    };

    simplificar = () => {
        console.log("simplificar");
    }
    handleChange = (parte,event) => {
        if (parte === "acordes"){
            this.setState({acordes: event.target.value});
        }
        if (parte === "manoIzq"){
            this.setState({manoIzq: event.target.value});
        }
    }

    render() {
        console.log(this.props)
        return (
            <div className="container">
                <div className="containerTituloExportar">
                    <h2 className="tituloExportar">Exportar Partitura</h2>
                </div>
                <button className="btnExportar" onClick={() => this.exportarPartitura()}>Descargar PDF</button>
                {
                    this.props.tipoDocumento === "partitura"?
                    <div>
                        <div className="row">
                            <div className="col">
                                <div className="containerTituloExportar">
                                    <h4 className="tituloExportarChico">¿Muy dificil? ¡Simplificala!</h4>
                                </div>
                                <form>
                                    <div className="form-group">
                                        <div className="input-group justify-content-center">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="simpAcordes" onChange={e => this.handleChange("acordes",e)} value="si"></input>
                                                <label className="form-check-label text-dark checkbox-inline" for="simpAcordes">
                                                    <p>Simplificar acordes</p>
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            this.props.instrumento == "Piano"?
                                                <div className="input-group justify-content-center">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" name="elimMano" id="elimManoIzquierda" onChange={e => this.handleChange("manoIzq",e)} value="si"></input>
                                                        <label className="form-check-label text-dark" for="elimManoIzquierda">
                                                            <p>Eliminar mano izquierda</p>
                                                        </label>
                                                    </div>
                                                </div>:null
                                        }
                                    </div>
                                </form>
                            </div>
                            <div className="col">
                                <div className="containerTituloExportar">
                                    <h4 className="tituloExportarChico">¿Quieres cambiar el tono?</h4>
                                </div>
                                <form className="form">
                                    <div className="form-group row justify-content-center">
                                        {/* Dos botones y un numero central que sumar y bajan el mismo numero  */}
                                        <button className="btn btn-light col-1 text-dark" type="button" id="button-addon1" onClick={()=>this.sumarTono(-1)}>-</button>
                                        <h2 className="col-1 text-dark">{this.state.Tono}</h2>
                                        <button className="btn btn-light col-1 text-dark" type="button" id="button-addon1" onClick={()=>this.sumarTono(1)}>+</button>
                                    </div>
                                    {/* Pequeña descripción del tono */}
                                    <div className="container">
                                        <p className="text-dark">
                                            El tono es la distancia entre la nota original y la nota que quieres tocar.
                                            Por ejemplo, si quieres tocar una canción en la tonalidad de Do mayor, pero la canción está en la tonalidad de Sol mayor, el tono es de 5.
                                            Si quieres tocar una canción en la tonalidad de Sol mayor, pero la canción está en la tonalidad de Do mayor, el tono es de -5.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="container">
                            <button className="btnExportarChico" onClick={() => this.aplicarCambios()}>
                                Aplicar cambios
                            </button>
                        </div>
                    </div>
                    :null}
            </div>
        );
    }
}

export default ExportarPartitura;