import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    setActivityNames,
} from '../../../../redux/actions/actions';

function ActivityList(props) {
    const inActivitiesNames = Object.keys(props.names).filter(
        (name) => props.names[name].inActivities,
    );
    const notInActivitiesNames = Object.keys(props.names).filter(
        (name) => !props.names[name].inActivities,
    );

    function handleNameClick(name) {
        const newNames = JSON.parse(JSON.stringify(props.names));

        newNames[name].selected = !newNames[name].selected;

        props.setActivityNames(newNames);
    }

    const selectedStyle = {
        border: '1px solid red',
    };

    const inActivitiesList = inActivitiesNames.map(
        (name, i) => <li key={i}>
            <button
                onClick={() => handleNameClick(name)}
                style={props.names[name].selected ? selectedStyle : null}>
                {name}
            </button>
        </li>,
    );
    const notInActivitiesList = notInActivitiesNames.map(
        (name, i) => <li key={i}>
            <button
                onClick={() => handleNameClick(name)}
                style={props.names[name].selected ? selectedStyle : null}>
                {name}
            </button>
        </li>,
    );

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

const mapDispatchToProps = {
    setActivityNames,
};

ActivityList.propTypes = {
    prop: PropTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);
