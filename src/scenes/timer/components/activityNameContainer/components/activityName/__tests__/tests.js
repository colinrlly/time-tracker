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
                hasUnsavedActivityRecord={false} />,
        );

        expect(getByText('test name')).toBeTruthy();
    });
});
