import React from 'react';

import GoogleSigninLight from '../../images/gsignin_light.png';

import style from './style/style.module.scss';

function Header() {
    return (
        <div className={style.header}>
            <h1>Finding Time to Follow Your Dreams</h1>

            <h2>Turnip is a minimal time tracking app that gives you the tools
                 to analyze how you live your life.</h2>

            <a href='/login'>
                <img src={GoogleSigninLight} className={style.gsignin} />
            </a>
        </div>
    );
}

export default Header;
