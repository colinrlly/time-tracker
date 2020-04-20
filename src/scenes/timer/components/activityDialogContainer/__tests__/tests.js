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
    SET_ALL_ACTIVITIES_LIST,
} from '../../../../../redux/actions';

import ActivityDialogContainer from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');
window.alert = jest.fn();

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

    afterEach(() => {
        axios.post.mockClear();
        window.alert.mockClear();
    });

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

    it('Hits the proper endpoints when the save button is pressed.', () => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: '3',
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success', activity_id: 15 } }));

        fireEvent.click(getByText('Add'));

        expect(axios.post.mock.calls[0][0]).toBe('api/create-activity');
    });

    it('Dispatches the proper redux events when the save button is clicked.', (done) => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'test',
                newActivityColor: '3',
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'success', activity_id: 15 } }));

        fireEvent.click(getByText('Add'));

        const expectedDisplayedAction = JSON.stringify({
            type: SET_ACTIVITY_DIALOG_DISPLAYED,
            activityDialogDisplayed: false,
        });
        const expectedActivitiesListAction = JSON.stringify({
            type: SET_ALL_ACTIVITIES_LIST,
            activities: [
                ...allActivitiesList,
                {
                    id: 15,
                    name: 'test',
                    color: '3',
                },
            ],
        });
        const expectedNameAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_NAME,
            newActivityName: '',
        });
        const expectedColorAction = JSON.stringify({
            type: SET_NEW_ACTIVITY_COLOR,
            newActivityColor: '1',
        });

        setTimeout(() => {
            const actions = store.getActions();

            // Convert actions to JSON because array.includes doesn't work on objects
            const jsonActions = actions.map((x) => JSON.stringify(x));
            expect(jsonActions.includes(expectedDisplayedAction)).toBeTruthy();
            expect(jsonActions.includes(expectedActivitiesListAction)).toBeTruthy();
            expect(jsonActions.includes(expectedNameAction)).toBeTruthy();
            expect(jsonActions.includes(expectedColorAction)).toBeTruthy();
            done();
        }, 1000);
    });

    it('Dispatches the proper redux events when the activity name is empty.', (done) => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: '',
                newActivityColor: '10',
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'empty' } }));

        fireEvent.click(getByText('Add'));

        setTimeout(() => {
            expect(window.alert.mock.calls[0][0]).toBe('New activity name cannot be empty.');

            done();
        }, 1000);
    });

    it('Dispatches the proper redux events when the activity name is a duplicate.', (done) => {
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

        const store = mockStore({
            allActivitiesList,
            activityDialog:
            {
                displayed: true,
                newActivityName: 'Log',
                newActivityColor: '10',
            },
        });

        const {
            getByText,
        } = render(
            <Provider store={store}>
                <ActivityDialogContainer />
            </Provider>,
        );

        axios.post.mockImplementationOnce(() => Promise.resolve({ data: { code: 'duplicate' } }));

        fireEvent.click(getByText('Add'));

        setTimeout(() => {
            expect(window.alert.mock.calls[0][0]).toBe('New activity name cannot be a duplicate.');

            done();
        }, 1000);
    });
});
