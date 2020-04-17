import React from 'react';
import {
    render,
    fireEvent,
} from '@testing-library/react';

import ActivityList from '../index.jsx';

const ACTIVITY_LIST = [
    {
        name: 'ac1',
        color: 5,
    },
    {
        name: 'ac2',
        color: 7,
    },
    {
        name: 'ac3',
        color: 1,
    },
];

describe('ActivityList', () => {
    it('Renders a button for each activity.', () => {
        const { getByText } = render(
            <ActivityList
                activities={ACTIVITY_LIST}
                handleActivityClick={() => { }}
                hasUnsavedActivityRecord={false}
                activityIsRunning={false}
                disabled={false} />,
        );

        expect(getByText(ACTIVITY_LIST[0].name)).toBeTruthy();
        expect(getByText(ACTIVITY_LIST[1].name)).toBeTruthy();
        expect(getByText(ACTIVITY_LIST[2].name)).toBeTruthy();
    });

    it('Calls the click handler when an activity is clicked.', () => {
        const mockCallback = jest.fn();

        const { getByText } = render(
            <ActivityList
                activities={ACTIVITY_LIST}
                handleActivityClick={mockCallback}
                hasUnsavedActivityRecord={false}
                activityIsRunning={false}
                disabled={false} />,
        );

        fireEvent.click(getByText(ACTIVITY_LIST[0].name));
        fireEvent.click(getByText(ACTIVITY_LIST[1].name));
        fireEvent.click(getByText(ACTIVITY_LIST[2].name));

        expect(mockCallback.mock.calls.length).toBe(3);

        expect(mockCallback.mock.calls[0][0]).toBe(ACTIVITY_LIST[0]);
        expect(mockCallback.mock.calls[1][0]).toBe(ACTIVITY_LIST[1]);
        expect(mockCallback.mock.calls[2][0]).toBe(ACTIVITY_LIST[2]);
    });

    it('Disables the buttons when disabled prop is true.', () => {
        const mockCallback = jest.fn();

        const { getByText } = render(
            <ActivityList
                activities={ACTIVITY_LIST}
                handleActivityClick={mockCallback}
                hasUnsavedActivityRecord={false}
                activityIsRunning={false}
                disabled={true} />,
        );

        fireEvent.click(getByText(ACTIVITY_LIST[0].name));
        fireEvent.click(getByText(ACTIVITY_LIST[1].name));
        fireEvent.click(getByText(ACTIVITY_LIST[2].name));

        expect(mockCallback.mock.calls.length).toBe(0);
    });
});
