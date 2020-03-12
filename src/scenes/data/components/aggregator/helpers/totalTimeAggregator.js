function totalTimeAggregator(list) {
    let totalTime = 0;

    for (let i = 0; i < list.length; i += 1) {
        totalTime += list[i].duration;
    }

    return totalTime;
}

export default totalTimeAggregator;
