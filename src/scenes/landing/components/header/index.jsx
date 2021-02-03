import React from 'react';

import GoogleSigninLight from '../../images/gsignin_light.png';

import {
    ActivityList,
} from '../../../timer/components/activityListContainer/components';

import style from './style/style.module.scss';

function Header() {
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
        <div className={style.header}>
            <div className={style.textContainer}>
                <h1 className={style.headerH1}>Finding Time to Follow Your Dreams</h1>

                <h2 className={style.headerH2}>Turnip is a minimal time tracking app that gives you the tools
                    to analyze your life.</h2>

                <a href='/login' className={style.gSigningLink}>
                    <img src={GoogleSigninLight} className={style.gsignin} />
                </a>
            </div>
            <div className={style.activityListContainer}>
                <ActivityList
                    className={style.activityList}
                    activities={activities}
                    handleActivityClick={() => {}}
                    activityIsRunning={false}
                    hasUnsavedActivityRecord={false}
                    disabled={false}
                    editCallback={() => {}}
                    usedInLandingPage={true} />
            </div>
        </div>
    );
}

export default Header;
