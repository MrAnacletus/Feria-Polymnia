import './App.css';
import React, { Component } from 'react';
import Menu from './Componentes/Menu/Menu';
import Navbar from "./Componentes/Navbar/Navbar";
import PantallaDeCarga from './Componentes/PantallaDeCarga/PantallaDeCarga';
import ExportarPartitura from './Componentes/ExportarPartitura/ExportarPartitura';
import EleccionInicial from './Componentes/Elecciones/EleccionInicial';
import EleccionInstrumentos from './Componentes/Elecciones/EleccionInstrumentos';
import logoFooter from "./logos/finalv1.svg"
import logoFB from "./logos/fb.png"
import logoIG from "./logos/ig.png"
import logoTWT from "./logos/twt.png"
import instrumentos from './Componentes/Elecciones/instrumentos';
// import logoYT from "./logos/youtube.svg"


var fileName;
var boolean = true;
var respuestaInstrumentos;
var instrumentoSeleccionado;
var tipoDocumento= "partitura";

class App extends Component{
	constructor(){
		super();
		this.RenderPage = this.RenderPage.bind(this);
		this.changePage = this.changePage.bind(this);
		this.seleccionarInstrumento = this.seleccionarInstrumento.bind(this);
	}
	RenderPage(){
		let render;
		render = <EleccionInstrumentos sendData={this.changePage} instrumentos={respuestaInstrumentos} boolean={boolean} seleccionarInstrumento={this.seleccionarInstrumento}></EleccionInstrumentos>;
		if (this.state){
			if (this.state.toRender === "Menu"){
				render = <Menu sendData={this.changePage}></Menu>;
			}
			if (this.state.toRender === "PantallaDeCarga"){
				render = <PantallaDeCarga sendData={this.changePage} boolean ={boolean}></PantallaDeCarga>;
			}
			if (this.state.toRender === "ExportarPartitura"){
				render = <ExportarPartitura sendData={this.changePage} nombreArchivo={fileName} instrumento = {instrumentoSeleccionado} tipoDocumento={tipoDocumento}></ExportarPartitura>;
			}
			if (this.state.toRender === "EleccionInicial"){
				render = <EleccionInicial sendData={this.changePage} boolean = {boolean} seleccionarInstrumento={this.seleccionarInstrumento}></EleccionInicial>;
			}
			if (this.state.toRender === "EleccionInstrumentos"){
				render = <EleccionInstrumentos sendData={this.changePage} instrumentos={respuestaInstrumentos} boolean={boolean} seleccionarInstrumento={this.seleccionarInstrumento}></EleccionInstrumentos>;
			}
		}
		return render;
	}
	changePage(val,val2){
		console.log(val,val2);
		this.setState({toRender: val})
		if (val === "ExportarPartitura"){
			fileName = val2;
			console.log(fileName + " recibí este nombre de archivo");
		}else if (val === "PantallaDeCarga" || val === "EleccionInicial"){
			boolean = val2;
		}else if (val === "EleccionInstrumentos"){
			if (Array.isArray(val2)){
				// mapear los nombres a sus objetos en instrumentos.js
				respuestaInstrumentos = [];
				val2.map((instrumentoRec)=>{
					instrumentos.map((instrumentosObj)=>{
						if (instrumentoRec === instrumentosObj.nombre){
							respuestaInstrumentos.push(instrumentosObj);
						}
					})
				})
			}
			boolean = val2;
		}
	}

	seleccionarInstrumento(instrumento,tipo){
		instrumentoSeleccionado = instrumento;
		console.log(instrumento + " ha sido seleccionado");
		if (tipo === "si"){
			tipoDocumento = "partitura";
		}
		else{
			tipoDocumento = "tablatura";
		}

	}

	render(){
		return(
			<body className="App">
				<Navbar sendData={this.changePage}/>
				<div className="RenderContainer">
					<div className="colorBg">
						{this.RenderPage()}
					</div>	
				</div>
				<footer className="footer container-fluid position-relative bg-dark bg-light-radial text-white-50 py-6 px-5 h-100 Footer ">
					<div className="row d-flex flex-space-between">
						<div className="col-sm flex-start">
							<img className="logoFooter" src={logoFooter} alt="logoFooter"></img>
						</div>
						<div className="col-sm flex-end p-4">
							<a href="https://www.facebook.com/Polymnia-103142859200736" target="_blank" rel="noopener noreferrer" ><img className="fb" src={logoFB} alt="logoFacebook"></img></a>
							<a href="https://www.instagram.com/polymnia_fsw/" target="_blank" rel="noopener noreferrer"><img className="ig" src={logoIG} alt="logoInstagram"></img></a>
							<a href="https://twitter.com/Partitas_fdsw" target="_blank" rel="noopener noreferrer"><img className="twt" src={logoTWT} alt="logoTwitter"></img></a>
							{/* <a href="https://www.youtube.com/channel/UChzWYYawHWMG3Q11WhYcAqA" target="_blank" rel="noopener noreferrer"><img className="yt" src={logoYT}></img></a> */}
						</div>
					</div>
					
					
				</footer>
			</body>
		)
	}
}
export default App;
