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

    changePage(value){
        this.props.sendData(value);
    }
    
    onFileUpload = () => {
        if (this.state.selectedFile !== undefined){
            let rutaArchivo;
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
                    this.changePage("PantallaDeCarga")
                })
                .catch(error => {
                    this.setState({ errorMessage: error.message });
                    console.error('There was an error!', error);
                });
            console.log(rutaArchivo)
            // formData ={
                
            // }
            // axios.post('http://localhost:8000/API', formData)
            //     .then(response => rutaArchivo = response.data.message)
            //     .catch(error => {
            //         this.setState({ errorMessage: error.message });
            //         console.error('There was an error!', error);
            //     })
        ;}else{
            this.changePage("PantallaDeCarga");
        }
    };
    render() { 
    return ( 
        <div className='conteinerInputs'>
            <label for="file-upload" class="custom-file-upload">
                Seleccionar Archivo
                <input id="file-upload" type="file" onChange={this.onFileChange}/>
            </label>
            <button className='SubirBoton' id='botonSubir' type="submit" onClick={this.onFileUpload} > 
            Subir
            </button>
        </div>
    ); 
    } 
}

export default SubirArchivo;