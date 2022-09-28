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
// import logoYT from "./logos/youtube.svg"


var fileName;
var boolean;
var respuestaInstrumentos;

class App extends Component{
	constructor(){
		super();
		this.RenderPage = this.RenderPage.bind(this);
		this.changePage = this.changePage.bind(this);
	
	}
	RenderPage(){
		let render;
		render = <Menu sendData={this.changePage}></Menu>;
		if (this.state){
			if (this.state.toRender === "Menu"){
				render = <Menu sendData={this.changePage}></Menu>;
			}
			if (this.state.toRender === "PantallaDeCarga"){
				render = <PantallaDeCarga sendData={this.changePage} boolean ={boolean}></PantallaDeCarga>;
			}
			if (this.state.toRender === "ExportarPartitura"){
				render = <ExportarPartitura sendData={this.changePage} nombreArchivo={fileName}></ExportarPartitura>;
			}
			if (this.state.toRender === "EleccionInicial"){
				render = <EleccionInicial sendData={this.changePage} boolean = {boolean}></EleccionInicial>;
			}
			if (this.state.toRender === "EleccionInstrumentos"){
				render = <EleccionInstrumentos sendData={this.changePage} instrumentos={respuestaInstrumentos} boolean={boolean}></EleccionInstrumentos>;
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
			respuestaInstrumentos = val2;
			boolean = val2;
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
				<footer className="Footer">
					<img className="logoFooter" src={logoFooter}></img>
					<div className="Redes">
						<a href="https://www.facebook.com/Polymnia-103142859200736" target="_blank" rel="noopener noreferrer" ><img className="fb" src={logoFB}></img></a>
						<a href="https://www.instagram.com/polymnia_fsw/" target="_blank" rel="noopener noreferrer"><img className="ig" src={logoIG}></img></a>
						<a href="https://twitter.com/Partitas_fdsw" target="_blank" rel="noopener noreferrer"><img className="twt" src={logoTWT}></img></a>
						{/* <a href="https://www.youtube.com/channel/UChzWYYawHWMG3Q11WhYcAqA" target="_blank" rel="noopener noreferrer"><img className="yt" src={logoYT}></img></a> */}
					</div>
				</footer>
			</body>
		)
	}
}
export default App;
