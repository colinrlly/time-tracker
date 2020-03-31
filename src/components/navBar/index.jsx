import React, { Component } from 'react';

import {
    navigation,
    pageLink,
    logo,
} from './styles/styles.module.scss';

export class NavBar extends Component {
    render() {
        this;

        return (
            <nav className={navigation}>
                <a className={logo} href='/'>TURNIP</a>
                <a className={pageLink} href='/'>TIMER</a>
                <a className={pageLink} href='/data'>DATA</a>
                <a className={pageLink} href='https://calendar.google.com/'>CALENDAR</a>
                <a className={pageLink} href='https://www.buymeacoffee.com/LogTheApp'>DONATE</a>
                <a className={pageLink} href='/'>SIGN OUT</a>
            </nav>
        );
    }
}

export default NavBar;
