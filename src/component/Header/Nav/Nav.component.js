import React from 'react';
import { Link } from 'react-scroll'
 

/** Local CSS */
import './Nav.component.css';


class Nav extends React.Component {

    render = () => {
        return <div className='nav-container'>
            <div className='nav-flex-container'>
                <div className='nav-item'><Link to="intro" spy={true} smooth={true} offset={-64} duration={500}>Intro</Link></div>
                <div className='nav-item'><Link to="exp" spy={true} smooth={true} offset={-64} duration={500}>Experience</Link></div>
                <div className='nav-item'><Link to="edu" spy={true} smooth={true} offset={-64} duration={500}>Education</Link></div>
                <div className='nav-item'><Link to="contact" spy={true} smooth={true} offset={-64} duration={500}>Contact</Link></div>
            </div>
        </div>
    }
}


export default Nav;