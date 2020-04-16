import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import {
    utcNow,
} from '../../../../../helpers';

import TimerText from '../index.jsx';

jest.useFakeTimers();

describe('TimerText', () => {
    it('Displays 00:00:00 when props.runningActivity is false.', () => {
        const { container } = render(
            <TimerText
                lastActivityStartTime={utcNow().subtract(1, 'hour')}
                runningActivity={false}
                lastActivityStopTime={utcNow()}
                hasUnsavedActivityRecord={false} />,
        );

        expect(container.textContent).toBe('00:00:00');
    });

    it('Starts counting up from lastActivityStartTime difference.', () => {
        const { container } = render(
            <TimerText
                lastActivityStartTime={utcNow().subtract(5, 'hours')}
                runningActivity={true}
                lastActivityStopTime={utcNow()}
                hasUnsavedActivityRecord={false} />,
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
                lastActivityStartTime={utcNow().subtract(1, 'day').subtract(1, 'hour')}
                runningActivity={true}
                lastActivityStopTime={utcNow()}
                hasUnsavedActivityRecord={false} />,
        );

        expect(container.textContent).toBe('01:01:00:00');

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(container.textContent).toBe('01:01:00:01');
    });

    it('Displays time difference if hasUnsavedActivityRecord is true.', () => {
        const { container } = render(
            <TimerText
                lastActivityStartTime={utcNow().subtract(2, 'hour')}
                lastActivityStopTime={utcNow().subtract(1, 'hour')}
                runningActivity={false}
                hasUnsavedActivityRecord={true} />,
        );

        expect(container.textContent).toBe('01:00:00');
    });
});
