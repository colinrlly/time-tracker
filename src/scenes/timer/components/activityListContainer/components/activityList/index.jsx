import React from 'react';
import PropTypes from 'prop-types';

import { googleColorsRGB } from '../../../../../../static/js/google_colors';

import style from './style/style.module.scss';

function ActivityList(props) {
    const activityComponents = props.activities.map((x, i) => (
        <li
            key={i}
            className={style.activityListItem}
            style={{
                backgroundColor:
                    `rgba(
                        ${googleColorsRGB[x.color][0]},
                        ${googleColorsRGB[x.color][1]},
                        ${googleColorsRGB[x.color][2]},
                        1
                    )`,
            }}
        >
            <button
                onClick={() => props.handleActivityClick(x)}
                disabled={props.disabled}
                className={style.activityListBtn}
            >{x.name}</button>
            {/* <button
                onClick={() => props.editCallback(x)}
                data-testid={`edit-${x.name}`}
                className={style.activityListEditBtn}
            >edit</button> */}
        </li>));

    return (
        <ul className={style.activityList}>
            {
                (props.activityIsRunning || props.hasUnsavedActivityRecord)
                    ? null
                    : activityComponents}
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
};

export default ActivityList;
