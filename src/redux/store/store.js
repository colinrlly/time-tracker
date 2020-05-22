import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducers from '../reducers/reducers';

/**
 * Creates a store from the redux reducers as well as initializes the chrome
 * redux dev tools.
 */
export default createStore(
    reducers,
    composeWithDevTools(
        applyMiddleware(thunkMiddleware),
    ),
);
