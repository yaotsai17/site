/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

/*
Networking
*/
import axios from 'axios';

/*
Local CSS
*/
import './Marketplace.component.css';

/*
Children Components
*/
import MarketplaceFilter from './MarketplaceFilter/MarketplaceFilter.component';
import MarketplaceListings from './MarketplaceListings/MarketplaceListings.component';

/*
Actions
*/
import {
    fetch_MarketplaceData_Fulfilled,
    fetch_MarketplaceData_Pending,
    fetch_MarketplaceData_Rejected
} from '../../actions/DatabaseRequestActions';


/**
 * Marketplace Component
 *      displays accurate listings base on filters
 *      filters set in MarketplaceFilter is sent to Redux state.
 *          Future Task: * Dynamic loading the listing (automate pagination)
 */
const pageSize = 5;

class Marketplace extends Component {
    constructor(props) {
        super(props);
        const onStartURL = "https://qchain-marketplace-postgrest.herokuapp.com/detailed_listing_view?" + this.getModeCurrencyURLQuery();
        const config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('id_token'),
                Prefer: "count=exact",
                Range: `${pageSize * (this.props.pageNumber - 1)}-${pageSize * this.props.pageNumber - 1}`
            }
        };
        props.loadData(onStartURL, config);
    }

    componentDidMount() {
        document.title = "Qchain - Marketplace";
    }

    getModeCurrencyURLQuery = () => {
        let modeQuery = '';
        let currencyQuery = '';
        if (this.props.modeFilter === 'Advertiser') {
            modeQuery = `classtype=eq.listing`
        } else {
            modeQuery = `classtype=eq.request`
        }

        if (this.props.currencyFilter === 'EQC') {
            currencyQuery = '&currency=eq.EQC'
        } else {
            currencyQuery = '&currency=eq.XQC'
        }

        return modeQuery + currencyQuery + this.getPurchaseRangeQuery() + this.getSortingQuery();
    }

    getPurchaseRangeQuery = () => {
        if (this.props.modeFilter === 'Advertiser') {
            return `&price=lte.${this.props.budgetFilter * 1000}`
        } else {
            return '';
        }

    }

    getSortingQuery = () => {
        if (this.props.sortingType === 'Date Added') {
            return '&order=id.desc'
        } else if (this.props.sortingType === 'Price (Low - High)') {
            return '&order=price'
        } else if (this.props.sortingType === 'Price (High - Low)') {
            return '&order=price.desc'
        }
    }

    getAdFormatMediumQuery = () => {
        if (this.props.adFormatFilter === 'Show All') {
            return ''
        }
        else if (this.props.mediumFilter === '') {
            return `&ad_format=eq.${encodeURIComponent(this.props.adFormatFilter)}`
        } else {
            return `&ad_format=eq.${encodeURIComponent(this.props.adFormatFilter)}&medium=eq.${encodeURIComponent(this.props.mediumFilter)}`
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.modeFilter !== this.props.modeFilter
            || prevProps.currencyFilter !== this.props.currencyFilter
            || prevProps.keyword !== this.props.keyword
            || prevProps.pageNumber !== this.props.pageNumber
            || prevProps.sortingType !== this.props.sortingType
            || prevProps.adFormatFilter !== this.props.adFormatFilter
            || prevProps.mediumFilter !== this.props.mediumFilter
            || prevProps.budgetFilter !== this.props.budgetFilter) {
            const searchedURL = "https://qchain-marketplace-postgrest.herokuapp.com/detailed_listing_view?or=("
                + "name.ilike.*" + this.props.keyword + "*,"
                + "owner_name.ilike.*" + this.props.keyword + "*,"
                + "description.ilike.*" + this.props.keyword + "*)"
                + "&" + this.getModeCurrencyURLQuery()
                + this.getAdFormatMediumQuery()
                + this.getSortingQuery()
            const config = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('id_token'),
                    Prefer: "count=exact",
                    Range: `${pageSize * (this.props.pageNumber - 1)}-${pageSize * this.props.pageNumber - 1}`
                }
            };
            this.props.loadData(searchedURL, config);
        }
    }

    render() {
        return <div>
            <div className='marketplace-container'>
                <MarketplaceFilter />
                <MarketplaceListings />
            </div>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {
        modeFilter: state.MenuBarFilterReducer.modeFilter,
        currencyFilter: state.MenuBarFilterReducer.currencyFilter,
        fetched: state.MarketplaceDataReducer.fetched,
        hasError: state.MarketplaceDataReducer.hasError,
        keyword: state.MarketplaceFilterReducer.keywordFilter,
        pageNumber: state.MarketplaceFilterReducer.currentPageNumber,
        sortingType: state.MarketplaceFilterReducer.sortingType,
        adFormatFilter: state.MarketplaceFilterReducer.adFormatFilter,
        mediumFilter: state.MarketplaceFilterReducer.mediumFilter,
        budgetFilter: state.MarketplaceFilterReducer.budgetFilter
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        loadData: (url, config) => {
            dispatch((dispatch) => {
                dispatch(fetch_MarketplaceData_Pending())
                axios.get(url, config)
                    .then((response) => {
                        dispatch(fetch_MarketplaceData_Fulfilled(response))
                    })
                    .catch((err) => {
                        console.log(err)
                        dispatch(fetch_MarketplaceData_Rejected(err))
                    })
            })
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Marketplace);
