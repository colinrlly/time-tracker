import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import style from './style/style.module.scss';

function Btn(props) {
    return (
        <button
            onClick={props.callback}
            className={cx(props.className, style.btn)}
        >{props.text}</button>
    );
}

Btn.propTypes = {
    callback: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Btn;
