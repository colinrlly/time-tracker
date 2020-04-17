import React from 'react';
import { useSelector } from 'react-redux';

import {
    fullScreenBlur,
} from './style/style.module.scss';

function FullScreenBlur() {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);

    return activityDialogDisplayed
        ? <div className={fullScreenBlur} />
        : null;
}

export default FullScreenBlur;
