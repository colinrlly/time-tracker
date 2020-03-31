const WIDTH_PER_LETTER = 7;

function formatLabels(data, barWidth) {
    const numLetters = (barWidth / WIDTH_PER_LETTER).toFixed(1);

    return data.map((x) => ({
        name: `${x.name.substring(0, numLetters)}${x.name.length <= numLetters ? '' : '.'}`,
        duration: x.duration,
        colorId: x.colorId,
    }));
}

export default formatLabels;
