import React, { Component } from 'react';
import { Scatter } from 'react-chartjs-2';
import ApiRequest from './ApiRequest.js';
import { seriesStats } from './StatsHelper.js';

var colorConfigs = [
    {
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)'
    },
    {
        backgroundColor: 'rgba(169, 15, 15,0.6)',
        borderColor: 'rgba(169, 15, 15, 1)',
        pointBorderColor: 'rgba(169, 15, 15, 1)',
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: 'rgba(169, 15, 15, 1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)'
    },
    {
        backgroundColor: 'rgba(13, 155, 77, 0.6)',
        borderColor: 'rgba(13, 155, 77, 1)',
        pointBorderColor: 'rgba(13, 155, 77, 1)',
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: 'rgba(13, 155, 77, 1)',
        pointHoverBorderColor: 'rgba(13, 155, 77, 1)'
    }
];

function renderValue(value) {
    switch (value.type) {
        case 'measurement':
            return `${value.value.toFixed(2)} ${value.units}`;
        case 'mood':
            return [
                'Very sad',
                'Sad',
                'Neutral',
                'Happy',
                'Very happy'
            ][value.value - 1];
        case 'shakeValue':
            return '' + value.value;
        default:
            return JSON.stringify(value.value);
    }
}

export default class QueryGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {datasets: []},
            raw: {
                config: {
                    type: 'over-time',
                    series: []
                },
                results: []
            }
        };
        this.state.options = this.getOpts();
    }

    getOpts() {
        var xCoords = this.state.data.datasets.map(set => set.data).reduce((a, b) => a.concat(b), []).map(point => point.x);
        return {
            scales: {
                xAxes: [
                    {
                        ticks: {
                            userCallback: (label, index, labels) => new Date(label * 86400000).toLocaleDateString(),
                            suggestedMin: (xCoords.length ? Math.min(...xCoords) : Math.floor(new Date().valueOf() / 86400000)) - 1,
                            suggestedMax: (xCoords.length ? Math.max(...xCoords) : Math.ceil(new Date().valueOf() / 86400000)) + 1
                        },
                        scaleLabel: {
                            display: true,
                            fontSize: 24,
                            labelString: 'Date'
                        }
                    }
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            fontSize: 24,
                            labelString: 'Z-Score'
                        }
                    }
                ]
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {label: (tooltipItems, data) => `${new Date(tooltipItems.xLabel * 86400000).toLocaleDateString()}: ${renderValue(this.state.raw.result[tooltipItems.datasetIndex].results[tooltipItems.index].value)}`}
            }
        };
    }

    render() {
        if (this.props.query !== this.state.query) {
            var url = `/query?client=${this.props.query.clients.join()}&type=${this.props.query.type}&count=${this.props.query.series.length}${this.props.query.series.map((series, index) => Object.keys(series).map(field => `&${index}_${field}=${encodeURIComponent(series[field])}`).join('')).join('')}`;
            console.log(url);
            new ApiRequest('GET', url).send((res, data) => {
                console.log(data);
                this.setState({
                    query: this.props.query,
                    data: {datasets: []},
                    raw: data
                });
                this.setState({
                    data: {
                        datasets: (data.result || []).map((series, index) => {
                            var {mean, stdev} = seriesStats(series.results.map(point => point.value.value));
                            return {
                                label: `${series.name} (${series.client})`,
                                data: series.results.map(point => ({
                                    x: point.timestamp,
                                    y: stdev && (point.value.value - mean) / stdev || 0
                                })),
                                fill: false,
                                lineTension: 0.1,
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderWidth: 1,
                                pointHoverRadius: 10,
                                pointHoverBorderWidth: 2,
                                pointRadius: 4,
                                pointHitRadius: 15,
                                ...colorConfigs[index % colorConfigs.length]
                            };
                        })
                    }
                });
                this.setState({options: this.getOpts()});
            });
        }
        return (
            <Scatter data={this.state.data} options={this.state.options} />
        )
    }
}
