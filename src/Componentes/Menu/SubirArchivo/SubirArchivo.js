import React, { Component, useState } from 'react';
import axios from 'axios';
import "./SubirArchivo.css";
 
class SubirArchivo extends Component{
    state = {
        selectedFile: null
    }; 
    onFileChange = event => { 
        this.setState({ selectedFile: event.target.files[0] }); 
    }; 
    onFileUpload = () => { 
        const formData = new FormData(); 
        formData.append("file",
            this.state.selectedFile, 
            this.state.selectedFile.name 
        ); 
        console.log(this.state.selectedFile);
        fetch("http://localhost:8000/upload",{
            method: 'POST',
			body: formData
        }).then(response => {
			this.setState({msg: "File successfully uploaded"});
		}).catch(err => {
			this.setState({error: err});
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
                <button onClick={this.onFileUpload}> 
                Upload! 
                </button> 
            </div> 
        {this.fileData()} 
        </div> 
    ); 
    } 
}

export default SubirArchivo;