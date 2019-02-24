import React from 'react';

/** Local CSS */
import './EducationSplash.component.css';
import csulaLogo from '../../img/csula_logo.png';


class EducationSplash extends React.Component {
    render = () => {
        return <div className='education-splash-container'>
            <img src={csulaLogo} width={300} height={234}></img>
            <div className="education-text-container">
                <div className="education-title">
                    California State University - Los Angeles
                </div>
                <div className="education-details">
                    Computer Science, B.S.
                    <div className="course-list-container">
                        Course Taken:
                        <ul className="course-list">
                            <li>
                                Web Development
                            </li>
                            <li>
                                Current Trends in Web Design
                            </li>
                            <li>
                                Android and Cloud Computing
                            </li>
                            <li>
                                Computer Networking Protocol
                            </li>
                        </ul>

                    </div>

                </div>
            </div>
        </div>
    }
}


export default EducationSplash;