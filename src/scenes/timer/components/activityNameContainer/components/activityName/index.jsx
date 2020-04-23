import React from 'react';

import style from './style/style.module.scss';

function ActivityName(props) {
    return (
        <span className={style.activityName}>{props.name}</span>
    );
}

export default ActivityName;
