import React from 'react';
import { render } from '@testing-library/react';
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
                activities={ACTIVITY_LIST} />,
        );

        expect(getByText(ACTIVITY_LIST[0].name)).toBeTruthy();
        expect(getByText(ACTIVITY_LIST[1].name)).toBeTruthy();
        expect(getByText(ACTIVITY_LIST[2].name)).toBeTruthy();
    });

    xit('Calls the click handler when an activity is clicked.', () => {

    });
});
