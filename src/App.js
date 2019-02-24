import React, { Component } from 'react';
import { Element } from 'react-scroll';

/** Local CSS */
import './App.css';

/** Other Custom Component */
import LandingSplash from './component/LandingSplash/LandingSplash.component';
import Header from './component/Header/Header.component';
import ExperienceSplash from './component/ExperienceSplash/ExperienceSplash.component';
import EducationSplash from './component/EducationSplash/EducationSplash.component';


class App extends Component {
    render() {
        return (
            <div className="app-root-container">
                <Header />
                <Element name="intro">
                    <LandingSplash />
                </Element>
                <Element name="exp">
                    <ExperienceSplash />
                </Element>
                <Element name="edu">
                    <EducationSplash />
                </Element>
                <Element name="contact">
                    <div className="mail-form-container">
                        
                    </div>
                </Element>
            </div>
        );
    }
}


export default App;
