import React, { Component } from 'react';

/** Local CSS */
import './ExperienceSplash.component.css';

/** Children Component */
import ExperienceBlock from './ExperienceBlock/ExperienceBlock.component';

class ExpereinceSplash extends Component {
    render() {
        return <div className="experience-splash-container">
            <ExperienceBlock experienceDetail={qchainExperience}/>
            <ExperienceBlock experienceDetail={calampExperience}/>
            <ExperienceBlock experienceDetail={tbExperience}/>
        </div>
    }
}

const qchainExperience = {
    companyName: "Qchain - Front End Engineer",
    companyDescription: "Blockchain startup to build a marketplace platform for advertisers and contentspace providers",
    challenges: "Building MVP for company with limited amout of resources and time. Developed back end PostgreSQL database with security policies and custom views. Utilized third-party API and application such as Auth0, AWS, Heroku. Designed layout with minimalistic concepts",
    solutionYoutubeId: 'xj_UAhxYk1M'
}

const calampExperience = {
    companyName: "CalAmp - Software Engineer Intern",
    companyDescription: "Telematics corporation focuses on automotive technology and Internet of Things",
    challenges: "Field engineers needed to go through mannual requests to get device ID from ESN. Automated SMS sending process for field engineers. Support batch commands to targeted ESN's. Created Express application to navigate through several RESTful API",
    solutionYoutubeId: '2RrFURz3EP8' 
}

const tbExperience = {
    companyName: "Taibei Bistro - (Volunteering Software Developer)",
    companyDescription: "Small scale, local, and traditional restaurant",
    challenges: "Business owner used to calculate employee timesheet by hand. Created a calculator app that is exremely similar to timesheet visually. Ensure accuracy, prevent mistakes, and increase efficiency when calculating hours",
    solutionYoutubeId: 'yZngUzii1NI'
}

export default ExpereinceSplash;