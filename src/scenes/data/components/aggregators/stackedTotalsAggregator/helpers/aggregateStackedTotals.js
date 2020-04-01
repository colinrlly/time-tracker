import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

function rangeToStacks(interval, count, start, end) {
    const range = moment.range(start, end);

    const days = Array.from(range.by(interval));

    return days.map((m) => ({
        range: moment.rangeFromInterval(interval, count, m),
        totals: {},
    }));
}

function populateStacks(events, stacks, names) {
    const eventsCpy = JSON.parse(JSON.stringify(events));
    let stack;
    let event;
    let eventRange;
    let additionalDuration;
    let intersectedRange;

    for (let i = 0; i < stacks.length; i += 1) {
        stack = stacks[i];

        for (let j = 0; j < eventsCpy.length; j += 1) {
            event = eventsCpy[j];
            eventRange = moment.range(event.start.moment, event.end.moment);

            if (names[event.summary].selected) {
                intersectedRange = stack.range.intersect(eventRange);

                if (!stack.totals[event.summary]) {
                    stack.totals[event.summary] = 0;
                }

                if (intersectedRange) {
                    additionalDuration = intersectedRange.end.diff(intersectedRange.start, 'minutes') / 60;

                    stack.totals[event.summary] += additionalDuration;
                }
            }
        }
    }

    return stacks;
}

function formatStacks(stacks, interval) {
    let range;

    return stacks.map((stack) => {
        switch (interval) {
            case 'hour':
                range = stack.range.start.format('H');
                break;

            case 'day':
                range = stack.range.start.format('D');
                break;

            case 'week':
                range = stack.range.start.format('M/D');
                break;

            case 'month':
                range = stack.range.start.format('MM/YYYY');
                break;

            case 'year':
                range = stack.range.start.format('YYYY');
                break;

            default:
                range = 'RANGE ERROR';
        }

        return {
            rangeBeginning: range,
            ...stack.totals,
        };
    });
}

function aggregateStackedTotals(events, startDateTime, endDateTime, names, interval, numIntervals) {
    const stacks = rangeToStacks(interval, numIntervals, startDateTime, endDateTime);

    const populatedStacks = populateStacks(events, stacks, names);

    const formattedStacks = formatStacks(populatedStacks, interval);

    return formattedStacks;
}

export default aggregateStackedTotals;
