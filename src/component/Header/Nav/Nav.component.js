import React from 'react';

/** Local CSS */
import './Nav.component.css';


class Nav extends React.Component {
    render = () => {
        return <div className='nav-container'>
            <div className='nav-flex-container'>
                <div className='nav-item'>Home</div>
                <div className='nav-item'>Education</div>
                <div className='nav-item'>Experience</div>
                <div className='nav-item'>Passion</div>
                <div className='nav-item'>Contact</div>
            </div>
        </div>
    }
}


export default Nav;