import React, { Component } from 'react';
import axios from 'axios';
import "./SubirArchivo.css";
 
class SubirArchivo extends Component{
    constructor(){
        super();
        this.state = {};
        this.changePage = this.changePage.bind(this);
    }

    onFileChange = event => { 
        this.setState({ selectedFile: event.target.files[0] });
    };

    changePage(value,value2){
        this.props.sendData(value,value2);
    }
    
    onFileUpload = () => {
        let printIt = (data) => {
            console.log(data);
            const malo = "\\";
            const bueno = "/";
            let rutaDestino = data.replaceAll(malo, bueno);
            console.log(rutaDestino);
            var formData1 = new FormData();
            formData1.append(
                "path",
                rutaDestino
                )
            axios.post('http://127.0.0.1:8000/partitas', {
                path: rutaDestino
            })
                .then(response => {
                        rutaDestino = response.data[0];
                        this.changePage("ExportarPartitura",rutaDestino);
                        console.log(rutaDestino);})
                .catch(error => {
                    this.setState({ errorMessage: error.message });
                    console.error('There was an error!', error);
                })
        }
        if (this.state.selectedFile !== undefined){
            var rutaArchivo;
            console.log(this.state.selectedFile);
            var formData = new FormData();
            formData.append(
                "file",
                this.state.selectedFile,
                this.state.selectedFile.name
                )
            axios.post('http://localhost:8000/upload', formData)
                .then(response => {
                    rutaArchivo = response.data.message;
                    //console.log(rutaArchivo);
                    printIt(rutaArchivo);
                    this.changePage("PantallaDeCarga", false);
                })
                .catch(error => {
                    this.setState({ errorMessage: error.message });
                    console.error('There was an error!', error);
                });
            //console.log(printIt);
        ;}else{
            this.changePage("PantallaDeCarga", true);
        }
    };
    render() { 
    return ( 
        <div className='conteinerInputs'>
            <label for="file-upload" class="custom-file-upload">
                Seleccionar Archivo
                <input id="file-upload" type="file" onChange={this.onFileChange}/>
            </label>
            <h5>Por el momento solo es posible procesar archivos WAV</h5>
            
            <button className='SubirBoton' id='botonSubir' type="submit" onClick={this.onFileUpload} > 
            Generar partitura
            </button>
        </div>
    ); 
    } 
}

export default SubirArchivo;