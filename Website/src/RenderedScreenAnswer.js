import React, { Component } from 'react';

function renderUnits(units) {
    var fraction;
    var result = [];
    for (var i = 0; i < units.length; i++) {
        switch (units[i]) {
            case '-':
                result.push(<span>&nbsp;&middot;&nbsp;</span>);
                break;
            case '^':
                var exponent = '';
                i++;
                for (; i < units.length; i++) {
                    if (/^\d$/.test(units[i])) {
                        exponent += units[i];
                    } else {
                        break;
                    }
                }
                i--;
                result.push(<sup>{exponent}</sup>);
                break;
            case '/':
                if (fraction) {
                    result.push(<span>&nbsp;&frasl;&nbsp;</span>);
                } else {
                    fraction = result;
                    result = [];
                }
                break;
            default:
                result.push(units[i]);
                break;
        }
    }
    return fraction ? <span className='units'><sup>{fraction}</sup>&frasl;<sub>{result}</sub></span> : <span className='units'>{result}</span>;
}

var renderers = {
    measurement: answer => (
        <span>
            {'' + answer.value}&nbsp;
            {renderUnits(answer.units)}
        </span>
    ),
    mood: answer => (
        <span>
            {[
                'Very sad',
                'Sad',
                'Neutral',
                'Happy',
                'Very happy'
            ][answer.value - 1]}
        </span>
    ),
    shakeValue: answer => (
        <span>
            {'' + answer.value} out of 10
        </span>
    )
};

export default class RenderedScreenAnswer extends Component {
    render() {
        return this.props.value ? renderers[this.props.value.type](this.props.value) : null;
    }
};
