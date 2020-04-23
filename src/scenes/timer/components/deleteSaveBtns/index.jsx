import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import {
    setHasUnsavedActivityRecord,
} from '../../../../redux/actions';

import {
    Btn,
} from '../../../../components';

import style from './style/style.module.scss';

function DeleteSaveBtns() {
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);
    const dispatch = useDispatch();

    function callback(url) {
        axios.post(url).then((response) => {
            if (response.data.code === 'success') {
                dispatch(setHasUnsavedActivityRecord(false));
            } else {
                console.error('problem deleting or saving activity');
            }
        });
    }

    return hasUnsavedActivityRecord ? (
        <div className={style.deleteSaveBtns}>
            <Btn
                callback={() => callback('api/delete-activity-record')}
                text='Delete'
                className={style.deleteBtn} />
            <Btn
                callback={() => callback('api/save-activity')}
                text='Save'
                className={style.saveBtn} />
        </div>
    ) : null;
}

export default DeleteSaveBtns;
