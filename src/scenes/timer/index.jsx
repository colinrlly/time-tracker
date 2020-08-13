import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import {
    NavBar,
    Footer,
    PageVisibilityWatcher,
} from '../../components';

import googleColors from '../../static/js/google_colors';

import {
    ActivityListContainer,
    StartupPayloadFetcher,
    ActivityDialogContainer,
    FullScreenClickHandler,
    Container,
    TimerContainer,
} from './components';

import style from './style/style.module.scss';

function Timer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const currentActivity = useSelector((state) => state.currentActivity);
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);

    const navBarBackgroundColor = activityIsRunning ? googleColors[currentActivity.color] : null;
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
            <PageVisibilityWatcher />
            <StartupPayloadFetcher />
            <FullScreenClickHandler />
            <ActivityDialogContainer />
            <div className={contentStyle}>
                <NavBar shadow={false} backgroundColor={navBarBackgroundColor} />
                <TimerContainer />
                <ActivityListContainer />
            </div>
            <Footer color={activityIsRunning ? '#FFFFFF' : null} />
        </Container>
    );
}

export default Timer;
