/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

/*
React Bootstrap
*/
import { DropdownButton, MenuItem } from 'react-bootstrap';

/*
Local CSS
*/
import './SortingSelector.component.css';


class SortingSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Date Added'
        }
    }

    render() {
        return <div>
            <DropdownButton
                className='sorting-selector-btn'
                title={this.props.sortingType + ""}
                id='sorting-selector-btn'
                dropup={this.props.dropup}
                pullRight
                style={{ marginLeft: (this.props.dropup ? 25 : 0) }}
            >
                <MenuItem onClick={() => this.props.handleItemClick('Date Added')}>Date Added</MenuItem>
                <MenuItem onClick={() => this.props.handleItemClick('Price (Low - High)')}>Price (Low - High)</MenuItem>
                <MenuItem onClick={() => this.props.handleItemClick('Price (High - Low)')}>Price (High - Low)</MenuItem>

            </DropdownButton>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        sortingType: state.MarketplaceFilterReducer.sortingType
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemClick: (sortingType) => {
            dispatch({
                type: 'SET_SORTING_TYPE',
                value: sortingType,
            })
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SortingSelector);