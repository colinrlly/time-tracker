import React from 'react';

import {
    fifthHeader,
} from './style/style.module.scss';

export default (props) => (<h5 className={fifthHeader}>{props.children}</h5>);
