import React from 'react';

import style from './style/style.module.scss';
import landingStyle from '../../style/style.module.scss';

import CalendarImage from '../../images/calendar.png';
import CalendarIcon from '../../images/calendar_icon.png';

function GCal() {
    return (
        <div className={style.gCal}>
            <div className={style.gCalSection}>
                <img className={landingStyle.sectionIcon} src={CalendarIcon} />

                <h1 className={landingStyle.sectionH1}>In Sync With Google Calendar</h1>

                <h2 className={landingStyle.sectionH2}>All activities tracked with Turnip save to
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
    );
}

export default GCal;
