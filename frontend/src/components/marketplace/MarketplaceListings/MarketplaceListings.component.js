/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

/*
Local CSS
*/
import './MarketplaceListings.component.css';

/*
Children Component
*/
import ListingCard from './ListingCard/ListingCard.component';

import { Pagination } from 'react-bootstrap';
import ErrorPage from '../../ErrorPage/ErrorPage.component';
import CircularProgress from 'material-ui/CircularProgress';

const pageSize = 5;
/**
 * Marketplace Listings contains array of Listing Cards
 * Filtering of data is done here, which isn't ideal
 *         Future Task: * auto load on scroll should happen here
 */
class MarketplaceListings extends Component {

    constructor(props) {
        super(props);
        this.decideTitle = this.decideTitle.bind(this);
    }

    /**
     * Display Title of Listings Component
     * Purely for presentational purposes 
     * @param {Number} listingSize size of the listing array after filtering
     */
    decideTitle(listingSize) {
        const listingType = (this.props.modeFilter === 'Advertiser' ? 'Content Spaces' : 'Contents');
        const isEmpty = (listingSize > 0 ? '' : 'No ')
        return isEmpty + listingType + ' Available';
    }

    render() {
        let pages = Math.ceil(this.props.totalListingCount / pageSize);
        let items = [];
        if (pages > 1) {
            for (let i = 1; i < pages + 1; i++) {
                items.push(<Pagination.Item
                    key={'listingPage' + i}
                    active={i === this.props.currentPageNumber}
                    onClick={() => this.props.onPageItemClick(i)}
                >
                    {i}
                </Pagination.Item>);
            }
        }

        if (this.props.hasError) {
            return <ErrorPage />
        } else if ((this.props.fetched && !this.props.hasError)) {
            return <div className='marketplace-listings-container' ref={(ref) => this._containerDiv = ref}>
                <h3 className='marketplace-title'>{this.decideTitle(this.props.totalListingCount)}</h3>
                {
                    this.props.listings.map((listing, i) => {
                        return <ListingCard key={'listingCard' + i} listing={listing} modeFilter={this.props.modeFilter} />
                    })
                }
                <div style={{ textAlign: 'center', marginBottom: '96px' }}>
                    <Pagination className='listing-pages' bsStyle='small'>{items}</Pagination>
                </div>

            </div>
        } else {
            return <div className='loading-container'><CircularProgress className='marketplace-listing-loading' size={100} thickness={6} color="purple"/> </div>
        }

    }
}

const mapStateToProps = (state) => {
    return {
        modeFilter: state.MenuBarFilterReducer.modeFilter,
        listings: state.MarketplaceDataReducer.db.listings,
        totalListingCount: state.MarketplaceDataReducer.total,
        currentPageNumber: state.MarketplaceFilterReducer.currentPageNumber,
        fetched: state.MarketplaceDataReducer.fetched,
        fetching: state.MarketplaceDataReducer.fetching,
        hasError: state.MarketplaceDataReducer.hasError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPageItemClick: (page) => {
            dispatch({
                type: 'SET_PAGE_NUMBER',
                value: page
            })
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MarketplaceListings);