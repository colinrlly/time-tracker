import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import { googleColorsRGB } from '../../../../../../static/js/google_colors';

import cog from './images/cog.png';

import style from './style/style.module.scss';

function ActivityList(props) {
    const activityComponents = props.activities.map((x, i) => (
        <li
            key={i}
            className={style.activityListItem}>
            <button
                onClick={() => props.handleActivityClick(x)}
                disabled={props.disabled}
                className={style.activityListBtn}
                style={{
                    backgroundColor:
                        `rgba(
                            ${googleColorsRGB[x.color][0]},
                            ${googleColorsRGB[x.color][1]},
                            ${googleColorsRGB[x.color][2]},
                            1
                        )`,
                }}>{x.name}</button>
            <button
                onClick={() => props.editCallback(x)}
                data-testid={`edit-${x.name}`}
                className={style.activityListEditBtn}
            >
                <img src={cog} />
            </button>
        </li>));

    if (!props.usedInLandingPage) {
        activityComponents.push(
            <li
                key={10000}
                className={style.activityListItem}>
                <button
                    onClick={() => props.NewActivityBtnCallback()}
                    disabled={props.disabled}
                    className={cx(style.activityListBtn, style.addActivityBtn)}
                    style={{
                        backgroundColor: '#BDBDBD',
                    }}
                >+</button>
            </li>,
        );
    }

    return (
        (props.activityIsRunning || props.hasUnsavedActivityRecord)
            ? null
            : <ul className={style.activityList}>
                {activityComponents}
            </ul>
    );
}

ActivityList.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.exact({
            id: PropTypes.number,
            name: PropTypes.string,
            color: PropTypes.number,
        }),
    ).isRequired,
    handleActivityClick: PropTypes.func.isRequired,
    activityIsRunning: PropTypes.bool.isRequired,
    hasUnsavedActivityRecord: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    editCallback: PropTypes.func.isRequired,
    NewActivityBtnCallback: PropTypes.func,
    usedInLandingPage: PropTypes.bool,
};

ActivityList.defaultProps = {
    usedInLandingPage: false,
};

export default ActivityList;
