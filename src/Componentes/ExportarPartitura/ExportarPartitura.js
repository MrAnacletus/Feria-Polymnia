import axios from "axios";
import React, {Component} from "react";
import './ExportarPartitura.css';
import 'html-midi-player';


axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
class ExportarPartitura extends Component {
    constructor(){
        super();
        this.state = {
            Tono: 0,
            acordes: '',
            manoIzq: '',
            notas: '',
            manoDer: '',
            cejillos: '',
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
        let izquierda = "";
        let notas = "";
        let cejillos = "";
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
        }if (this.state.manoDer === "si"){
            izquierda = "si"
        }else{
            izquierda = "no"  
        }if (this.state.notas === "si"){
            notas = "si"
        }else{
            notas = "no"
        }if (this.state.cejillos){
            cejillos = "si"
        }else{
            cejillos = "no"
        }

        console.log("Cambios aplicados: " + tono + " " + acordes + " " + derecha + " " + izquierda + " " + notas);
        this.changePage("PantallaDeCarga", false);
        axios.post('http://34.139.161.175:3001/simplificar', {
            tono: tono,
            acordes: acordes,
            derecha: derecha,
            izquierda: izquierda,
            teclas: notas,
            cejillos: cejillos,
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
        if (parte === "manoDer"){
            this.setState({manoDer: event.target.value});
        }
        if (parte === "notas"){
            this.setState({Tono: event.target.value});
        }
        if (parte === "cejillos"){
            this.setState({cejillos: event.target.value});
        }
    }

    render() {
        console.log(this.props);
        let nombrePDF = this.props.nombreArchivo;
        let nombreMIDI = this.props.nombreMidi;
        return (
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-sm-6 p-3">
                        <iframe src={"http://localhost:8000/imagen?path="+nombrePDF} width="100%" height="100%"></iframe>
                    </div>
                    <div className="col-sm-6 p-3">
                        <div className="row">
                            <div className="container">
                                <div className="containerTituloExportar">
                                    <h2 className="tituloExportar" Style="color: white;">{this.props.tipoDocumento === "partitura"?"Exportar Partitura":"Exportar Tablatura"}</h2>
                                </div>
                                <div className="p-1">
                                    <midi-player src={"http://localhost:8000/imagen?path=" + nombreMIDI}></midi-player>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2"></div>
                                <div className="col-lg-4 p-1">
                                    <button className="btn btn-dark btn-md" Style="border-color: #950740;" onClick={() => this.exportarPartitura()}>Descargar PDF</button>
                                </div>    
                                <div className="col-lg-4 p-1">    
                                    <button className="btn btn-dark btn-md" Style="border-color: #950740;" onClick={() => this.exportarPartitura()}>Descargar Midi</button>
                                </div>
                                <div className="col-lg-2 "></div>
                            </div>
                            <div className="container">
                                {
                                    this.props.tipoDocumento === "partitura"?
                                    <>
                                        <div className="row">
                                            <div className="container p-2" Style="width: 75%">
                                                <div className="accordion" id="accordionExample">
                                                    <div className="accordion-item" Style="border-color: #950740;">
                                                        <h2 className="accordion-header"  id="headingTwo">
                                                        <button href="#simplify" className="btn accordion-button collapsed bg-dark" type="button" Style="width: 100%; background-color: #212125 !important; color: #ffffff !important; outline-color: #950740; !important;" data-bs-toggle="collapse" data-bs-target="#simplify" aria-expanded="false" aria-controls="simplify">Simplificar</button>
                                                        </h2>
                                                        <div id="simplify" className="accordion-collapse collapse bg-dark" Style="width: 100%" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                            <div className="accordion-body bg-dark">
                                                                <form>
                                                                    <div className="form-group">
                                                                        <div className="input-group justify-content-center">
                                                                            <div className="form-check col-6 m-2">
                                                                                <input className="form-check-input" type="checkbox" id="simpAcordes" onChange={e => this.handleChange("acordes",e)} value="si"></input>
                                                                                <label className="form-check-label checkbox-inline" for="simpAcordes">
                                                                                    <p>Simplificar acordes</p>
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-check col-6 m-2">
                                                                                <input className="form-check-input" type="checkbox" id="simpNotas" onChange={e => this.handleChange("notas",e)} value="si"></input>
                                                                                <label className="form-check-label checkbox-inline" for="simpnNotas">
                                                                                    <p>Simplificar quitando notas</p>
                                                                                </label>
                                                                            </div>
                                                                        {
                                                                            this.props.instrumento == "Piano"?
                                                                                <>
                                                                                <div className="form-check col-6 m-2">
                                                                                    <input className="form-check-input" type="checkbox" name="elimMano" id="elimManoIzquierda" onChange={e => this.handleChange("manoIzq",e)} value="si"></input>
                                                                                    <label className="form-check-label" for="elimManoIzquierda">
                                                                                        <p>Eliminar mano izquierda</p>
                                                                                    </label>
                                                                                </div>
                                                                                <div className="form-check col-6 m-2">
                                                                                    <input className="form-check-input" type="checkbox" name="elimMano" id="elimManoDerecha" onChange={e => this.handleChange("manoDer",e)} value="si"></input>
                                                                                    <label className="form-check-label" for="elimManoDerecha">
                                                                                        <p>Eliminar mano derecha</p>
                                                                                    </label>
                                                                                </div>
                                                                                </>:null
                                                                        }
                                                                        
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                           
                                            <div className="container p-2" Style="width: 75%">
                                                <div className="accordion" >
                                                    <div className="accordion-item" Style="border-color: #950740;">
                                                        <h2 className="accordion-header">
                                                        <button href="#tone" className="btn accordion-button collapsed bg-dark" Style="width: 100%; color: white; background-color: #212125 !important;" data-bs-toggle="collapse">Cambiar el tono</button>
                                                        </h2>
                                                        <div id="tone" className="accordion-collapse collapse bg-dark" Style="width: 100%">
                                                            <div className="accordion-body bg-dark">
                                                                <form className="form">
                                                                    <div className="form-group row justify-content-center">
                                                                        {/* Dos botones y un numero central que sumar y bajan el mismo numero  */}
                                                                        <button className="btn btn-dark col-2 text-white px-2" Style="width: 10%; height: 5%; background-color: #950740;" type="button" id="button-addon1" onClick={()=>this.sumarTono(-1)}>-</button>
                                                                        <h2 className="col-2 text-white px-2">{this.state.Tono}</h2>
                                                                        <button className="btn btn-dark col-2 text-white px-2" Style="width: 10%; height: 5%; background-color: #950740;"  type="button" id="button-addon1" onClick={()=>this.sumarTono(1)}>+</button>
                                                                    </div>
                                                                    <p>*Indique el número de semitonos.</p>
                                                                    {/* Pequeña descripción del tono */}
                                                                    <p className="pt-2">
                                                                    <button class="btn btn-sm btn-dark" Style="width: 30%; border-color: #950740;" type="button" data-bs-toggle="collapse" data-bs-target="#collExample" aria-expanded="false" aria-controls="collExample">
                                                                        ¿Qué es el tono?
                                                                    </button>
                                                                    </p>
                                                                    <div className="collapse" id="collExample">
                                                                        <div className="card card-body bg-dark" Style="color: white;">
                                                                                El tono es la distancia entre la nota original y la nota que quieres tocar.
                                                                                Por ejemplo, si quieres tocar una canción en la tonalidad de Do mayor, pero la canción está en la tonalidad de Sol mayor, el tono es de 5.
                                                                                Si quieres tocar una canción en la tonalidad de Sol mayor, pero la canción está en la tonalidad de Do mayor, el tono es de -5.
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="container">
                                            <button className="btn btn-dark btn-large" Style="width: 30%; border-color: #950740;" onClick={() => this.aplicarCambios()}>
                                                Aplicar cambios
                                            </button>
                                        </div>
                                    </>
                                    :
                                    <>
                                    <div className="row">
                                        <div className="container p-2" Style="width: 75%">
                                            <div className="accordion">
                                                <div className="accordion-item bg-dark" Style="border-color: #950740;">
                                                    <h2 className="accordion-header">
                                                        <button href="#simplify" className="btn accordion-button collapsed" Style="width: 100%;  color: white; background-color: #212125 !important;" data-bs-toggle="collapse">Simpificar</button>
                                                    </h2>
                                                    <div id="simplify" className="accordion-collapse collapse bg-dark " Style="width: 100%;" >
                                                        <div className="accordion-body bg-dark">
                                                            <form>
                                                                <div className="form-group">
                                                                    <div className="input-group justify-content-center">
                                                                        <div className="form-check col-6 m-2">
                                                                            <input className="form-check-input" type="checkbox" id="cejillos" onChange={e => this.handleChange("cejillos",e)} value="si"></input>
                                                                            <label className="form-check-label text-dark checkbox-inline" for="cejillos">
                                                                                <p>Simplificar eliminando cejillos</p>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="container">
                                            <button className="btn btn-dark btn-large" Style="width: 30%; border-color: #950740;" onClick={() => this.aplicarCambios()}>
                                                Aplicar cambios
                                            </button>
                                        </div>
                                    </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ExportarPartitura;