import React from 'react';

import {
    controlsBtn,
} from './style/style.module.scss';

import leftArrow from '../../images/leftArrow.png';
import rightArrow from '../../images/rightArrow.png';

function ControlsBtn(props) {
    return (
        <button className={controlsBtn} onClick={() => props.handleControlsBtnClick()}>
            <img src={props.controlsClosed ? rightArrow : leftArrow} />
        </button>
    );
}

export default ControlsBtn;
