import React from 'react';

import './Header.css';
import Nav from './Nav/Nav';

class Header extends React.Component {
    render = () => {
        return <div className='header-container'>
            <Nav />
        </div>
    }
}

export default Header;