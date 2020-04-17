import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    setActivityDialogDisplayed,
    setNewActivityName,
} from '../../../../redux/actions';

import {
    ActivityDialog,
} from './components';

function ActivityDialogContainer() {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);
    const newActivityName = useSelector((state) => state.activityDialog.newActivityName);
    const dispatch = useDispatch();

    const wrapperRef = useRef(null);

    // Handler for clicking outside the dialog.
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                dispatch(setActivityDialogDisplayed(false));
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    function exitBtnCallback() {
        dispatch(setActivityDialogDisplayed(false));
    }

    function newActivityNameInputCallback(event) {
        dispatch(setNewActivityName(event.target.value));
    }

    return activityDialogDisplayed
        ? <div ref={wrapperRef}>
            <ActivityDialog
                exitBtnCallback={exitBtnCallback}
                activityNameInputCallback={newActivityNameInputCallback}
                activityName={newActivityName} />
        </div>
        : null;
}

export default ActivityDialogContainer;
