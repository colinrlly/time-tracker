import React, { Component } from 'react';
import cx from 'classnames';

import {
    HamburgerMenu,
} from './components';

import {
    navigation,
    pageLink,
    logo,
    hamburger,
    navPageLink,
} from './styles/styles.module.scss';

import hamburgerImage from './images/hamburger.png';

export class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hamburgerMenuOpen: false,
        };

        this.handleHamburgerClick = this.handleHamburgerClick.bind(this);
        this.setContainerRef = this.setContainerRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setContainerRef(node) {
        this.containerRef = node;
    }

    handleHamburgerClick() {
        const { hamburgerMenuOpen } = this.state;

        this.setState({
            hamburgerMenuOpen: !hamburgerMenuOpen,
        });
    }

    handleClickOutside(event) {
        if (this.containerRef && !this.containerRef.contains(event.target)) {
            this.setState({
                hamburgerMenuOpen: false,
            });
        }
    }

    render() {
        const { hamburgerMenuOpen } = this.state;

        return (
            <nav className={navigation} ref={this.setContainerRef}>
                <a className={logo} href='/'>TURNIP</a>
                <a className={cx(pageLink, navPageLink)} href='/'>TIMER</a>
                <a className={cx(pageLink, navPageLink)} href='/data'>DATA</a>
                <a className={cx(pageLink, navPageLink)} href='https://calendar.google.com/'>CALENDAR</a>
                <a className={cx(pageLink, navPageLink)} href='https://www.buymeacoffee.com/LogTheApp'>DONATE</a>
                <a className={cx(pageLink, navPageLink)} href='/'>SIGN OUT</a>

                <button className={hamburger} onClick={this.handleHamburgerClick}>
                    <img src={hamburgerImage} />
                </button>

                <HamburgerMenu open={hamburgerMenuOpen} />
            </nav>
        );
    }
}

export default NavBar;
