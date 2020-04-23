import React from 'react';

import style from './style/style.module.scss';

function Footer() {
    return (
        <footer className={style.footer}>
            <a href='https://www.buymeacoffee.com/logtheapp' className={style.buyMeACoffee}>
                Buy us a coffee
            </a>
            <span>hellologtime@gmail.com</span>
            <a href=''>Reddit</a>
        </footer>
    );
}

export default Footer;
