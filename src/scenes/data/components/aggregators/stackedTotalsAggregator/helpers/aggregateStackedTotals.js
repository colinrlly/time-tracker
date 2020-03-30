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

                if (intersectedRange) {
                    if (!stack.totals[event.summary]) {
                        stack.totals[event.summary] = {
                            duration: 0,
                            colorId: event.colorId,
                        };
                    }

                    additionalDuration = intersectedRange.end.diff(intersectedRange.start, 'minutes');

                    stack.totals[event.summary].duration += additionalDuration;
                }
            }
        }
    }

    return stacks;
}

function stackTotalsToArray(stacks) {
    const stacksCpy = JSON.parse(JSON.stringify(stacks));

    let arrayTotals;
    let keys;
    let totals;
    let total;

    for (let i = 0; i < stacks.length; i += 1) {
        arrayTotals = [];
        keys = Object.keys(stacks[i].totals);
        totals = stacks[i].totals;

        for (let j = 0; j < keys.length; j += 1) {
            total = totals[keys[j]];

            arrayTotals.push({
                name: keys[j],
                duration: total.duration,
                colorId: total.colorId,
            });
        }

        stacksCpy[i].totals = arrayTotals;
    }

    return stacksCpy;
}

function aggregateStackedTotals(events, startDateTime, endDateTime, names, interval, numIntervals) {
    const stacks = rangeToStacks(interval, numIntervals, startDateTime, endDateTime);

    const populatedStacks = populateStacks(events, stacks, names);

    const stacksWithArrayTotals = stackTotalsToArray(populatedStacks);

    return stacksWithArrayTotals;
}

export default aggregateStackedTotals;
