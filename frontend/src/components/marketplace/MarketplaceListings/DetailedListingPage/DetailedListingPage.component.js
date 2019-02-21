/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/*
Networking 
*/
import axios from 'axios';

/*
Local CSS
*/
import './DetailedListingPage.component.css';

/*
Placeholder Images
*/
import branded_content_ph from '../../../../assets/images/branded_content_placeholder.png';
import influencer_marketing_ph from '../../../../assets/images/influencer_marketing_placeholder.png';
import sponsorships_ph from '../../../../assets/images/sponsorships_placeholder.png';
import default_ph from '../../../../assets/images/pug_face.jpg';

import { Card, CardText, CardTitle } from 'material-ui';
import Divider from 'material-ui/Divider';
import Button from '@material-ui/core/Button';

import DetailedImageSlider from './DetailedImageSlider/DetailedImageSlider.component';

import { Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import MakeOfferSection from './MakeOfferSection/MakeOfferSection.component';


class DetailedListingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            error: null,
            listing: null,
            width: window.innerWidth,
            bought: false,
            processing: false,
            emptyResponse: false,
            offerAmount: -1,
            actionInfo: '',
        }

        // Binding functions
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.decideImage = this.decideImage.bind(this);
        this.inactivateListing = this.inactivateListing.bind(this);
        this.handleBuyItNow = this.handleBuyItNow.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        this.createContractAfterBalanceCheck = this.createContractAfterBalanceCheck.bind(this);
        this.getContract = this.getContract.bind(this);
        this.createInvoiceAfterContract = this.createInvoiceAfterContract.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        this.loadDetail();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ ...this.state, width: window.innerWidth });
    }

    decideImage(url, marketingType) {
        if (marketingType === 'Branded Content') {
            return branded_content_ph;
        } else if (marketingType === 'Influencer Post') {
            return influencer_marketing_ph;
        } else if (marketingType === 'Sponsorship') {
            return sponsorships_ph;
        } else {
            return default_ph;
        }
    }

    loadDetail() {
        // call on start load to get data
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/detailed_listing_view?id=eq.${this.props.match.params.id}`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        axios.get(listingURL, config)
            .then((response) => {
                if (response.data.length < 1) {
                    this.setState({
                        ...this.state,
                        emptyResponse: true,
                        fetched: true
                    })
                } else {
                    document.title = `${response.data[0].name} - Qchain`;
                    this.setState({
                        ...this.state,
                        fetched: true,
                        listing: response.data[0]
                    })
                }
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    fetched: true,
                    error: err
                })
            })
    }

    getPayoutCap = () => {
        let startDate = new Date(this.state.listing.date_added);
        let endDate = new Date(this.state.listing.expiration_date);
        return { amount: this.state.listing.price * dateDiffInDays(startDate, endDate), days: dateDiffInDays(startDate, endDate) };
    }

    handleBuyItNow() {
        // check balance
        this.setState({
            ...this.state,
            processing: true,
        })
        const walletURL = `https://qchain-marketplace-postgrest.herokuapp.com/wallet_view`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };

        axios.get(walletURL, config)
            .then((response) => {
                //success, response.data[0]
                let startDate = new Date(this.state.listing.date_added);
                let endDate = new Date(this.state.listing.expiration_date);
                if (this.state.listing.currency === 'EQC') {
                    if (response.data[0].eqc_balance >= this.state.listing.price * dateDiffInDays(startDate, endDate)) {
                        this.createContractAfterBalanceCheck(response.data[0].eqc_balance)
                    } else {
                        this.setState({
                            ...this.state,
                            processing: false,
                            actionInfo: 'Insufficient EQC on your account'
                        })
                    }
                } else {
                    if (response.data[0].xqc_balance >= this.state.listing.price * dateDiffInDays(startDate, endDate)) {
                        this.createContractAfterBalanceCheck(response.data[0].xqc_balance)
                    } else {
                        this.setState({
                            ...this.state,
                            processing: false,
                            actionInfo: 'Insufficient XQC on your account'
                        })
                    }
                }
            })
            .catch((err) => {
                console.log("BUY IT NOW ERR");
                console.log(err);
            })
    }

    createContractAfterBalanceCheck(balance) {
        const contractURL = `https://qchain-marketplace-postgrest.herokuapp.com/contract`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        let startDate = new Date(this.state.listing.date_added);
        let endDate = new Date(this.state.listing.expiration_date);

        const payload = {
            name: this.state.listing.name,
            advertiser: localStorage.getItem('role'),
            publisher: this.state.listing.owner,
            start_date: this.state.listing.date_added,
            end_date: this.state.listing.expiration_date,
            currency: this.state.listing.currency,
            payout_cap: this.state.listing.price * dateDiffInDays(startDate, endDate),
            contentspacelisting: this.state.listing.id,
            contentlisting: null
        }
        axios.post(contractURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
                this.setState({
                    ...this.state,
                    bought: true
                })
                this.inactivateListing();
                this.makePayment(balance, payload.payout_cap);
                this.getContract();
            })
            .catch((err) => {
                console.log("BUY IT NOW ERR");
                console.log(err);
            })
    }

    getContract() {
        const contractURL = `https://qchain-marketplace-postgrest.herokuapp.com/contract?contentspacelisting=eq.${this.state.listing.id}`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        axios.get(contractURL, config)
            .then((response) => {
                //success, proceed to create contract
                this.createInvoiceAfterContract(response.data[0])
            })
            .catch((err) => {
                console.log("GET CONTRACT ERR");
                console.log(err);
            })
    }

    createInvoiceAfterContract(contract) {
        const invoiceURL = `https://qchain-marketplace-postgrest.herokuapp.com/invoice`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        const payload = {
            contract: contract.number,
            currency: contract.currency,
            amount: Number.parseFloat(contract.payout_cap),
            due_date: contract.end_date,
            tx_hash: 'somehash'
        }
        axios.post(invoiceURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
                console.log("created invoice")
            })
            .catch((err) => {
                console.log("CREATE INVOICE ERR");
                console.log(payload);
                console.log(err);
            })
    }

    inactivateListing() {
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/listing?id=eq.${this.state.listing.id}`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        const payload = {
            isactive: false
        }
        axios.patch(listingURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
            })
            .catch((err) => {
                console.log("INACTIVATE ERR");
                console.log(err);
            })
    }

    makePayment(existingBalance, payoutCap) {
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/wallet_view`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        const payload = (this.state.listing.currency === 'EQC')
            ? { eqc_balance: (existingBalance - payoutCap) }
            : { xqc_balance: (existingBalance - payoutCap) }
        axios.patch(listingURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
            })
            .catch((err) => {
                console.log("MAKE PAYMENT ERR");
                console.log(err);
            })
    }

    handlePathToOwnerProfile = () => {
        this.props.history.push('/q/' + this.state.listing.owner)
    }

    render() {
        // console.log(this.props.match.params.id)
        // make a request to get detailed listing info using ID
        // parse info onto the page
        if (this.state.fetched && !this.state.emptyResponse) {
            if (this.state.listing.classtype === "request") {
                return <div className='detailed-listing-container'>
                    <DetailedRequestListing
                        listing={this.state.listing}
                        decideImage={this.decideImage}
                        pathToOwnerProfile={this.handlePathToOwnerProfile}
                    />
                </div>
            } else {
                return <div className='detailed-listing-container'>
                    <DetailedContentSpaceListing
                        listing={this.state.listing}
                        decideImage={this.decideImage}
                        onBuy={this.handleBuyItNow}
                        bought={this.state.bought}
                        processing={this.state.processing}
                        issue={this.state.actionInfo}
                        getPayoutCap={this.getPayoutCap}
                        emailVerified={this.props.email_verified}
                        pathToOwnerProfile={this.handlePathToOwnerProfile}
                    />
                </div>
            }
        } else if (this.state.fetched && this.state.emptyResponse) {
            return <Redirect to='/marketplace' />
        } else {
            return <div></div>
        }
    }
}

const DetailedRequestListing = ({ listing, decideImage, pathToOwnerProfile }) => (
    <div className='detailed-listing-renderer'>
        <div className='detailed-image-container'>
            <Card>
                <CardText>
                    <DetailedImageSlider imageSrc={decideImage(listing.images, listing.ad_format)} />
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Save this listing</a>
                <Divider />
                <a className='detailed-listing-action'>Add to watch list</a>
                <Divider />
                <a className='detailed-listing-action'>Some other simple actions</a>
                <Divider />
            </div>
        </div>

        <Card className='listing-concrete-details-container'>
            <CardTitle>
                <h1 className='listing-title'>{listing.name}</h1>
            </CardTitle>
            <Divider />
            <CardText className='listing-details-text'>
                <div className='details-text'>
                    <p>
                        Ad Format: {listing.ad_format} {listing.classtype}
                    </p>
                    <p>
                        Marketing Medium: {listing.medium}
                    </p>

                </div>
                <br />
                <MakeOfferSection listing={listing} />
                <br />
                <div className='details-text'>{listing.description}</div>
            </CardText>
        </Card>

        <div className='poster-info-container'>
            <Card>
                <CardTitle>
                    <h3>Requestor Info:</h3>
                    <span style={{fontWeight: 300}}><span className='owner-profile-link'onClick={() => pathToOwnerProfile()}>{listing.owner_name}</span> trading in {listing.currency}</span>
                </CardTitle>
                <CardText>
                    <div>Ask Date: {listing.date_added.slice(0, 10)}</div>
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Add requestor to favorite</a>
                <Divider />
                <a className='detailed-listing-action'>Contact this requestor</a>
                <Divider />
            </div>
        </div>
    </div>
)

const DetailedContentSpaceListing = ({ listing, decideImage, onBuy, bought, processing, issue, getPayoutCap, emailVerified, pathToOwnerProfile }) => (
    <div className='detailed-listing-renderer'>
        <div className='detailed-image-container'>
            <Card>
                <CardText>
                    <DetailedImageSlider imageSrc={decideImage(listing.images, listing.ad_format)} />

                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Save this listing</a>
                <Divider />
                <a className='detailed-listing-action'>Add to watch list</a>
                <Divider />
                <a className='detailed-listing-action'>Some other simple actions</a>
                <Divider />
            </div>
        </div>

        <Card className='listing-concrete-details-container'>
            <CardTitle>
                <h1 className='listing-title'>{listing.name}</h1>
            </CardTitle>
            <Divider />
            <CardText className='listing-details-text'>
                <div className='details-text'>
                    <p>
                        Ad Format: {listing.ad_format} {listing.classtype}
                    </p>
                    <p>
                        Marketing Medium: {listing.medium}
                    </p>

                </div>

                <br />

                {
                    (bought)
                        ? <Alert bsStyle='success'>Congratulations! You've bought this listing!</Alert>
                        : <div className='buy-section'>
                            <div className='price-section'>
                                <span>Price: {listing.price} {listing.currency} per day</span>
                                <br />
                                <span><strong>Total</strong>: {getPayoutCap().amount} {listing.currency} in {getPayoutCap().days} day(s)</span>
                            </div>
                            <div className='buy-btn-section'>
                                <Button className='buy-button'
                                    onClick={() => onBuy()}
                                    variant='outlined'
                                    color='primary'
                                    disabled={processing || issue.length > 0 || emailVerified === false}
                                >
                                    {
                                        (issue.length > 0)
                                            ? issue
                                            : 'Buy It Now!'
                                    }
                                </Button>
                            </div>
                        </div>
                }

                <br />
                <div className='details-text'>{listing.description}</div>
            </CardText>
        </Card>

        <div className='poster-info-container'>
            <Card>
                <CardTitle>
                    <h3>Creator Info:</h3>
                    <h4 style={{fontWeight: 300}}><span className='owner-profile-link' onClick={() => pathToOwnerProfile()}>{listing.owner_name}</span> trading in {listing.currency}</h4>
                </CardTitle>
                <CardText>

                    <div>Promotion Duration: <br /> {listing.date_added.slice(0, 10)} to {listing.expiration_date}</div>
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Add publisher to favorite</a>
                <Divider />
                <a className='detailed-listing-action'>Contact this publisher</a>
                <Divider />
            </div>
        </div>
    </div>
)

const mapStateToProps = (state) => {
    return {
        email_verified: state.ProfileReducer.profile.email_verified
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return (Math.ceil((utc2 - utc1) / _MS_PER_DAY) + 1 === 0 ? 1 : Math.ceil((utc2 - utc1) / _MS_PER_DAY));
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailedListingPage));