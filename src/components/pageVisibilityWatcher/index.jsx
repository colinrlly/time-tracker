import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    refresh,
} from '../../redux/actions';

function PageVisibilityWatcher() {
    const dispatch = useDispatch();

    function handleVisibilityChange() {
        if (!document.hidden) {
            dispatch(refresh());
        }
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    return (null);
}

export default PageVisibilityWatcher;
