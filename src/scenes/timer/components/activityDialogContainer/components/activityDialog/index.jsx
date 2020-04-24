import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import googleColors from '../../../../../../static/js/google_colors';

import { Btn } from '../../../../../../components';

import exitBtn from './images/exitBtn.png';

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
            <div className={style.exitBtnContainer}>
                <button
                    className={style.exitBtn}
                    onClick={props.exitBtnCallback}
                    data-testid={'exitBtn'}>
                    <img src={exitBtn} />
                </button>
            </div>

            <div
                className={style.titleInputContainer}
                style={{
                    backgroundColor: googleColors[props.selectedColor],
                }}
            >
                <input
                    type='text'
                    placeholder='Add Title'
                    aria-label="activity-name-input"
                    value={props.activityName}
                    onChange={props.activityNameInputCallback}
                    className={style.titleInput} />
            </div>

            <div className={style.colorsContainer}>
                {colorButtons}
            </div>

            <Btn
                callback={props.submitCallback}
                text={props.submitText}
                className={style.submitBtn} />

            {props.showDelete
                ? <button
                    onClick={props.deleteActivityCallback}
                    className={style.deleteBtn}
                >Delete Activity</button>
                : null}
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
    submitText: PropTypes.oneOf(['Add', 'Save']).isRequired,
    showDelete: PropTypes.bool.isRequired,
    deleteActivityCallback: PropTypes.func.isRequired,
    currentActivity: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string,
        color: PropTypes.number,
    }).isRequired,
};

export default ActivityDialog;
