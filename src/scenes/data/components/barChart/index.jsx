import React from 'react';
import { connect } from 'react-redux';

function BarChart(props) {
    return (
        <p>barChart</p>
    );
}

const mapStateToProps = (state) => ({
    list: state.list,
});

export default connect(mapStateToProps, null)(BarChart);
