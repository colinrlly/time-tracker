import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';

import {
    SET_ACTIVITY_IS_RUNNING,
    SET_HAS_UNSAVED_ACTIVITY_RECORD,
    SET_LAST_ACTIVITY_STOP_TIME,
} from '../../../../../redux/actions';

import StopBtnContainer from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');

describe('StopBtnContainer', () => {
    function setUp() {
        const store = mockStore({
            activityIsRunning: true,
        });

        const { getByText } = render(
            <Provider store={store}>
                <StopBtnContainer />
            </Provider>,
        );

        return {
            store,
            getByText,
        };
    }

    it('Displays itself when activityIsRunning is true.', () => {
        const { getByText } = setUp();

        expect(getByText('Stop')).toBeTruthy();
    });

    it('Doesn\'t display itself when activityIsRunning is false.', () => {
        const store = mockStore({
            activityIsRunning: false,
        });

        const { queryByText } = render(
            <Provider store={store}>
                <StopBtnContainer />
            </Provider>,
        );

        expect(queryByText('Stop')).toBeNull();
    });

    it('Hits the proper endpoints when the button is pressed.', () => {
        const {
            getByText,
        } = setUp();

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Stop'));
        expect(axios.post.mock.calls[0][0]).toBe('api/stop-activity');
    });

    it('Dispatches the proper Redux actions when buttons are clicked.', (done) => {
        const {
            store,
            getByText,
        } = setUp();

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

        fireEvent.click(getByText('Stop'));

        const expectedActivityIsRunningAction = JSON.stringify({
            type: SET_ACTIVITY_IS_RUNNING,
            activityIsRunning: false,
        });
        const expectedHasUnsavedAction = JSON.stringify({
            type: SET_HAS_UNSAVED_ACTIVITY_RECORD,
            hasUnsavedActivityRecord: true,
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doens't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));

            expect(jsonActions.includes(expectedActivityIsRunningAction)).toBeTruthy();
            expect(jsonActions.includes(expectedHasUnsavedAction)).toBeTruthy();

            // Convert actions to just types to test for activity stop time
            const justTypes = actions.map((x) => x.type);

            expect(justTypes.includes(SET_LAST_ACTIVITY_STOP_TIME)).toBeTruthy();
            done();
        }, 1000);
    });
});
