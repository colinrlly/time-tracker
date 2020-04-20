import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';

import {
    SET_ACTIVITY_DIALOG_DISPLAYED,
    SET_NEW_ACTIVITY_NAME,
    SET_NEW_ACTIVITY_COLOR,
} from '../../../../../redux/actions';

import ActivityDialogContainer from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');

describe('ActivityDialogContainer', () => {
    function setUp() {
        const store = mockStore({
            activityDialog:
            {
                displayed: true,
                newActivityName: '',
                newActivityColor: '1',
            },
        });

        const {
            getByText,
            container,
            getByLabelText,
            getByTestId,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        return {
            store,
            getByText,
            container,
            getByLabelText,
            getByTestId,
        };
    }

    it('Dispatches the proper redux actions when a color button is pressed.', (done) => {
        const {
            store,
            getByTestId,
        } = setUp();

        const colorBtn2 = getByTestId('colorBtn2');

        fireEvent.click(colorBtn2);

        const expectedAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_COLOR,
            newActivityColor: '2',
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doesn't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));
            expect(jsonActions.includes(expectedAction)).toBeTruthy();
            done();
        }, 1000);
    });

    it('Displays the proper newActivityName based on redux.', () => {
        const store = mockStore({
            activityDialog: {
                displayed: true,
                newActivityName: 'test name',
                newActivityColor: '1',
            },
        });

        const { getByLabelText } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(getByLabelText('activity-name-input').value).toBe('test name');
    });

    it('Dispatches the proper redux events when the input is changed.', (done) => {
        const {
            store,
            getByLabelText,
        } = setUp();

        const input = getByLabelText('activity-name-input');

        fireEvent.change(input, { target: { value: 'test name' } });

        const expectedAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_NAME,
            newActivityName: 'test name',
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doesn't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));
            expect(jsonActions.includes(expectedAction)).toBeTruthy();
            done();
        }, 1000);
    });

    it('Dispatches the proper redux events when the exit button is clicked.', (done) => {
        const {
            store,
            getByText,
        } = setUp();

        fireEvent.click(getByText('+'));

        const expectedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: false,
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doesn't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));
            expect(jsonActions.includes(expectedAction)).toBeTruthy();
            done();
        }, 1000);
    });

    it('Displays itself when activityDialogDisplayed is true.', () => {
        const { container } = setUp();

        expect(container.firstChild).toBeTruthy();
    });

    it('Doesn\'t display itself when activityDialogDisplayed is false.', () => {
        const store = mockStore({
            activityDialog: {
                displayed: false,
                newActivityName: 'test name',
                newActivityColor: '1',
            },
        });

        const { container } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        expect(container.firstChild).toBeNull();
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
