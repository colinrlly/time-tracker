import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import cx from 'classnames';

import {
    Btn,
} from '../../../../../../../components';

import style from './style/style.module.scss';
import buttonStyle from '../style/style.module.scss';

function DeleteSaveBtns() {
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);

    function callback(url) {
        axios.post(url).then((response) => {
            if (response.data.code === 'need_authorization') {
                window.location.replace(response.data.auth_url);
            } else if (response.data.code !== 'success') {
                console.error('Problem deleting or saving activity', response.data);
            }
        }).catch(() => {
            console.error('Error deleting or saving activity');
        });
    }

    return hasUnsavedActivityRecord ? (
        <div className={style.deleteSaveBtns}>
            <Btn
                callback={() => callback('api/delete-activity-record')}
                text='Delete'
                className={cx(style.deleteBtn, buttonStyle.btn)} />
            <Btn
                callback={() => callback('api/save-activity')}
                text='Save'
                className={cx(style.saveBtn, buttonStyle.btn)} />
        </div>
    ) : null;
}

export default DeleteSaveBtns;
