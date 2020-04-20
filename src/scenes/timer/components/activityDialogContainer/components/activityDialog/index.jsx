import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import googleColors from '../../../../../../static/js/google_colors';

import style from './style/style.module.scss';

function ActivityDialog(props) {
    const colorButtons = Object.keys(googleColors).map(
        (x, i) => <button
            key={i}
            style={{ backgroundColor: googleColors[x] }}
            name={x}
            data-testid={`colorBtn${x}`}
            className={cx(
                style.color,
                props.selectedColor === parseInt(x, 10) ? style.selectedColor : '',
            )}
            onClick={() => props.colorBtnCallback(parseInt(x, 10))} />,
    );

    return (
        <div className={style.overlay}>
            <div>
                <button onClick={props.exitBtnCallback}>+</button>
            </div>

            <div>
                <div>
                    <input
                        type='text'
                        placeholder='Add Title'
                        aria-label="activity-name-input"
                        value={props.activityName}
                        onChange={props.activityNameInputCallback} />
                </div>

                <div className={style.colorsContainer}>
                    {colorButtons}
                </div>
            </div>

            <button onClick={props.submitCallback}>Add</button>
        </div>
    );
}

ActivityDialog.propTypes = {
    exitBtnCallback: PropTypes.func.isRequired,
    activityNameInputCallback: PropTypes.func.isRequired,
    activityName: PropTypes.string.isRequired,
    colorBtnCallback: PropTypes.func.isRequired,
    selectedColor: PropTypes.number.isRequired,
    submitCallback: PropTypes.func.isRequired,
};

export default ActivityDialog;
