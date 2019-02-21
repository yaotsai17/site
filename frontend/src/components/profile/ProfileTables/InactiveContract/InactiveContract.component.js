/*
Core Libs
*/
import React, { Component } from 'react';
import axios from 'axios';

import './InactiveContract.component.css';

/**
 * InactiveContract Component
 */
class InactiveContract extends Component {

    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            err: null,
            inactiveContract: [],
            order: '?order=name.asc'
        }
        this.loadData();
        this.loadData = this.loadData.bind(this);
    }

    componentWillReceiveProps() {
        this.loadData();
    }

    loadData() {
        const inactiveContractURL = "https://qchain-marketplace-postgrest.herokuapp.com/inactive_contract_view" + this.state.order;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        axios.get(inactiveContractURL, config)
            .then((response) => {
                this.setState({
                    ...this.state,
                    finished: true,
                    inactiveContract: response.data
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
                    (this.state.finished && this.state.err === null && this.state.inactiveContract.length === 0)
                        ? (<p style={{ textAlign: 'center' }}>There is currently no inactive contract...</p>)
                        : null
                }

                {
                    (this.state.finished && this.state.err === null && this.state.inactiveContract.length > 0)
                        ? (<table className='table table-bordered mb-0'>
                            <thead className='thead-default'>
                                <tr>
                                    <th
                                        className='inactive-contract-th'
                                        onClick={() => this.handleThClick('name')}>Contract Title</th>
                                    <th
                                        className='inactive-contract-th'
                                        onClick={() => this.handleThClick('advertiser_name')}>Advertiser</th>
                                    <th
                                        className='inactive-contract-th'
                                        onClick={() => this.handleThClick('publisher_name')}>Publisher</th>
                                    <th
                                        className='inactive-contract-th'
                                        onClick={() => this.handleThClick('start_date')}>Start Date</th>
                                    <th
                                        className='inactive-contract-th'
                                        onClick={() => this.handleThClick('end_date')}>End Date</th>
                                    <th
                                        className='inactive-contract-th'
                                        onClick={() => this.handleThClick('payout_cap')}>Payout Cap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.inactiveContract.map((contract, i) => {
                                        return (<tr key={'contracttr' + i}>
                                            <td>{contract.name}</td>
                                            <td>{contract.advertiser_name}</td>
                                            <td>{contract.publisher_name}</td>
                                            <td>{contract.start_date.slice(0, 10)}</td>
                                            <td>{contract.end_date.slice(0, 10)}</td>
                                            <td>{contract.payout_cap} {contract.currency}</td>
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


export default InactiveContract;