import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class ActivityList extends Component {
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    names: state.names,
});

// const mapDispatchToProps = {

// };

ActivityList.propTypes = {
    prop: PropTypes,
};

export default connect(mapStateToProps, null)(ActivityList);
