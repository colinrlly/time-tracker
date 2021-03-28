import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
    HamburgerMenu,
} from './components';

import style from './styles/style.module.scss';

import hamburgerDark from './images/hamburgerDark.png';
import hamburgerLight from './images/hamburgerLight.png';
import logoLight from './images/logoLight.png';
import logoDark from './images/logoDark.png';

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
            <nav
                className={cx(
                    style.navigation,
                    this.props.shadow ? style.shadow : null,
                )}
                ref={this.setContainerRef}
                style={{
                    backgroundColor: this.props.backgroundColor
                        ? this.props.backgroundColor : '#FFFFFF',
                    color: this.props.backgroundColor
                        ? '#FFFFFF' : '#000000',
                    opacity: this.props.backgroundColor
                        ? 0.95 : 1,
                }}
            >
                <a className={style.logo} href='/'>
                    {this.props.backgroundColor
                        ? <img src={logoLight} />
                        : <img src={logoDark} />}
                </a>

                {this.props.landing ? (
                    <div></div>
                ) : (
                    <div>
                        <a className={cx(style.pageLink, style.navPageLink)} href='/'>Timer</a>
                        <a className={cx(style.pageLink, style.navPageLink)} href='/data'>Data</a>
                        <a className={cx(style.pageLink, style.navPageLink)} href='https://calendar.google.com/'>Calendar</a>
                        <a className={cx(style.pageLink, style.navPageLink)} href='https://www.buymeacoffee.com/LogTheApp'>Donate</a>
                        <a className={cx(style.pageLink, style.navPageLink)} href='/account'>Account</a>

                        <button className={style.hamburger} onClick={this.handleHamburgerClick}>
                            <img src={this.props.backgroundColor ? hamburgerLight : hamburgerDark} />
                        </button>

                        <HamburgerMenu open={hamburgerMenuOpen} />
                    </div>)}
            </nav>
        );
    }
}

NavBar.Proptypes = {
    shadow: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string,
    landing: PropTypes.bool,
};

export default NavBar;
