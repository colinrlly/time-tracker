import React from 'react';
import PropTypes from 'prop-types';

function ActivityList(props) {
    const activityComponents = props.activities.map((x, i) => (
        <li key={i}>
            <button
                onClick={() => props.handleActivityClick(x)}
                disabled={props.disabled}
            >{x.name}</button>
            <button
                onClick={() => props.editCallback(x)}
                data-testid={`edit-${x.name}`}
            >edit</button>
        </li>));

    return (
        <ul>
            {
                (props.activityIsRunning || props.hasUnsavedActivityRecord)
                    ? null
                    : activityComponents}
        </ul>
    );
}

ActivityList.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.exact({
            id: PropTypes.number,
            name: PropTypes.string,
            color: PropTypes.number,
        }),
    ).isRequired,
    handleActivityClick: PropTypes.func.isRequired,
    activityIsRunning: PropTypes.bool.isRequired,
    hasUnsavedActivityRecord: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    editCallback: PropTypes.func.isRequired,
};

export default ActivityList;
