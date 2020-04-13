import React from 'react';
import {
    render,
} from '@testing-library/react';
import ActivityName from '../index.jsx';

describe('ActivityName', () => {
    it('Displays the activity name', () => {
        const { getByText } = render(
            <ActivityName
                name={'test name'}
                activityIsRunning={true} />,
        );

        expect(getByText('test name')).toBeTruthy();
    });

    it('Doesn\'t show when activityIsRunning is false', () => {
        const { queryByText } = render(
            <ActivityName
                name={'test name'}
                activityIsRunning={false} />,
        );

        expect(queryByText('test name')).toBeNull();
    });
});
