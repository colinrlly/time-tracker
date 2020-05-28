import React from 'react';

import { NavBar } from '../../components';

import activityListStyle from
    '../timer/components/activityListContainer/components/activityList/style/style.module.scss';
import style from './style/style.module.scss';

import googleColors from '../../static/js/google_colors';

function Landing() {
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
            <div className={style.timeTrackingButtons}>
                <ul className={activityListStyle.activityList}>
                    <li className={activityListStyle.activityListItem}>
                        <button
                            className={activityListStyle.activityListBtn}
                            style={{
                                backgroundColor: `${googleColors[3]}`,
                            }}>Hello</button>
                    </li>
                    <li className={activityListStyle.activityListItem}>
                        <button
                            className={activityListStyle.activityListBtn}
                            style={{
                                backgroundColor: `${googleColors[6]}`,
                            }}>Goodbye</button>
                    </li>
                    <li className={activityListStyle.activityListItem}>
                        <button
                            className={activityListStyle.activityListBtn}
                            style={{
                                backgroundColor: `${googleColors[5]}`,
                            }}>Hello Again</button>
                    </li>
                </ul>
            </div>
        </div>
    </div >;
}

export default Landing;
