import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import {
    NavBar,
    Footer,
} from '../../components';

import googleColors from '../../static/js/google_colors';

import {
    TimerTextContainer,
    ActivityListContainer,
    StartupPayloadFetcher,
    ActivityNameContainer,
    DeleteSaveBtns,
    StopBtnContainer,
    ActivityDialogContainer,
    NewActivityBtnContainer,
    FullScreenClickHandler,
    Container,
} from './components';

import style from './style/style.module.scss';

function Timer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);
    const currentActivity = useSelector((state) => state.currentActivity);
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);

    const navBarBackgroundColor = activityIsRunning ? googleColors[currentActivity.color] : null;
    const timerContainerStyle = cx(
        style.timerContainer,
        (activityIsRunning || hasUnsavedActivityRecord)
            ? style.activityIsRunning
            : null,
    );
    const contentStyle = cx(activityDialogDisplayed ? style.blur : '', style.content);

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')
            .setAttribute('content', activityIsRunning
                ? googleColors[currentActivity.color]
                : '#FFFFFF');

        return () => {
            document.querySelector('meta[name="theme-color"]')
                .setAttribute('content', '#FFFFFF');
        };
    }, [activityIsRunning, currentActivity]);

    return (
        <Container>
            <StartupPayloadFetcher />
            <FullScreenClickHandler />
            <ActivityDialogContainer />
            <div className={contentStyle}>
                <NavBar shadow={false} backgroundColor={navBarBackgroundColor} />
                <div className={timerContainerStyle}>
                    <ActivityNameContainer />
                    <NewActivityBtnContainer />
                    <TimerTextContainer />
                    <StopBtnContainer />
                    <DeleteSaveBtns />
                </div>
                <ActivityListContainer />
            </div>
            <Footer color={activityIsRunning ? '#FFFFFF' : null} />
        </Container>
    );
}

export default Timer;
