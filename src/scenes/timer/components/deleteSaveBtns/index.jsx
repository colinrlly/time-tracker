import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import {
    Btn,
} from './components';

function DeleteSaveBtns() {
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);

    function deleteCallback() {
        axios.post('api/delete-activity-record');
    }

    function saveCallback() {
        axios.post('api/save-activity');
    }

    return hasUnsavedActivityRecord ? (
        <div>
            <Btn callback={deleteCallback} text='Delete' />
            <Btn callback={saveCallback} text='Save' />
        </div>
    ) : null;
}

export default DeleteSaveBtns;
