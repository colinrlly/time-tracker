import { combineReducers } from 'redux';
import recordsRangeReducer from './data/recordsRangeReducer';
import recordsListReducer from './data/recordsListReducer';
import activityNamesReducer from './data/activityNamesReducer';
import aggregationsReducer from './data/aggregationsReducer';
import allActivitiesListReducer from './timer/allActivitiesListReduces';
import currentActivityReducer from './timer/currentActivityReducer';
import activityIsRunningReducer from './timer/activityIsRunningReducer';
import lastActivityStartTimeReducer from './timer/lastActivityStartTimeReducer';
import hasUnsavedActivityRecordReducer from './timer/hasUnsavedActivityRecordReducer';
import lastActivityStopTimeReducer from './timer/lastActivityStopTimeReducer';
import activityDialogReducer from './timer/activityDialogReducer';

/**
 * Combines all the app's reducers into a single reducer.
 */
const reducers = combineReducers({
    range: recordsRangeReducer,
    activityRecords: recordsListReducer,
    names: activityNamesReducer,
    aggregations: aggregationsReducer,
    allActivitiesList: allActivitiesListReducer,
    currentActivity: currentActivityReducer,
    activityIsRunning: activityIsRunningReducer,
    lastActivityStartTime: lastActivityStartTimeReducer,
    hasUnsavedActivityRecord: hasUnsavedActivityRecordReducer,
    lastActivityStopTime: lastActivityStopTimeReducer,
    activityDialog: activityDialogReducer,
});

export default reducers;
