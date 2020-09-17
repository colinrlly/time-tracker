import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

// Components
import {
    H5,
    NavBar,
    Btn,
    FakeListFetcher,
} from '../../components';
import {
    TimerContainer,
} from '../timer/components';
import {
    TimerTextContainer,
    ActivityNameContainer,
} from '../timer/components/timerContainer/components';
import {
    ActivityList as TimerActivityList,
} from '../timer/components/activityListContainer/components';
import {
    Picker,
    ActivityList as DataActivityList,
    BarChart,
    StackedBarChart,
    TotalsAggregator,
    ActivityListAggregator,
    FilteredTotalsAggregator,
    TotalTimeAggregator,
    StackedTotalsAggregator,
    Tooltip,
    ControlsBtn,
    TotalTime,
} from '../data/components';

// Styles
import btnStyle from
    '../timer/components/timerContainer/components/runningActivityButtons/style/style.module.scss';
import timerContainerStyle from
    '../timer/components/timerContainer/style/style.module.scss';
import dsbStyle from
    '../timer/components/timerContainer/components/runningActivityButtons/deleteSaveBtns/style/style.module.scss';
import style from './style/style.module.scss';
import {
    controls,
    content,
    container,
    closedControls,
    fullWidthContent,
    openControls,
    footerPusher,
} from '../data/style/structure.module.scss';

// Helper functions
import {
    utcNow,
} from '../../helpers';
import * as actions from '../../redux/actions';
import googleColors from '../../static/js/google_colors';

// Images
import GoogleSigninLight from './images/gsignin_light.png';
import CalendarImage from './images/calendar.png';
import CalendarIcon from './images/calendar_icon.png';
import TimeTrackingIcon from './images/time_tracking_icon.png';

function Landing() {
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

    return <div>
        <NavBar landing={true} backgroundColor='#31B77A' />

        <div className={style.header}>
            <h1>Finding Time to Follow Your Dreams</h1>

            <h2>Turnip is a minimal time tracking app that gives you the tools
                 to analyze how you live your life.</h2>

            <a href='/login'>
                <img src={GoogleSigninLight} className={style.gsignin} />
            </a>
        </div>

        <div className={style.gCal}>
            <div className={style.gCalSection}>
                <img className={style.sectionIcon} src={CalendarIcon} />

                <h1 className={style.sectionH1}>In Sync With Google Calendar</h1>

                <h2 className={style.sectionH2}>All activities tracked with Turnip save to
                your Google Calendar so you can use the
                tools you already love to view and edit
                    your activity records.</h2>
            </div>

            <div className={style.gCalSection}>
                <div className={style.calendarImageContainer}>
                    <img src={CalendarImage} />
                </div>
            </div>
        </div>

        <div className={style.timeTracking} style={{ backgroundColor: timerBackgroundColor }}>
            <img className={style.sectionIcon} src={TimeTrackingIcon} />

            <h1
                className={style.sectionH1}
                style={{ color: timeTrackingH1Color }}>Satisfying Time Tracking</h1>

            <h2
                className={style.sectionH2}
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
                editCallback={() => { }} />

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
        {/* <div>
            <FakeListFetcher />
            <TotalsAggregator />
            <ActivityListAggregator />
            <StackedTotalsAggregator />
            <FilteredTotalsAggregator />
            <TotalTimeAggregator />

            <nav className={cx(controls, false ? closedControls : openControls)}>
                <H5>Time Range</H5>
                <Picker />
                <DataActivityList />
            </nav>

            <ControlsBtn
                controlsClosed={false}
                handleControlsBtnClick={() => this.handleControlsBtnClick()} />

            <main className={cx(content, false ? fullWidthContent : null)}>
                <div>
                    <Tooltip />
                    <StackedBarChart tweenStatus={0} />
                </div>
            </main>
        </div> */}
    </div >;
}

export default Landing;
