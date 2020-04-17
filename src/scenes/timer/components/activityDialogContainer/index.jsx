import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    setActivityDialogDisplayed,
} from '../../../../redux/actions';

import {
    ActivityDialog,
} from './components';

import {
    activityDialogContainer,
} from './style/style.module.scss';

function ActivityDialogContainer() {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);
    const dispatch = useDispatch();

    const wrapperRef = useRef(null);

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

    return activityDialogDisplayed
        ? <div ref={wrapperRef} className={activityDialogContainer}><ActivityDialog /></div>
        : null;
}

export default ActivityDialogContainer;
