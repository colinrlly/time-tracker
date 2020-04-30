import React from 'react';
import { useSelector } from 'react-redux';

import googleColors from '../../../../static/js/google_colors';

import style from './style/style.module.scss';

function Container(props) {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const currentActivity = useSelector((state) => state.currentActivity);

    const backgroundColor = {
        backgroundColor: (activityIsRunning)
            ? googleColors[currentActivity.color]
            : null,
    };

    return <div
        className={style.container}
        style={backgroundColor}
    >{props.children}</div>;
}

export default Container;
