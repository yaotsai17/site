/*
Core Libs
*/
import React, { Component } from 'react';
import axios from 'axios';

import './ActiveRequest.component.css';

/**
 * ActiveRequest Component
 * @param {string} listingType passed by props to decide label  
 */
class ActiveRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            err: null,
            activeListing: [],
            order: '?order=name.asc'
        }
    }

    componentWillMount() {
        this.loadData();
    }

    componentWillUpdate(prevProps){
        if(prevProps.reader !== this.props.reader 
        || prevProps.userId !== this.props.userId){
            this.loadData();
        }
    }

    decideURL = () => {
        if(this.props.reader) {
            return "https://qchain-marketplace-postgrest.herokuapp.com/active_content_request" + this.state.order + `&owner=eq.${this.props.userId}`;
        }
        else {
            return "https://qchain-marketplace-postgrest.herokuapp.com/my_active_content_request" + this.state.order;
        }
    }

    loadData = () => {
        const activeListingURL = this.decideURL();
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        axios.get(activeListingURL, config)
            .then((response) => {
                this.setState({
                    ...this.state,
                    finished: true,
                    activeListing: response.data
                })
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    ...this.state,
                    finished: true,
                    err: err
                })
            })
    }

    handleThClick = (header) => {
        new Promise((resolve) => {
            if (this.state.order.includes(header)) {
                if (this.state.order.includes(".desc")) {
                    resolve(this.setState({ ...this.state, order: `?order=${header}` }))
                } else {
                    resolve(this.setState({ ...this.state, order: `?order=${header}.desc` }))
                }
            } else {
                resolve(this.setState({ ...this.state, order: `?order=${header}` }))
            }
        }).then(() => {
            this.loadData();
        })
    }

    render() {
        return <div className='active-listing-container'>
            <div className='table-responsive' style={{ height: '100%', margin: '2%', minHeight: '320px' }}>

                {
                    (this.state.finished && this.state.err === null && this.state.activeListing.length === 0)
                        ? (<p style={{ textAlign: 'center' }}>There is currently no active request...</p>)
                        : null
                }

                {
                    (this.state.finished && this.state.err === null && this.state.activeListing.length > 0)
                        ? (<table className='table table-bordered mb-0'>
                            <thead className='thead-default'>
                                <tr>
                                    <th
                                        className='active-request-th'
                                        onClick={() => this.handleThClick('name')}>Content Space Title</th>
                                    <th
                                        className='active-request-th'
                                        onClick={() => this.handleThClick('ad_format')}>Ad Format</th>
                                    <th
                                        className='active-request-th'
                                        onClick={() => this.handleThClick('medium')}>Medium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.activeListing.map((listing, i) => {
                                        return (<tr key={'listingtr' + i}>
                                            <td>{listing.name}</td>
                                            <td>{listing.ad_format}</td>
                                            <td>{listing.medium}</td>
                                        </tr>)
                                    })
                                }
                            </tbody>

                        </table>
                        )
                        : null
                }
            </div>
        </div>
    }
}


export default ActiveRequest;