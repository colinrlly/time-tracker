import React from 'react';

function ActivityName(props) {
    return (
        props.activityIsRunning ? <span>{props.name}</span> : null
    );
}

export default ActivityName;
