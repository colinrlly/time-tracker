import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    setActivityNames,
} from '../../../../redux/actions/actions';
import googleColors from '../../../../static/js/google_colors';

import { H5 } from '../../../../components';

import {
    activityListContainer,
    colorCircle,
    activitiesList,
    activityListButton,
    activityName,
    activityListItem,
} from './style/style.module.scss';

function ActivityList(props) {
    function handleNameClick(name) {
        const newNames = JSON.parse(JSON.stringify(props.names));

        newNames[name].selected = !newNames[name].selected;

        props.setActivityNames(newNames);
    }

    function mapActivityNames(activity, i) {
        return (
            <li className={activityListItem} key={i}>
                <button
                    onClick={() => handleNameClick(activity.name)}
                    className={activityListButton}>
                    <div
                        className={colorCircle}
                        style={{
                            backgroundColor: (
                                activity.selected ? googleColors[activity.colorId] : 'transparent'
                            ),
                            borderColor: googleColors[activity.colorId],
                            borderWidth: (activity.selected ? 0 : 3),
                        }} />
                    <div className={activityName}>{activity.name}</div>
                </button>
            </li>
        );
    }

    let activityWithName;
    const activities = Object.keys(props.names).reduce((acc, name) => {
        activityWithName = {
            ...props.names[name],
            name,
        };

        if (props.names[name].inActivities) {
            acc.inActivities.push(activityWithName);
        } else {
            acc.notInActivities.push(activityWithName);
        }

        return acc;
    }, {
        inActivities: [],
        notInActivities: [],
    });

    const inActivitiesList = activities.inActivities.map(mapActivityNames);
    const notInActivitiesList = activities.notInActivities.map(mapActivityNames);

    return (
        <div className={activityListContainer}>
            <H5>ACTIVITIES</H5>
            <ul className={activitiesList}>
                {inActivitiesList}
            </ul>
            <ul className={activitiesList}>
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
    names: PropTypes.object.isRequired,
    setActivityNames: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);
