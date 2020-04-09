import React from 'react';
import { render } from '@testing-library/react';
import moment from 'moment';
import { act } from 'react-dom/test-utils';

import TimerText from '../index.jsx';

jest.useFakeTimers();

describe('TimerText', () => {
    it('Displays 00:00:00 when props.runningActivity is false.', () => {
        const { container } = render(
            <TimerText
                lastActivityStartTime={moment().subtract(1, 'hour')}
                runningActivity={false} />,
        );

        expect(container.textContent).toBe('00:00:00');
    });

    it('Starts counting up from lastActivityStartTime difference.', () => {
        const { container } = render(
            <TimerText
                lastActivityStartTime={moment().subtract(5, 'hours')}
                runningActivity={true} />,
        );

        expect(container.textContent).toBe('05:00:00');

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(container.textContent).toBe('05:00:01');

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(container.textContent).toBe('05:00:02');
    });

    it('Displays days if the diff is larger than 24 hours.', () => {
        const { container } = render(
            <TimerText
                lastActivityStartTime={moment().subtract(1, 'day').subtract(1, 'hour')}
                runningActivity={true} />,
        );

        expect(container.textContent).toBe('01:01:00:00');

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(container.textContent).toBe('01:01:00:01');
    });
});
