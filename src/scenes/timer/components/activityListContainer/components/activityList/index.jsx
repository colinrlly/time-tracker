import React from 'react';
import PropTypes from 'prop-types';

function ActivityList(props) {
    const activityComponents = props.activities.map((x, i) => (
        <li key={i}>
            <button onClick={() => props.handleActivityClick(x)}>{x.name}</button>
        </li>));

    return (
        <ul>
            {activityComponents}
        </ul>
    );
}

ActivityList.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.exact({
            name: PropTypes.string,
            color: PropTypes.number,
        }),
    ).isRequired,
    handleActivityClick: PropTypes.func.isRequired,
};

export default ActivityList;
