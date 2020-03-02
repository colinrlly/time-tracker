import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function ActivityList(props) {
    const inActivitiesNames = Object.keys(props.names).filter(
        (name) => props.names[name].inActivities,
    );

    const notInActivitiesNames = Object.keys(props.names).filter(
        (name) => !props.names[name].inActivities,
    );

    const inActivitiesList = inActivitiesNames.map((name, i) => <li key={i}>{name}</li>);
    const notInActivitiesList = notInActivitiesNames.map((name, i) => <li key={i}>{name}</li>);

    return (
        <div>
            <ul>
                {inActivitiesList}
            </ul>
            <br></br>
            <ul>
                {notInActivitiesList}
            </ul>
        </div>
    );
}

const mapStateToProps = (state) => ({
    names: state.names,
});

ActivityList.propTypes = {
    prop: PropTypes,
};

export default connect(mapStateToProps, null)(ActivityList);
