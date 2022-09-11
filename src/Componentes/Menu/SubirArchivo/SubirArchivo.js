import React, { Component } from 'react';
import axios from 'axios';
import "./SubirArchivo.css";



class SubirArchivo extends Component{
    constructor(){
        super();
        this.state = {
            habilitado:"",
            autorElegido: "Unknown",
        };
        this.changePage = this.changePage.bind(this);
        this.changeHandlerNombre = this.changeHandlerNombre.bind(this);
        this.changeHandlerAutor = this.changeHandlerAutor.bind(this);
    }

    onFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0],
            nombreDefault: event.target.files[0].name.slice(0,event.target.files[0].name.length-4)
        });
        
    };

    changePage(value,value2){
        this.props.sendData(value,value2);
    }

    changeHandlerNombre(event){
        this.setState({
            nombreElegido: event.target.value
        });
    }
    changeHandlerAutor(event){
        this.setState({
            autorElegido: event.target.value
        });
    }
    
    onFileUpload = () => {
        console.log(this.state.nombreElegido);
        let printIt = (data) => {
            console.log(data);
            const malo = "\\";
            const bueno = "/";
            let rutaDestino = data.replaceAll(malo, bueno);
            let tipo = "voz";
            let nombre=this.state.nombreElegido;
            let autor=this.state.autorElegido;
            console.log(rutaDestino);
            var formData1 = new FormData();
            formData1.append(
                "path",
                rutaDestino
                )
            formData1.append(
                "type",
                tipo
            )
            formData1.append("nombre",nombre)
            formData1.append("autor",autor)
            axios.post('http://127.0.0.1:3001/partitas', {
                path: rutaDestino,
                type: tipo,
                nombre: nombre,
                autor: autor
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
                // this.state.nombreElegido,
                // this.state.autorElegido
                )
            formData.append("nombre",this.state.nombreElegido)
            formData.append("autor",this.state.autorElegido)
            
            axios.post('http://127.0.0.1:8000/upload', formData, Headers={'Content-Type': 'multipart/form-data'})
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
        if (this.state.selectedFile !== undefined){
            return (
                <div className='conteinerInputs'>
                <label for="file-upload" class="custom-file-upload">
                    {this.state.selectedFile.name}
                    <input id="file-upload" type="file" onChange={this.onFileChange} accept=".wav"/>
                </label>
                <h5>Por el momento solo es posible procesar archivos WAV</h5> 
                
                <form>
                <label htmlFor="namedInput" >Nombre Canción:</label>
                <input id="namedInput" name="nombre" type="text" placeholder={this.state.nombreDefault} required={true} onChange={this.changeHandlerNombre}/>
                <label htmlFor="namedInput" >Autor</label>
                <input id="namedInput" name="autor" type="text" defaultValue={"Unknown"} placeholder={"Unknown"} onChange={this.changeHandlerAutor} on/>
                </form>
                
                <button className='SubirBoton' id='botonSubir' type="submit" onClick={this.onFileUpload} disabled={false}> 
                Procesar el audio
                </button>          
            </div>
            )
        }
        return ( 
            <div className='conteinerInputs'>
                <label for="file-upload" class="custom-file-upload">
                    Seleccionar Archivo
                    <input id="file-upload" type="file" onChange={this.onFileChange} accept=".wav"/>
                </label>
                <h5>Por el momento solo es posible procesar archivos WAV</h5>                 
                <button className='SubirBoton-disabled' id='botonSubir' type="submit" onClick={this.onFileUpload} disabled={true}> 
                Procesar el audio
                </button>          
            </div>
        );
    
    }
}

export default SubirArchivo;