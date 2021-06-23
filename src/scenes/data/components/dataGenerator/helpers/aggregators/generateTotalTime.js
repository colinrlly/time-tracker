function generateTotalTime(filteredTotals) {
    let totalTime = 0;

    for (let i = 0; i < filteredTotals.length; i += 1) {
        totalTime += filteredTotals[i].duration;
    }

    return totalTime;
}

export default generateTotalTime;
