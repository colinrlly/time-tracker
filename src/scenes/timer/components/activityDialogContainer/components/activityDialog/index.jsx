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
                props.selectedColor === x ? style.selectedColor : '',
            )}
            onClick={() => props.colorBtnCallback(x)} />,
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

            <button>ADD</button>
        </div>
    );
}

ActivityDialog.propTypes = {
    exitBtnCallback: PropTypes.func.isRequired,
    activityNameInputCallback: PropTypes.func.isRequired,
    activityName: PropTypes.string.isRequired,
    colorBtnCallback: PropTypes.func.isRequired,
    selectedColor: PropTypes.string.isRequired,
};

export default ActivityDialog;
