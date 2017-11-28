export function seriesStats(data) {
    if (data.length == 0) {
        return {
            mean: 0,
            stdev: 0
        }
    }
    var mean = data.reduce((a, b) => a + b) / data.length;
    var stdev = data.length > 1 && Math.sqrt(data.map(x => x - mean).map(x => x * x).reduce((a, b) => a + b) / (data.length - 1)) || 0;
    return {mean, stdev};
}
