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
            <nav className="NavbarItems">  
                <ul className='nav-menuSPA'>
                    <li>
                        <a className="SPA" ref='#' onClick={() => this.changePage("Menu", 0)}>
                            Partitas
                        </a>
                    </li>
                </ul>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        if(this.pageIndex ===  index){
                            return (
                                <li className={item.clicado} key={index}>
                                    <a className={item.cName} href="#" onClick={() => this.changePage(item.url,index)}>
                                        {item.title}
                                    </a>
                                </li>
                            )
                        } else {
                            return (
                                <li className="navLi" key={index}>
                                    <a className={item.cName} href="#" onClick={() => this.changePage(item.url,index)}>
                                        {item.title}
                                    </a>
                                </li>
                            )
                        }
                    }
                    )}
                </ul>
            </nav>
        )
    }
}

export default Navbar;