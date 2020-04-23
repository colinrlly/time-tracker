import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import style from './style/style.module.scss';

function FullScreenBlur(props) {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);

    return <div
        className={cx(activityDialogDisplayed ? style.blur : '', style.fullHeight)}
    >{props.children}</div>;
}

export default FullScreenBlur;
