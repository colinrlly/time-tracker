import React from 'react';
import cx from 'classnames';

import {
    pageLink,
} from '../../styles/styles.module.scss';

import {
    container,
    open,
    hamburgerPageLink,
    pageLinkOpen,
} from './style/style.module.scss';

function HamburgerMenu(props) {
    return (
        <div className={cx(container, props.open ? open : null)}>
            <a className={
                cx(pageLink, hamburgerPageLink, props.open ? pageLinkOpen : null)
            } href='/'>TIMER</a>

            <a className={
                cx(pageLink, hamburgerPageLink, props.open ? pageLinkOpen : null)
            } href='/data'>DATA</a>

            <a className={
                cx(pageLink, hamburgerPageLink, props.open ? pageLinkOpen : null)
            } href='https://calendar.google.com/'>CALENDAR</a>

            <a className={
                cx(pageLink, hamburgerPageLink, props.open ? pageLinkOpen : null)
            } href='https://www.buymeacoffee.com/LogTheApp'>DONATE</a>

            <a className={
                cx(pageLink, hamburgerPageLink, props.open ? pageLinkOpen : null)
            } href='/'>SIGN OUT</a>
        </div>
    );
}

export default HamburgerMenu;
