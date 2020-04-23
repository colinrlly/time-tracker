import React from 'react';
import PropTypes from 'prop-types';

import style from './style/style.module.scss';

function Footer(props) {
    return (
        <footer className={style.footer} style={{
            color: props.color ? props.color : '#444444',
        }}>
            <a href='https://www.buymeacoffee.com/logtheapp' className={style.buyMeACoffee}>Buy us a coffee</a>
            <span>hellologtime@gmail.com</span>
            <a href='https://www.reddit.com/r/logtheapp'>Reddit</a>
            <a href='http://log-time.com/static/docs/log_privacy_policy.docx' download=''>Privacy Policy</a>
            <a href='http://log-time.com/static/docs/log_terms_of_service.docx' download=''>Terms of Service</a>
        </footer>
    );
}

Footer.proptypes = {
    color: PropTypes.string,
};

export default Footer;
