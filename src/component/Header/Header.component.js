import React from 'react';

/** Local CSS */
import './Header.component.css';

/** Other Custom Component */
import Nav from './Nav/Nav.component';


class Header extends React.Component {
    render = () => {
        return <div className='header-container'>
            <Nav />
        </div>
    }
}


export default Header;