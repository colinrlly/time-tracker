import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import {
    setActivityDialogDisplayed,
    setNewActivityName,
    setNewActivityColor,
    setEditActivityName,
    setEditActivityColor,
} from '../../../../redux/actions';

import {
    ActivityDialog,
} from './components';

function ActivityDialogContainer() {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);
    const newActivityName = useSelector((state) => state.activityDialog.newActivityName);
    const newActivityColor = useSelector((state) => state.activityDialog.newActivityColor);
    const newOrEditDialog = useSelector((state) => state.activityDialog.newOrEditDialog);
    const editActivityName = useSelector((state) => state.activityDialog.editActivityName);
    const editActivityColor = useSelector((state) => state.activityDialog.editActivityColor);
    const editActivityId = useSelector((state) => state.activityDialog.editActivityId);
    const currentActivity = useSelector((state) => state.currentActivity);
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

    /**
     * New activity dialog callbacks.
     */
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
            if (response.data.code === 'empty') {
                window.alert('New activity name cannot be empty.');
            } else if (response.data.code === 'duplicate') {
                window.alert('New activity name cannot be a duplicate.');
            } else if (response.data.code !== 'success') {
                console.error('problem saving activity');
            }
        });
    }

    /**
     * Edit activity dialog callbacks.
     */
    function editActivityNameInputCallback(event) {
        dispatch(setEditActivityName(event.target.value));
    }

    function editColorBtnCallback(colorId) {
        dispatch(setEditActivityColor(colorId));
    }

    function saveEditActivityCallback() {
        axios.post('api/edit-activity', {
            activity_id: editActivityId,
            new_name: editActivityName,
            new_color: editActivityColor,
        }).then((response) => {
            if (response.data.code === 'empty') {
                window.alert('Activity name cannot be empty.');
            } else if (response.data.code === 'duplicate') {
                window.alert('Activity name cannot be a duplicate.');
            } else if (response.data.code !== 'success') {
                console.error('Problem editing activity');
            }
        });
    }

    function deleteActivityCallback() {
        axios.post('api/delete-activity', {
            activity_id: editActivityId,
        }).then((response) => {
            if (response.data.code !== 'success') {
                console.error('Problem deleting activity');
            }
        });
    }

    return activityDialogDisplayed
        ? <div ref={wrapperRef}>
            <ActivityDialog
                exitBtnCallback={exitBtnCallback}
                activityNameInputCallback={(newOrEditDialog === 'new') ? newActivityNameInputCallback : editActivityNameInputCallback}
                activityName={(newOrEditDialog === 'new') ? newActivityName : editActivityName}
                colorBtnCallback={(newOrEditDialog === 'new') ? newColorBtnCallback : editColorBtnCallback}
                selectedColor={(newOrEditDialog === 'new') ? newActivityColor : editActivityColor}
                submitCallback={(newOrEditDialog === 'new') ? saveNewActivityCallback : saveEditActivityCallback}
                submitText={(newOrEditDialog === 'new') ? 'Add' : 'Save'}
                showDelete={(newOrEditDialog === 'edit')}
                deleteActivityCallback={deleteActivityCallback}
                currentActivity={currentActivity} />
        </div>
        : null;
}

export default ActivityDialogContainer;
