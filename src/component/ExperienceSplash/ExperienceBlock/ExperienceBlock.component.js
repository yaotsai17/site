import React, { Component } from 'react';
import Youtube from 'react-youtube';

/** Local CSS */
import './ExperienceBlock.component.css';


class ExpereinceBlock extends Component {

    render() {
        const challengesList = this.props.experienceDetail.challenges.split(". ")
            .map(function (challenge, index) {
                return <li className="challenge-item" key={index}>{challenge}</li>;
            });

        const youtubeOption = {
            width: '272',
            height: '153',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                loop: 1,
                autoplay: 1,
                playlist: this.props.experienceDetail.solutionYoutubeId
            }
        }

        return <div className="experience-block-container">
            <div className="experience-block-header">
                <div className="company-name">{this.props.experienceDetail.companyName}</div>
                <div className="company-description">{this.props.experienceDetail.companyDescription}</div>
            </div>

            <div className="experience-details-container">
                <div className="problem-container">
                    <h3 className="problem-label">Problem / Challenges</h3>
                    <ul>
                        {challengesList}
                    </ul>
                </div>
                <div className="solution-container">
                    <h3 className="solution-label">Solution Demo</h3>
                    <div className="youtube-player-container">
                    {
                        <Youtube opts={youtubeOption} />
                    }
                    </div>
                </div>
            </div>

        </div>
    }

}

export default ExpereinceBlock;