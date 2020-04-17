import React from 'react';
import { useSelector } from 'react-redux';

import style from './style/style.module.scss';

function FullScreenBlur(props) {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);

    return <div
        className={activityDialogDisplayed ? style.blur : ''}
    >{props.children}</div>;
}

export default FullScreenBlur;
