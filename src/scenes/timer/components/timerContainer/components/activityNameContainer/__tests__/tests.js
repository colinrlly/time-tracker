import React from 'react';
import {
    render,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ActivityNameContainer from '../index.jsx';

const mockStore = configureStore([]);

describe('ActivityNameContainer', () => {
    it('Passes currentActivity from Redux to children components.', () => {
        const store = mockStore({
            currentActivity: {
                name: 'test activity',
                color: 5,
            },
            activityIsRunning: true,
            hasUnsavedActivityRecord: false,
        });

        const { getByText } = render(
            <Provider store={store}>
                <ActivityNameContainer />
            </Provider>,
        );

        expect(getByText('test activity')).toBeTruthy();
    });

    it('Renders currentActivity according to activityIsRunning.', () => {
        let store = mockStore({
            currentActivity: {
                name: 'test activity',
                color: 5,
            },
            activityIsRunning: false,
            hasUnsavedActivityRecord: false,
        });

        const { queryByText } = render(
            <Provider store={store}>
                <ActivityNameContainer />
            </Provider>,
        );

        expect(queryByText('test activity')).toBeNull();

        store = mockStore({
            currentActivity: {
                name: 'test activity',
                color: 5,
            },
            activityIsRunning: true,
            hasUnsavedActivityRecord: false,
        });

        const { getByText } = render(
            <Provider store={store}>
                <ActivityNameContainer />
            </Provider>,
        );

        expect(getByText('test activity')).toBeTruthy();
    });
});
