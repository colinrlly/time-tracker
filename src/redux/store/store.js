import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore } from 'redux';
import reducers from '../reducers/reducers';

/**
 * Creates a store from the redux reducers as well as initializes the chrome
 * redux dev tools.
 */
export default createStore(
    reducers,
    composeWithDevTools(),
);
