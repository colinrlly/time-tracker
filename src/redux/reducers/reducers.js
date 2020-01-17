import { combineReducers } from 'redux';
import recordsRangeReducer from './recordsRangeReducer';
import recordListReducer from './recordListReducer';


const reducers = combineReducers({
    range: recordsRangeReducer,
    list: recordListReducer,
});

export default reducers;
