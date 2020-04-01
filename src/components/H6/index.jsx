import React from 'react';

import {
    sixthHeader,
} from './style/style.module.scss';

export default (props) => (
    <h6 className={sixthHeader} style={{ marginLeft: props.marginLeft }}>{props.children}</h6>
);
