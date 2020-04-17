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

import ActivityDialogContainer from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');

describe('ActivityDialogContainer', () => {
    function setUp() {
        const store = mockStore({
            activityDialog:
                { displayed: true },
        });

        const { getByText } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        return {
            store,
            getByText,
        };
    }

    it('Displays itself when activityDialogDisplayed is true.', () => {
        const { getByText } = setUp();

        expect(getByText('hello there inside')).toBeTruthy();
    });

    it('Doesn\'t display itself when activityDialogDisplayed is false.', () => {
        const store = mockStore({
            activityDialog:
                { displayed: false },
        });

        const { queryByText } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(queryByText('hello there inside')).toBeNull();
    });

    // it('Hits the proper endpoints when the button is pressed.', () => {
    //     const {
    //         getByText,
    //     } = setUp();

    //     axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

    //     fireEvent.click(getByText('Stop'));
    //     expect(axios.post.mock.calls[0][0]).toBe('api/stop-activity');
    // });

    // it('Dispatches the proper Redux actions when buttons are clicked.', (done) => {
    //     const {
    //         store,
    //         getByText,
    //     } = setUp();

    //     axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success' } }));

    //     fireEvent.click(getByText('Stop'));

    //     const expectedActivityIsRunningAction = JSON.stringify({
    //         type: SET_ACTIVITY_IS_RUNNING,
    //         activityIsRunning: false,
    //     });
    //     const expectedHasUnsavedAction = JSON.stringify({
    //         type: SET_HAS_UNSAVED_ACTIVITY_RECORD,
    //         hasUnsavedActivityRecord: true,
    //     });

    //     setTimeout(() => {
    //         const actions = store.getActions();

    //         // Convert actions to JSON because array.includes doens't work on objects
    //         const jsonActions = actions.map((x) => JSON.stringify(x));

    //         expect(jsonActions.includes(expectedActivityIsRunningAction)).toBeTruthy();
    //         expect(jsonActions.includes(expectedHasUnsavedAction)).toBeTruthy();

    //         // Convert actions to just types to test for activity stop time
    //         const justTypes = actions.map((x) => x.type);

    //         expect(justTypes.includes(SET_LAST_ACTIVITY_STOP_TIME)).toBeTruthy();
    //         done();
    //     }, 1000);
    // });
});
