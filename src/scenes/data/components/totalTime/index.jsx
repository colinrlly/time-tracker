import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    totalTime,
    totalTimeLabel,
} from './style/style.module.scss';

function TotalTime(props) {
    return (
        <div>
            <h1 className={totalTime}>{props.totalTime.toFixed(2)}</h1>
            <p className={totalTimeLabel}>TOTAL HOURS</p>
        </div>
    );
}

const mapStateToProps = (state) => ({
    totalTime: state.aggregations.totalTime,
});

TotalTime.propTypes = {
    totalTime: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, null)(TotalTime);
