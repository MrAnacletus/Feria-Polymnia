import './App.css';
import React, { Component } from 'react';
import Menu from './Componentes/Menu/Menu';
import Navbar from "./Componentes/Navbar/Navbar";
import PantallaDeCarga from './Componentes/PantallaDeCarga/PantallaDeCarga';
import ExportarPartitura from './Componentes/ExportarPartitura/ExportarPartitura';
import EleccionInicial from './Componentes/Elecciones/EleccionInicial';
import EleccionInstrumentos from './Componentes/Elecciones/EleccionInstrumentos';
import EleccionMelodia from './Componentes/Elecciones/EleccionMelodia';
import logoFooter from "./logos/partitas.png"
import logoFB from "./logos/fb.png"
import logoIG from "./logos/ig.png"
import logoTWT from "./logos/twt.png"

var fileName;
var boolean;
class App extends Component{
	constructor(){
		super();
		this.RenderPage = this.RenderPage.bind(this);
		this.changePage = this.changePage.bind(this);
	
	}
	RenderPage(){
		let render;
		render = <EleccionInicial sendData={this.changePage}></EleccionInicial>;
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
				render = <EleccionInicial sendData={this.changePage}></EleccionInicial>;
			}
			if (this.state.toRender === "EleccionInstrumentos"){
				render = <EleccionInstrumentos sendData={this.changePage}></EleccionInstrumentos>;
			}
			if (this.state.toRender === "EleccionMelodia"){
				render = <EleccionMelodia sendData={this.changePage}></EleccionMelodia>;
			}
		}
		return render;
	}
	changePage(val,val2){
		console.log(val,val2);
		this.setState({toRender: val})
		if (val === "ExportarPartitura"){
			fileName = val2;
		}else if (val === "PantallaDeCarga"){
			boolean = val2
		}
		
	}

	render(){
		return(
			<div className="App">
				<Navbar sendData={this.changePage}/>
				<div className="RenderContainer">
					<div className="colorBg">
						{this.RenderPage()}
					</div>	
				</div>
				<div className="Footer">
					<img className="logoFooter" src={logoFooter}></img>
					<div className="Redes">
						<img className="fb" src={logoFB}></img>
						<img className="twt" src={logoTWT}></img>
						<img className="ig" src={logoIG}></img>
					</div>
				</div>
			</div>
		)
	}
}
export default App;
