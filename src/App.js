import React, { Component } from 'react';

/** Local CSS */
import './App.css';

/** Other Custom Component */
import LandingSplash from './component/LandingSplash/LandingSplash.component';
import Header from './component/Header/Header.component';


class App extends Component {
    render() {
        return (
            <div className="app-root-container">
                <Header />
                <LandingSplash />
            </div>
        );
    }
}


export default App;
