import React from 'react';
import {
    render,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';

import {
    utcNow,
} from '../../../../../helpers';

import {
    SET_ALL_ACTIVITIES_LIST,
    SET_CURRENT_ACTIVITY,
    SET_ACTIVITY_IS_RUNNING,
    SET_LAST_ACTIVITY_START_TIME,
} from '../../../../../redux/actions';

import StartupPayloadFetcher from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');

const TEST_API_DATA = {
    data: {
        activities: [
            {
                name: 'Games',
                color: 9,
            },
        ],
        current_activity: {
            name: 'Games',
            color: 9,
        },
        running_activity: false,
        start_time: utcNow().format(),
    },
};

describe('startupPayloadFetcher', () => {
    let store;

    beforeAll(() => {
        axios.post.mockResolvedValue(TEST_API_DATA);

        store = mockStore({});

        render(
            <Provider store={store}>
                <StartupPayloadFetcher />
            </Provider>,
        );
    });

    it('Calls the API', async () => {
        expect(axios.post.mock.calls[0][0]).toBe('/api/timer_startup_payload');
    });

    it('Dispatches the proper redux actions.', () => {
        const actions = store.getActions();
        const jsonActivities = actions.map((x) => JSON.stringify(x));
        const justTypes = actions.map((x) => x.type);

        expect(jsonActivities.includes(JSON.stringify({
            type: SET_ALL_ACTIVITIES_LIST,
            activities: TEST_API_DATA.data.activities,
        }))).toBeTruthy();
        expect(jsonActivities.includes(JSON.stringify({
            type: SET_CURRENT_ACTIVITY,
            currentActivity: TEST_API_DATA.data.current_activity,
        }))).toBeTruthy();
        expect(jsonActivities.includes(JSON.stringify({
            type: SET_ACTIVITY_IS_RUNNING,
            activityIsRunning: TEST_API_DATA.data.running_activity,
        }))).toBeTruthy();
        expect(justTypes.includes(SET_LAST_ACTIVITY_START_TIME)).toBeTruthy();
    });
});
