import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NavBar, Btn } from '../../components';

import {
    TimerTextContainer,
    ActivityNameContainer,
} from '../timer/components';

import {
    ActivityList,
} from '../timer/components/activityListContainer/components';

import btnStyle from
    '../timer/components/runningActivityButtons/style/style.module.scss';
import { timerContainerStyle } from
    '../timer/style/style.module.scss';
import style from './style/style.module.scss';

import {
    utcNow,
} from '../../helpers';
import * as actions from '../../redux/actions';

function Landing() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);

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

    return <div>
        <NavBar landing={true} />
        <div className={style.header}>
            <h1>Finding Time to Follow Your Dreams</h1>
            <h2>Turnip is a minimal time tracking app that gives you the tools
                 to analyze how you live your life.</h2>
        </div>
        <div className={style.gCal}>
            <div className={style.gCalSection}>
                <h2>In Sync With Google Calendar</h2>
                <p>Turnip reads and wrties to your Google Calendar.
                When you save an activity it shows in your
                Google Calendar so you can use the tools you
                already love. Turnip also pulls in your
                pre-existing events so you can use our
                    tools to analyze the rest of your time.</p>
            </div>
            <div className={style.gCalSection}>

            </div>
        </div>
        <div className={style.timeTracking}>
            <h2>Satisfying Time Tracking</h2>
            <ActivityList
                activities={[{
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
                }]}
                handleActivityClick={handleActivityClick}
                activityIsRunning={activityIsRunning}
                hasUnsavedActivityRecord={hasUnsavedActivityRecord}
                disabled={false}
                editCallback={() => { }} />
            <div
                className={timerContainerStyle}
                style={{
                    display: activityIsRunning || hasUnsavedActivityRecord ? 'block' : 'none',
                }}>
                <ActivityNameContainer />
                <TimerTextContainer />
                {activityIsRunning
                    ? <Btn
                        callback={handleStopClick}
                        text={'Stop'}
                        className={btnStyle.btn} />
                    : null}
            </div>
        </div>
    </div >;
}

export default Landing;
