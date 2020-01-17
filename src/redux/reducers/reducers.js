import recordsRangeReducer from './recordsRangeReducer';
import recordListReducer from './recordListReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
    range: recordsRangeReducer,
    list: recordListReducer
});

export default reducers;
