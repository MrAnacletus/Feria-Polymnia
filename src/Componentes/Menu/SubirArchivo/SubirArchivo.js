import React, { Component } from 'react';
import axios from 'axios';
import "./SubirArchivo.css";


axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
class SubirArchivo extends Component{
    constructor(){
        super();
        this.state = {
            habilitado:"",
            autorElegido: "Unknown",
            nombreElegido: "Untitled",
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
        this.changePage("PantallaDeCarga",false);
        let printIt = (data) => {
            console.log(data);
            const malo = "\\";
            const bueno = "/";
            let rutaDestino = data.replaceAll(malo, bueno);
            console.log(rutaDestino);
            let nombre=this.state.nombreElegido;
            let autor=this.state.autorElegido;
            axios.post('http://127.0.0.1:3001/partitas', {
                path: rutaDestino,
                nombre: nombre,
                autor: autor,
            },{CrossDomain: true})
                .then(response => {
                        this.changePage("EleccionInicial",rutaDestino);
                    })
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
            formData.append("nombre",this.state.nombreElegido)
            formData.append("autor",this.state.autorElegido)
            
            axios.post('http://localhost:8000/upload', formData, Headers={'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*'})
                .then(response => {
                    rutaArchivo = response.data.message;
                    //console.log(rutaArchivo);
                    
                    this.changePage("PantallaDeCarga", false);
                    printIt(rutaArchivo);
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
                    <input id="file-upload" type="file" onChange={this.onFileChange} accept="/wav, .mp3, .ogg, .flac"/>
                </label>
                <h5>Solo es posible procesar archivos en formato WAV, MP3, OGG y FLAC</h5> 
                
                <form>
                <label htmlFor="namedInput" >Nombre Canción:</label>
                <input id="namedInput" name="nombre" type="text" defaultValue={"Untitled"} placeholder={"Untitled"} onChange={this.changeHandlerNombre}/>
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
                    <input id="file-upload" type="file" onChange={this.onFileChange} accept=".wav, .mp3, .ogg, .flac"/>
                </label>
                <h5>Solo es posible procesar archivos en formato WAV, MP3, OGG y FLAC</h5>                 
                <button className='SubirBoton-disabled' id='botonSubir' type="submit" onClick={()=>this.changePage("EleccionInicial",true)}> 
                Procesar el audio
                </button>          
            </div>
        );
    
    }
}

export default SubirArchivo;