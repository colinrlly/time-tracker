import React from 'react';
import PropTypes from 'prop-types';
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
            className={cx(
                controlsBtn,
                props.controlsClosed ? controlsClosed : controlsOpen,
                props.className,
            )}
            onClick={() => props.handleControlsBtnClick()}>
            <img src={props.controlsClosed ? rightArrow : leftArrow} />
        </button>
    );
}

ControlsBtn.propTypes = {
    className: PropTypes.string,
};

export default ControlsBtn;
