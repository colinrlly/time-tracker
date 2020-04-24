import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import style from './style/style.module.scss';

function ActivityName(props) {
    return (
        <span
            className={cx(
                style.activityName,
                props.hasUnsavedActivityRecord ? style.blackText : null,
            )}
        >{props.name}</span>
    );
}

ActivityName.propTypes = {
    name: PropTypes.string.isRequired,
    hasUnsavedActivityRecord: PropTypes.bool.isRequired,
};

export default ActivityName;
