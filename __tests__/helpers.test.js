import { generateActivityNames } from '../src/scenes/data/components/activityListGenerator/helpers';

const list = [
    {
        end: {
            date: '2020-03-09',
            moment: '2020-03-12T15:31:13.343Z',
        },
        start: {
            date: '2020-03-08',
            moment: '2020-03-12T15:31:13.343Z',
        },
        summary: 'activity 2',
        colorId: '7',
        inActivities: false,
    },
    {
        end: {
            date: '2020-03-21',
            moment: '2020-03-12T15:31:13.343Z',
        },
        start: {
            date: '2020-03-08',
            moment: '2020-03-12T15:31:13.343Z',
        },
        summary: 'activity 1',
        colorId: '1',
        inActivities: false,
    },
];

const correctActvityNames = {
    'activity 1': { inActivities: false, colorId: '1', selected: false },
    'activity 2': { inActivities: false, colorId: '7', selected: false },
};

describe('activityListGenerator helpers', () => {
    it('Generates an object of activity names', () => {
        const activityNames = generateActivityNames(list);
        expect(activityNames).toMatchObject(correctActvityNames);
    });

    it('Creates an empty object when list is empty', () => {
        const activityNames = generateActivityNames([]);
        expect(activityNames).toMatchObject({});
    });
});
