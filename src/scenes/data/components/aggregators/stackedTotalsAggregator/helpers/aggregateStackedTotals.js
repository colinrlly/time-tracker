import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

function rangeToArray(interval, count, start, end) {
    const range = moment.range(start, end);

    const days = Array.from(range.by('day'));

    return days.map((m) => moment.rangeFromInterval(interval, count, m));
}

function aggregateStackedTotals(events, startDateTime, endDateTime) {
    const intervals = rangeToArray('day', 1, startDateTime, endDateTime);

    
}

export default aggregateStackedTotals;
