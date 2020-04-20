import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import {
    setActivityDialogDisplayed,
    setNewActivityName,
    setNewActivityColor,
    setAllActivitiesList,
} from '../../../../redux/actions';

import {
    ActivityDialog,
} from './components';

function ActivityDialogContainer() {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);
    const newActivityName = useSelector((state) => state.activityDialog.newActivityName);
    const newActivityColor = useSelector((state) => state.activityDialog.newActivityColor);
    const allActivitiesList = useSelector((state) => state.allActivitiesList);
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

    function newColorBtnCallback(colorId) {
        dispatch(setNewActivityColor(colorId));
    }

    function saveNewActivityCallback() {
        axios.post('api/create-activity', {
            name: newActivityName,
            color: newActivityColor,
        }).then((response) => {
            if (response.data.code === 'success') {
                dispatch(setActivityDialogDisplayed(false));
                dispatch(setAllActivitiesList([
                    ...allActivitiesList,
                    {
                        id: response.data.activity_id,
                        name: newActivityName,
                        color: newActivityColor,
                    },
                ]));
                dispatch(setNewActivityName(''));
                dispatch(setNewActivityColor(1));
            } else if (response.data.code === 'empty') {
                window.alert('New activity name cannot be empty.');
            } else if (response.data.code === 'duplicate') {
                window.alert('New activity name cannot be a duplicate.');
            } else {
                console.error('problem saving activity');
            }
        });
    }

    return activityDialogDisplayed
        ? <div ref={wrapperRef}>
            <ActivityDialog
                exitBtnCallback={exitBtnCallback}
                activityNameInputCallback={newActivityNameInputCallback}
                activityName={newActivityName}
                colorBtnCallback={newColorBtnCallback}
                selectedColor={newActivityColor}
                submitCallback={saveNewActivityCallback} />
        </div>
        : null;
}

export default ActivityDialogContainer;
