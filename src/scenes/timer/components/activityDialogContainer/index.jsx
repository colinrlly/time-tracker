import React from 'react';
import { useSelector } from 'react-redux';

import {
    ActivityDialog,
} from './components';

function ActivityDialogContainer() {
    const activityDialogDisplayed = useSelector((state) => state.activityDialog.displayed);

    return activityDialogDisplayed ? <ActivityDialog /> : null;
}

export default ActivityDialogContainer;
