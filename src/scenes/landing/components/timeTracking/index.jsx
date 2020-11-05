import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

// Components
import {
    TimerTextContainer,
    ActivityNameContainer,
} from '../../../timer/components/timerContainer/components';
import {
    ActivityList as TimerActivityList,
} from '../../../timer/components/activityListContainer/components';
import {
    Btn,
} from '../../../../components';

// Helpers
import {
    utcNow,
} from '../../../../helpers';
import * as actions from '../../../../redux/actions';
import googleColors from '../../../../static/js/google_colors';

// Styles
import style from './style/style.module.scss';
import landingStyle from '../../style/style.module.scss';
import btnStyle from
    '../../../timer/components/timerContainer/components/runningActivityButtons/style/style.module.scss';
import dsbStyle from
    '../../../timer/components/timerContainer/components/runningActivityButtons/deleteSaveBtns/style/style.module.scss';

// Images
import TimeTrackingIcon from '../../images/time_tracking_icon.png';

function TimeTracking() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);
    const currentActivity = useSelector((state) => state.currentActivity);

    const dispatch = useDispatch();

    function handleActivityClick(activity) {
        dispatch(actions.setCurrentActivity(activity));
        dispatch(actions.setActivityIsRunning(true));
        dispatch(actions.setLastActivityStartTime(utcNow()));
    }

    function handleStopClick() {
        dispatch(actions.setActivityIsRunning(false));
        dispatch(actions.setHasUnsavedActivityRecord(true));
        dispatch(actions.setLastActivityStopTime(utcNow()));
    }

    function deleteSaveCallback() {
        dispatch(actions.setHasUnsavedActivityRecord(false));
    }

    const timerBackgroundColor = activityIsRunning ? googleColors[currentActivity.color] : null;
    const timerContainerStyles = cx(
        style.timerContainer,
        (activityIsRunning || hasUnsavedActivityRecord)
            ? style.activityIsRunning
            : null,
    );
    const timeTrackingH1Color = activityIsRunning ? 'white' : '#31B77A';
    const timeTrackingH2Color = activityIsRunning ? 'white' : '#4F4F4F';

    const activities = [{
        id: 1,
        name: 'Hello',
        color: 3,
    }, {
        id: 2,
        name: 'Hi there',
        color: 9,
    }, {
        id: 3,
        name: 'Bien Vienue',
        color: 6,
    }];

    return (
        <div className={style.timeTracking} style={{ backgroundColor: timerBackgroundColor }}>
            <div className={style.timeTrackingContent}>
                <img className={landingStyle.sectionIcon} src={TimeTrackingIcon} />

                <h1
                    className={landingStyle.sectionH1}
                    style={{ color: timeTrackingH1Color }}>Satisfying Time Tracking</h1>

                <h2
                    className={landingStyle.sectionH2}
                    style={{ color: timeTrackingH2Color }}>Creating and tracking activies
                    is easy with Turnip’s
                    clean interface. just create an activity button
                    and then click the button to start
                    tracking the activity.</h2>

                <TimerActivityList
                    activities={activities}
                    handleActivityClick={handleActivityClick}
                    activityIsRunning={activityIsRunning}
                    hasUnsavedActivityRecord={hasUnsavedActivityRecord}
                    disabled={false}
                    editCallback={() => { }}
                    usedInLandingPage={true} />

                <h3 style={{
                    display: activityIsRunning || hasUnsavedActivityRecord ? 'none' : 'block',
                }}>Click a button to give it a try!</h3>

                <div className={timerContainerStyles}>
                    <ActivityNameContainer />

                    <TimerTextContainer />

                    {activityIsRunning
                        ? <Btn
                            callback={handleStopClick}
                            text={'Stop'}
                            className={btnStyle.btn} />
                        : null}

                    {hasUnsavedActivityRecord ? (
                        <div className={dsbStyle.deleteSaveBtns}>
                            <Btn
                                callback={deleteSaveCallback}
                                text='Delete'
                                className={cx(dsbStyle.deleteBtn, btnStyle.btn)} />

                            <Btn
                                callback={deleteSaveCallback}
                                text='Save'
                                className={cx(dsbStyle.saveBtn, btnStyle.btn)} />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default TimeTracking;
