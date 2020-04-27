import React from 'react';
import {
    render,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import MutationObserver from 'mutation-observer';

import {
    SET_HAS_UNSAVED_ACTIVITY_RECORD,
} from '../../../../../redux/actions';

import DeleteSaveButtons from '../index.jsx';

const mockStore = configureStore([]);
jest.mock('axios');
axios.post.mockImplementation(() => Promise.resolve({ data: { code: 'success' } }));
global.MutationObserver = MutationObserver;

describe('DeleteSaveBtns', () => {
    function setUpHasUnsavedActivityRecordTrue() {
        const store = mockStore({
            hasUnsavedActivityRecord: true,
        });

        const { getByText } = render(
            <Provider store={store}>
                <DeleteSaveButtons />
            </Provider>,
        );

        return {
            store,
            getByText,
        };
    }

    it('Displays itself when hasUnsavedActivityRecord is true in Redux.', () => {
        const {
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        expect(getByText('Delete')).toBeTruthy();
        expect(getByText('Save')).toBeTruthy();
    });

    it('Doesn\'t display itself when hasUnsavedActivityRecord is false in Redux.', () => {
        const store = mockStore({
            hasUnsavedActivityRecord: false,
        });

        const { queryByText } = render(
            <Provider store={store}>
                <DeleteSaveButtons />
            </Provider>,
        );

        expect(queryByText('Delete')).toBeNull();
        expect(queryByText('Save')).toBeNull();
    });

    it('Hits the proper endpoints when the buttons are clicked.', () => {
        const {
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        fireEvent.click(getByText('Delete'));
        expect(axios.post.mock.calls[0][0]).toBe('api/delete-activity-record');

        fireEvent.click(getByText('Save'));
        expect(axios.post.mock.calls[1][0]).toBe('api/save-activity');
    });

    it('Dispatches the proper Redux actions when save is clicked.', async () => {
        const {
            store,
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        fireEvent.click(getByText('Save'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedHasUnsavedAction = JSON.stringify({
            type: SET_HAS_UNSAVED_ACTIVITY_RECORD,
            hasUnsavedActivityRecord: false,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doens't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));

        expect(jsonActions.includes(expectedHasUnsavedAction)).toBeTruthy();
    });

    it('Dispatches the proper Redux actions when delete is clicked.', async () => {
        const {
            store,
            getByText,
        } = setUpHasUnsavedActivityRecordTrue();

        fireEvent.click(getByText('Delete'));

        await waitFor(() => expect(store.getActions()).not.toHaveLength(0));

        const expectedHasUnsavedAction = JSON.stringify({
            type: SET_HAS_UNSAVED_ACTIVITY_RECORD,
            hasUnsavedActivityRecord: false,
        });

        const actions = store.getActions();

        // Convert actions to JSON because array.includes doens't work on objects
        const jsonActions = actions.map((x) => JSON.stringify(x));

        expect(jsonActions.includes(expectedHasUnsavedAction)).toBeTruthy();
    });
});
