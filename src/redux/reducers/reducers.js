import { combineReducers } from 'redux';
import recordsRangeReducer from './data/recordsRangeReducer';
import recordsListReducer from './data/recordsListReducer';
import activityNamesReducer from './data/activityNamesReducer';
import aggregationsReducer from './data/aggregationsReducer';
import allActivitiesListReducer from './timer/allActivitiesListReduces';

/**
 * Combines all the app's reducers into a single reducer.
 */
const reducers = combineReducers({
    range: recordsRangeReducer,
    list: recordsListReducer,
    names: activityNamesReducer,
    aggregations: aggregationsReducer,
    allActivitiesList: allActivitiesListReducer,
});

export default reducers;
