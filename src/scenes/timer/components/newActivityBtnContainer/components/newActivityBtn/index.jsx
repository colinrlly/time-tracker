import React from 'react';
import PropTypes from 'prop-types';

function NewActivityBtn(props) {
    return <button onClick={props.callback}>+</button>;
}

NewActivityBtn.propTypes = {
    callback: PropTypes.func.isRequired,
};

export default NewActivityBtn;
