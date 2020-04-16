import React from 'react';
import {
    render,
    fireEvent,
    cleanup,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';

import {
    SET_CURRENT_ACTIVITY,
    SET_ACTIVITY_IS_RUNNING,
    SET_LAST_ACTIVITY_START_TIME,
} from '../../../../../redux/actions';

import ActivityListContainer from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');

describe('ActivityListContainer', () => {
    const allActivitiesList = [
        {
            id: 54,
            name: 'Log',
            color: 10,
        },
        {
            id: 10,
            name: 'Games',
            color: 2,
        },
    ];

    function setUpActivityIsRunningFalse() {
        const store = mockStore({
            activityIsRunning: false,
            allActivitiesList,
        });

        const { getByText } = render(
            <Provider store={store}>
                <ActivityListContainer />
            </Provider>,
        );

        return {
            allActivitiesList,
            store,
            getByText,
        };
    }

    it('Tells the API to start an activity on activity click.', () => {
        const {
            getByText,
        } = setUpActivityIsRunningFalse();

        axios.post.mockImplementationOnce(() => Promise.resolve({ code: 'success' }));

        fireEvent.click(getByText('Log'));

        expect(axios.post.mock.calls[0][0]).toBe('api/start-activity');
        expect(axios.post.mock.calls[0][1]).toStrictEqual({ activity_id: 54 });
    });

    it('Dispatches proper Redux actions on activity click.', (done) => {
        const {
            store,
            getByText,
        } = setUpActivityIsRunningFalse();

        axios.post.mockImplementationOnce(() => Promise.resolve({ code: 'success' }));

        fireEvent.click(getByText('Log'));

        const expectedCurrentActivityAction = JSON.stringify({
            type: SET_CURRENT_ACTIVITY,
            currentActivity: allActivitiesList[0],
        });
        const expectedActivityIsRunning = JSON.stringify({
            type: SET_ACTIVITY_IS_RUNNING,
            activityIsRunning: true,
        });

        const expectedLastActivityStartTimeAction = SET_LAST_ACTIVITY_START_TIME;

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doens't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));

            // Test for just the lastActivityStartTime type because we won't be able
            // to match the moment object exactly.
            const justTypes = actions.map((x) => x.type);

            expect(jsonActions.includes(expectedCurrentActivityAction)).toBeTruthy();
            expect(jsonActions.includes(expectedActivityIsRunning)).toBeTruthy();
            expect(justTypes.includes(expectedLastActivityStartTimeAction)).toBeTruthy();
            done();
        }, 1000);
    });

    it('Renders activity list with proper activities from Redux.', () => {
        const {
            getByText,
        } = setUpActivityIsRunningFalse();

        expect(getByText(allActivitiesList[0].name)).toBeTruthy();
        expect(getByText(allActivitiesList[1].name)).toBeTruthy();
    });

    it('Doesn\'t render anything if activityIsRunning is true.', () => {
        const store = mockStore({
            activityIsRunning: true,
            allActivitiesList,
        });

        const { queryByText } = render(
            <Provider store={store}>
                <ActivityListContainer />
            </Provider>,
        );

        expect(queryByText(allActivitiesList[0].name)).toBeNull();
    });
});
