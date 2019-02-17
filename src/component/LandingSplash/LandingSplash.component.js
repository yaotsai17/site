import React, { Component } from 'react';

/** Local CSS */
import './LandingSplash.component.css';
import IntroImage from '../../img/bg.png';


class LandingSplash extends Component {
    render() {
        return (
            <div className="landing-splash-container">
                <div className="intro-image">
                    <img src={IntroImage} alt="Yao's name in Chinese"></img>
                </div>
                <div className="intro-text">
                    hi man<br />
                    yes
                </div>
            </div>
        );
    }
}


export default LandingSplash;
