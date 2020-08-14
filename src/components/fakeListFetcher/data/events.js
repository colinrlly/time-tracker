import moment from 'moment';

const events = [
    {
        end: {
            moment: moment('2020-08-07T10:15:00-06:00'),
        },
        start: {
            moment: moment('2020-08-07T08:31:00-06:00'),
        },
        summary: 'Ellen Art',
        colorId: 5,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-09T18:39:20-06:00'),
        },
        start: {
            moment: moment('2020-08-09T17:53:44-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-09T19:42:53-06:00'),
        },
        start: {
            moment: moment('2020-08-09T18:46:52-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-09T20:22:38-06:00'),
        },
        start: {
            moment: moment('2020-08-09T19:47:02-06:00'),
        },
        summary: 'Exercise',
        colorId: 3,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-09T21:49:20-06:00'),
        },
        start: {
            moment: moment('2020-08-09T20:30:42-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-09T22:30:00-06:00'),
        },
        start: {
            moment: moment('2020-08-09T22:00:00-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T08:24:28-06:00'),
        },
        start: {
            moment: moment('2020-08-10T08:07:48-06:00'),
        },
        summary: 'Reading',
        colorId: 1,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T10:03:27-06:00'),
        },
        start: {
            moment: moment('2020-08-10T09:27:04-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T11:05:02-06:00'),
        },
        start: {
            moment: moment('2020-08-10T10:03:32-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T11:41:54-06:00'),
        },
        start: {
            moment: moment('2020-08-10T11:05:09-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-10T11:58:42-06:00'),
        },
        start: {
            moment: moment('2020-08-10T11:41:57-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T14:13:10-06:00'),
        },
        start: {
            moment: moment('2020-08-10T12:02:53-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-10T15:36:26-06:00'),
        },
        start: {
            moment: moment('2020-08-10T14:13:12-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T17:12:00-06:00'),
        },
        start: {
            moment: moment('2020-08-10T15:42:02-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-10T20:25:42-06:00'),
        },
        start: {
            moment: moment('2020-08-10T18:07:24-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T21:41:18-06:00'),
        },
        start: {
            moment: moment('2020-08-10T20:37:34-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-10T22:18:47-06:00'),
        },
        start: {
            moment: moment('2020-08-10T22:05:54-06:00'),
        },
        summary: 'Reading',
        colorId: 1,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T08:14:06-06:00'),
        },
        start: {
            moment: moment('2020-08-11T07:21:49-06:00'),
        },
        summary: 'Reading',
        colorId: 1,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T08:42:00-06:00'),
        },
        start: {
            moment: moment('2020-08-11T08:23:13-06:00'),
        },
        summary: 'Exercise',
        colorId: 3,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T09:48:48-06:00'),
        },
        start: {
            moment: moment('2020-08-11T09:15:07-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T10:14:21-06:00'),
        },
        start: {
            moment: moment('2020-08-11T09:48:50-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-11T10:35:21-06:00'),
        },
        start: {
            moment: moment('2020-08-11T10:14:24-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T14:00:00-06:00'),
        },
        start: {
            moment: moment('2020-08-11T12:30:00-06:00'),
        },
        summary: 'Weekly code review w/ Colin',
        colorId: '1',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-11T12:30:40-06:00'),
        },
        start: {
            moment: moment('2020-08-11T10:50:42-06:00'),
        },
        summary: 'Log',
        colorId: 10,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T13:03:55-06:00'),
        },
        start: {
            moment: moment('2020-08-11T12:30:49-06:00'),
        },
        summary: 'Brother Projects',
        colorId: 4,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T13:14:27-06:00'),
        },
        start: {
            moment: moment('2020-08-11T13:10:35-06:00'),
        },
        summary: 'Brother Projects',
        colorId: 4,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T14:09:39-06:00'),
        },
        start: {
            moment: moment('2020-08-11T13:37:22-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T16:00:32-06:00'),
        },
        start: {
            moment: moment('2020-08-11T14:09:41-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-11T16:46:17-06:00'),
        },
        start: {
            moment: moment('2020-08-11T16:00:35-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-11T17:40:08-06:00'),
        },
        start: {
            moment: moment('2020-08-11T17:18:22-06:00'),
        },
        summary: 'Art',
        colorId: '3',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-11T22:30:00-06:00'),
        },
        start: {
            moment: moment('2020-08-11T18:11:00-06:00'),
        },
        summary: 'Magic',
        colorId: 1,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-12T10:41:58-06:00'),
        },
        start: {
            moment: moment('2020-08-12T09:50:30-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-12T12:03:07-06:00'),
        },
        start: {
            moment: moment('2020-08-12T10:42:01-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-12T13:17:41-06:00'),
        },
        start: {
            moment: moment('2020-08-12T12:03:09-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-12T13:54:20-06:00'),
        },
        start: {
            moment: moment('2020-08-12T13:25:16-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-12T15:30:01-06:00'),
        },
        start: {
            moment: moment('2020-08-12T13:54:21-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-12T16:00:00-06:00'),
        },
        start: {
            moment: moment('2020-08-12T15:30:00-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-12T16:33:43-06:00'),
        },
        start: {
            moment: moment('2020-08-12T15:57:37-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-12T18:17:14-06:00'),
        },
        start: {
            moment: moment('2020-08-12T16:33:47-06:00'),
        },
        summary: 'Art',
        colorId: '3',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-12T21:48:49-06:00'),
        },
        start: {
            moment: moment('2020-08-12T20:26:47-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-12T23:18:34-06:00'),
        },
        start: {
            moment: moment('2020-08-12T23:09:36-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-13T09:41:07-06:00'),
        },
        start: {
            moment: moment('2020-08-13T08:59:43-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-13T10:40:59-06:00'),
        },
        start: {
            moment: moment('2020-08-13T09:41:09-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-13T13:15:10-06:00'),
        },
        start: {
            moment: moment('2020-08-13T10:54:41-06:00'),
        },
        summary: 'Flatiron',
        colorId: '4',
        inActivities: false,
    },
    {
        end: {
            moment: moment('2020-08-13T14:53:55-06:00'),
        },
        start: {
            moment: moment('2020-08-13T13:15:14-06:00'),
        },
        summary: 'Games',
        colorId: 8,
        inActivities: true,
    },
    {
        end: {
            moment: moment('2020-08-13T15:32:57-06:00'),
        },
        start: {
            moment: moment('2020-08-13T15:10:50-06:00'),
        },
        summary: 'TV',
        colorId: 2,
        inActivities: true,
    },
];

export default events;
