import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import moment from 'moment';

import {
    utcNow,
} from '../../helpers';
import * as actions from '../../redux/actions';

const socket = io.connect();

function Socket() {
    const allActivitiesList = useSelector((state) => state.allActivitiesList);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('update', (message) => {
            switch (message.type) {
                case 'stopped_activity':
                    dispatch(actions.setActivityIsRunning(false));
                    dispatch(actions.setHasUnsavedActivityRecord(true));
                    dispatch(actions.setLastActivityStopTime(moment(message.stop_time)));
                    break;

                case 'started_activity':
                    dispatch(actions.setCurrentActivity(message.activity));
                    dispatch(actions.setActivityIsRunning(true));
                    dispatch(actions.setLastActivityStartTime(utcNow()));
                    break;

                case 'saved_activity':
                    dispatch(actions.setHasUnsavedActivityRecord(false));
                    break;

                case 'deleted_activity_record':
                    dispatch(actions.setHasUnsavedActivityRecord(false));
                    break;

                case 'created_activity':
                    dispatch(actions.setActivityDialogDisplayed(false));
                    dispatch(actions.setAllActivitiesList([
                        ...allActivitiesList,
                        {
                            id: message.activity.id,
                            name: message.activity.name,
                            color: message.activity.color,
                        },
                    ]));
                    dispatch(actions.setNewActivityName(''));
                    dispatch(actions.setNewActivityColor(1));
                    break;

                case 'edited_activity':
                    dispatch(actions.setActivityDialogDisplayed(false));
                    dispatch(actions.setAllActivitiesList(allActivitiesList.map(
                        (activity) => ((activity.id === message.edited_activity.id)
                            ? {
                                id: activity.id,
                                name: message.edited_activity.name,
                                color: message.edited_activity.color,
                            } : activity
                        ),
                    )));
                    dispatch(actions.setEditActivityName(''));
                    dispatch(actions.setEditActivityColor(1));
                    dispatch(actions.setEditActivityId(-1));
                    break;

                case 'deleted_activity':
                    dispatch(actions.setActivityDialogDisplayed(false));
                    dispatch(actions.setAllActivitiesList(allActivitiesList.filter(
                        (activity) => (!(activity.id === message.activity_id)),
                    )));
                    dispatch(actions.setEditActivityName(''));
                    dispatch(actions.setEditActivityColor(1));
                    dispatch(actions.setEditActivityId(-1));
                    break;

                default:
                    break;
            }
        });

        return () => socket.off('update');
    }, [allActivitiesList]);

    return (null);
}

export default Socket;
