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
                    <h1 className="intro-text-title">Yao</h1><h4 className="intro-text-subtitle"> /you/ <i>noun</i></h4>
                    <ol className="intro-text-content">
                        <li>bright, sunny, shines.</li> 
                        <li>intelligent and quick-witted.</li>
                        <li>rhymes with KAPOW, WOW, meow.</li>  
                        <li>given name from my considering parents. </li> 
                    </ol><br />
                </div>
            </div>
        );
    }
}


export default LandingSplash;
