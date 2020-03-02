import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function ActivityList(props) {
    const list = Object.keys(props.names).map((name, i) => <li key={i}>{name}</li>);

    return (
        <ul>
            {list}
        </ul>
    );
}

const mapStateToProps = (state) => ({
    names: state.names,
});

ActivityList.propTypes = {
    prop: PropTypes,
};

export default connect(mapStateToProps, null)(ActivityList);
