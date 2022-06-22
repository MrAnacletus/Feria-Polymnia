import React, { Component, useState } from 'react';
import axios from 'axios';
import "./SubirArchivo.css";
 
class SubirArchivo extends Component{
    constructor(){
        super();
        this.state = {};
    }

    onFileChange = event => { 
        this.setState({ selectedFile: event.target.files[0] });
    }; 
    
    onFileUpload = () => {
        let rutaArchivo;
        console.log(this.state.selectedFile);
        const formData = new FormData();
        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
            )
        axios.post('http://localhost:8000/upload', formData)
            .then(response => rutaArchivo = response.data.message)
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
        formData ={
            
        }
        axios.post('http://localhost:8000/API', formData)
            .then(response => rutaArchivo = response.data.message)
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
    };
    fileData = () => { 
    if (this.state.selectedFile) { 
        return ( 
        <div> 
            <h2>File Details:</h2> 
            <p>File Name: {this.state.selectedFile.name}</p> 
            <p>File Type: {this.state.selectedFile.type}</p> 
            <p> 
            Last Modified:{" "} 
            {this.state.selectedFile.lastModifiedDate.toDateString()} 
            </p> 
        </div> 
        ); 
    } else { 
        return ( 
        <div> 
            <br /> 
            <h4>Choose before Pressing the Upload button</h4> 
        </div> 
        ); 
    } 
    }; 
    render() { 
    return ( 
        <div> 
            <div>
                <input name="archivo" type="file" onChange={this.onFileChange} /> 
                <button type="submit" onClick={this.onFileUpload}> 
                Upload! 
                </button>
            </div> 
        {this.fileData()} 
        </div> 
    ); 
    } 
}

export default SubirArchivo;