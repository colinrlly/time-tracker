import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function TotalTime(props) {
    return <h1>{(props.totalTime / 60).toFixed(2)}</h1>;
}

const mapStateToProps = (state) => ({
    totalTime: state.aggregations.totalTime,
});

TotalTime.propTypes = {
    totalTime: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, null)(TotalTime);
