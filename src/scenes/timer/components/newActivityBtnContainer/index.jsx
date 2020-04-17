import React from 'react';
import { useDispatch } from 'react-redux';

import {
    setActivityDialogDisplayed,
} from '../../../../redux/actions';

import {
    NewActivityBtn,
} from './components';

function NewActivityBtnContainer() {
    const dispatch = useDispatch();

    function callback() {
        dispatch(setActivityDialogDisplayed(true));
    }

    return <NewActivityBtn callback={callback} />;
}

export default NewActivityBtnContainer;
