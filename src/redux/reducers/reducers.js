import { combineReducers } from 'redux';
import recordsRangeReducer from './recordsRangeReducer';
import recordsListReducer from './recordsListReducer';

/**
 * Combines the recordsRangeReducer and recordListReducer into a single redux reducer.
 */
const reducers = combineReducers({
    range: recordsRangeReducer,
    list: recordsListReducer,
});

export default reducers;
