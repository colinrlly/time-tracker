import React from 'react';
import PropTypes from 'prop-types';

function Btn(props) {
    return (
        <button onClick={props.callback} className={props.className}>{props.text}</button>
    );
}

Btn.propTypes = {
    callback: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Btn;
