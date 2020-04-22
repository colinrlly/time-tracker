import React from 'react';
import PropTypes from 'prop-types';

import plus from './images/plus.png';

import style from './style/style.module.scss';

function NewActivityBtn(props) {
    return <button
        onClick={props.callback}
        disabled={props.disabled}
        className={style.plusBtn}
    >
        <img src={plus} style={
            {
                width: '15px',
                height: '15px',
                margin: 'auto auto',
                display: 'block',
            }
        } />
    </button>;
}

NewActivityBtn.propTypes = {
    callback: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default NewActivityBtn;
