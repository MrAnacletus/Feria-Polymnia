import './App.css';
import React, { Component } from 'react';
import Menu from './Componentes/Menu/Menu';
import Navbar from "./Componentes/Navbar/Navbar";
import logoFooter from "./logos/logos.png"
import logoFB from "./logos/fb.png"
import logoIG from "./logos/ig.png"
import logoTWT from "./logos/twt.png"

class App extends Component{
	constructor(){
		super();
		this.RenderPage = this.RenderPage.bind(this);
		this.changePage = this.changePage.bind(this);
	
	}
	RenderPage(){
		let render;
		render = <Menu></Menu>;
		if (this.state){
			if (this.state.toRender === "Menu"){
				render = <Menu></Menu>;
			}
		}
		return render;
	}
	changePage(val){
		console.log(val);
		this.setState({toRender: val})
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
