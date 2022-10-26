import React, { Component } from "react";
import {MenuItems} from "./MenuItems";
import './Navbar.css'

class Navbar extends Component {
    constructor(){
        super();
        this.state = {
            clicked: false
        }
        this.changePage = this.changePage.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
        
    }
    
    changePage(value, index){
        this.pageIndex = index;
        this.props.sendData(value)
    }

    handleClick(){
        this.setState({ clicked: !this.state.clicked})
    }

    render(){
        return(
            <div className="container-fluid sticky-top bg-dark bg-light-radial shadow-sm px-5 pe-lg-0">  
                <nav className="navbar navbar-expand-lg bg-dark bg-light-radial navbar-dark py-3 py-lg-0">
                    <a href="index.html" className="navbar-brand flex flex-row">
                        <h1 className="m-0 text-uppercase text-white"><i class="gg-home-alt"></i>Partitas</h1>
                    </a>
                    <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-expanded="false">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarCollapse">
                        <div class="navbar-nav ms-auto py-0">
                            <a href="index.html" class="nav-item nav-link active">Subir archivo</a>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;



                