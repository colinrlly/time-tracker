import React from 'react';
import PropTypes from 'prop-types';

function NewActivityBtn(props) {
    return <button
        onClick={props.callback}
        disabled={props.disabled}
    >+</button>;
}

NewActivityBtn.propTypes = {
    callback: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default NewActivityBtn;
