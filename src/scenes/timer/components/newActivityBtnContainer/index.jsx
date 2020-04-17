import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    setActivityDialogDisplayed,
} from '../../../../redux/actions';

import {
    NewActivityBtn,
} from './components';

function NewActivityBtnContainer() {
    const activityIsRunning = useSelector((state) => state.activityIsRunning);
    const hasUnsavedActivityRecord = useSelector((state) => state.hasUnsavedActivityRecord);
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);
    const dispatch = useDispatch();

    function callback() {
        dispatch(setActivityDialogDisplayed(true));
    }

    return (!activityIsRunning && !hasUnsavedActivityRecord)
        ? <NewActivityBtn callback={callback} disabled={activityDialogDisplayed} />
        : null;
}

export default NewActivityBtnContainer;
