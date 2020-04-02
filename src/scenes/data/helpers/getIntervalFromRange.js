import moment from 'moment';

function getIntervalFromRange(range) {
    const rangeDuration = range.endDateTime.diff(range.startDateTime);

    if (rangeDuration < moment.duration(1, 'days')) {
        return 'hour';
    }
    if (rangeDuration < moment.duration(2, 'weeks')) {
        return 'day';
    }
    if (rangeDuration < moment.duration(4, 'months')) {
        return 'week';
    }
    if (rangeDuration < moment.duration(2, 'years')) {
        return 'month';
    }

    return 'year';
}

export default getIntervalFromRange;
