import {
    getIntervalFromRange,
} from '../../../helpers';

const WIDTH_PER_LETTER = 7;

function formatLabels(data, barWidth, range) {
    /**
     * Used to format the stacked bar chart labels when the range is day. Converts from
     * Tu 26 -> T 26 -> 26 based on the width of the bars.
     */
    const interval = getIntervalFromRange(range);

    if (interval === 'day') {
        const numLetters = (barWidth / WIDTH_PER_LETTER).toFixed(1);

        return data.map((x) => {
            let rangeBeginning = '';

            if (numLetters > 5) {
                rangeBeginning = x.rangeBeginning;
            } else if (numLetters >= 4) {
                rangeBeginning = `${x.rangeBeginning.substring(0, 1)} ${x.rangeBeginning.substring(3, 5)}`;
            } else if (numLetters < 4) {
                rangeBeginning = x.rangeBeginning.substring(3, 5);
            }

            return Object.assign(
                x,
                { rangeBeginning },
            );
        });
    }

    return data;
}

export default formatLabels;
