import React, { Component } from 'react';

var moods = [/Very sad/i, /Sad/i, /Neutral/i, /Happy/i, /Very happy/i];

var interpreters = {
    measurement: text => {
        var value = parseFloat(text);
        return isNaN(value) ? undefined : value;
    },
    mood: text => {
        for (var i = 0; i < moods.length; ++i) {
            if (moods[i].test(text)) {
                return i + 1;
            }
        }
        return undefined;
    },
    shakeValue: text => {
        var value = parseInt(text);
        return isNaN(value) || value < 1 || value > 5 ? undefined : value;
    }
};

export default class ScreenAnswerEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    render() {
        return (
            <input value={this.state.value} onChange={event => {
                var value = this.props.answerBase ? interpreters[this.props.answerBase.type](event.target.value) : event.target.value;
                if (value !== undefined) {
                    this.setState({value: event.target.value});
                    this.props.onChange({
                        ...this.props.answerBase,
                        value
                    });
                }
            }}/>
        );
    }
};
