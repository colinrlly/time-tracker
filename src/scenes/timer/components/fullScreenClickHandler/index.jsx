import React from 'react';
import { useSelector } from 'react-redux';

import {
    fullScreenClickHandler,
} from './style/style.module.scss';

function FullScreenClickHandler() {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);

    return activityDialogDisplayed
        ? <div className={fullScreenClickHandler} />
        : null;
}

export default FullScreenClickHandler;
