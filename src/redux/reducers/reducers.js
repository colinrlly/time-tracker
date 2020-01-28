import { combineReducers } from 'redux';
import recordsRangeReducer from './recordsRangeReducer';
import recordsListReducer from './recordsListReducer';
import activityNamesReducer from './activityNamesReducer';
import aggregationsReducer from './aggregationsReducer';

/**
 * Combines all the app's reducers into a single reducer.
 */
const reducers = combineReducers({
    range: recordsRangeReducer,
    list: recordsListReducer,
    names: activityNamesReducer,
    aggregations: aggregationsReducer,
});

export default reducers;
