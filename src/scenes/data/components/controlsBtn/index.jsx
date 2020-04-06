import React from 'react';
import cx from 'classnames';

import {
    controlsBtn,
    controlsClosed,
    controlsOpen,
} from './style/style.module.scss';

import leftArrow from '../../images/leftArrow.png';
import rightArrow from '../../images/rightArrow.png';

function ControlsBtn(props) {
    return (
        <button
            className={cx(controlsBtn, props.controlsClosed ? controlsClosed : controlsOpen)}
            onClick={() => props.handleControlsBtnClick()}>
            <img src={props.controlsClosed ? rightArrow : leftArrow} />
        </button>
    );
}

export default ControlsBtn;
