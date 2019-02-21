/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

/*
Local CSS
*/
import './Profile.component.css';

/*
React Bootstrap
*/
import { Media } from 'react-bootstrap';

/*
Children Component
*/
import ProfileTables from './ProfileTables/ProfileTables.component';
import ProfileEditor from './ProfileEditor/ProfileEditor.component';
import Footer from '../footer/Footer.component';

/*
Networking
*/
import axios from 'axios';


/**
 * Profile Component
 *      represents user and display related activities.
 */
class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reader: true,
            fetching: false,
            fetched: false,
            error: null,
            hasError: false,
            profile: {
                name: 'name',
                email: 'email@domain.co',
                picture: ''
            }
        }
    }

    componentWillMount() {
        if (typeof this.props.match.params.userId === 'undefined') {
            this.setState({
                ...this.state,
                reader: false
            })
        }else {
            this.loadProfileData();
        }
    }

    loadProfileData = () => {
        this.setState({ ...this.state, fetching: true, hasError: false });

        const accountURL = "https://qchain-marketplace-postgrest.herokuapp.com/account?select=email,name,picture&role=eq." + this.props.match.params.userId;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        axios.get(accountURL, config)
            .then((response) => {
                this.setState({
                    ...this.state,
                    fetching: false,
                    fetched: true,
                    profile: response.data[0]
                })
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    ...this.state,
                    fetching: false,
                    fetched: true,
                    error: error,
                    hasError: true
                })
            })
    }

    componentDidMount() {
        document.title = "Qchain - Profile";
        window.scrollTo(0, 0);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            this.updateIsReader();
        }
    }

    updateIsReader = () => {
        if (typeof this.props.match.params.userId === 'undefined') {
            this.setState({
                ...this.state,
                reader: false
            })
        } else {
            this.setState({ ...this.state, reader: true })
        }
    }

    getAvatarSrc = () => {
        return this.state.reader
            ? this.state.profile.picture
            : this.props.profile.avatar_url
    }

    getNickname = () => {
        return this.state.reader
            ? this.state.profile.name
            : this.props.profile.nickname
    }

    getEmail = () => {
        return this.state.reader
            ? this.state.profile.email
            : this.props.profile.email
    }

    getVerified = () => {
        return this.state.reader
            ? false
            : true
    }


    render() {
        return <div className='profile-container'>

            <div className='profile-header'>
                <Media style={mediaStyle}>
                    <Media.Left align='middle'>
                        <img src={this.getAvatarSrc()} style={{ marginRight: '3vw' }} width='120' height='120' alt='user-avatar' />
                    </Media.Left>
                    <Media.Body>
                        <Media.Heading style={mediaHeadingStyle}>
                            <p style={{ float: 'left' }}>{this.getNickname()}</p>
                            {
                                (this.state.reader)
                                    ? <br />
                                    : <ProfileEditor auth={this.props.auth} />
                            }

                        </Media.Heading>
                        Personal Contact:<br /> {this.getEmail()}
                    </Media.Body>
                </Media>
            </div>

            <ProfileTables reader={this.state.reader} userId={this.props.match.params.userId} />
            <Footer />

        </div>
    }
}

const mediaStyle = {
    marginTop: '235px',
    marginLeft: '8vw',
}

const mediaHeadingStyle = {
    marginBottom: '15px',
    fontSize: '2em',
    marginTop: '25px',
}

const mapStateToProps = (state) => {
    return {
        profile: state.ProfileReducer.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile) 
