import React from 'react';
import cx from 'classnames';

import {
    tooltip,
} from './style/style.module.scss';

function Tooltip() {
    return (
        <div className={cx(tooltip, 'tooltipHook')}></div>
    );
}

export default Tooltip;
