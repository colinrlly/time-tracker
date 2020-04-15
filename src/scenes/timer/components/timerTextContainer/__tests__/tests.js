import React from 'react';
import {
    render,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import {
    utcNow,
} from '../../../helpers';

import TimerTextContainer from '../index.jsx';

const mockStore = configureStore([]);

describe('TimerTextContainer', () => {
    it('Passes lastActivityStartTime from Redux to children components.', () => {
        const store = mockStore({
            lastActivityStartTime: utcNow().subtract(1, 'hour'),
            activityIsRunning: true,
        });

        const { getByText } = render(
            <Provider store={store}>
                <TimerTextContainer />
            </Provider>,
        );

        expect(getByText('01:00:00')).toBeTruthy();
    });

    it('Passes activityIsRunning from Redux to children components.', () => {
        const store = mockStore({
            lastActivityStartTime: utcNow().subtract(1, 'hour'),
            activityIsRunning: false,
        });

        const { getByText } = render(
            <Provider store={store}>
                <TimerTextContainer />
            </Provider>,
        );

        expect(getByText('00:00:00')).toBeTruthy();
    });
});
