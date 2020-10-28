import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const EVENT_NAMES = {
    exercise: 5,
    work: 3,
    study: 2,
    social: 1,
};

function fakeDataGenerator(rangeStart, rangeEnd) {
    const rangeStartMoment = moment(rangeStart);
    const rangeEndMoment = moment(rangeEnd);

    const range = moment.range(rangeStartMoment, rangeEndMoment);

    const events = [];

    Object.keys(EVENT_NAMES).forEach((eventName) => {
        for (let i = 0; i < Math.floor(Math.random() * 10); i += 1) {
            const subtractedDays = Math.floor(Math.random() * range.diff('days'));
            const subtractedHours = Math.floor(Math.random() * 12);
            const minutesDifference = Math.floor(Math.random() * 60);

            events.push({
                end: {
                    moment: moment(rangeEndMoment).subtract(subtractedDays, 'days').subtract(subtractedHours, 'hours'),
                },
                start: {
                    moment: moment(rangeEndMoment).subtract(subtractedDays, 'days').subtract(subtractedHours, 'hours').subtract(minutesDifference, 'minutes'),
                },
                summary: eventName,
                colorId: EVENT_NAMES[eventName],
                inActivities: true,
            });
        }
    });

    return events;
}

export default fakeDataGenerator;
