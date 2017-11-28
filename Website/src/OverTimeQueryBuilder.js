import React from 'react';
import {Link} from 'react-router';
import Dropdown from 'react-dropdown';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import './querybuilder.css';
import getScreenData from './ScreenDataProvider.js';
import ApiRequest from './ApiRequest.js';

var screenData = null;
var calculatedAttributes = null;

var shakeLabels = {
    'xLow': 'X-Axis Low',
    'xHigh': 'X-Axis High',
    'yLow': 'Y-Axis Low',
    'yHigh': 'Y-Axis High',
    'zLow': 'Z-Axis Low',
    'zHigh': 'Z-Axis High'
};

var shakeOptions = Object.keys(shakeLabels).map(key => ({
    value: key,
    label: shakeLabels[key]
}));

var ensureScreenData = (() => {
    var callbacks = null;
    return (callback) => {
        if (callbacks) {
            callbacks.push(callback);
            return false;
        } else if (screenData === null) {
            callbacks = [callback];
            getScreenData((screens, status) => {
                if (status < 400) {
                    screenData = {};
                    for (var screen of screens) {
                        screenData[screen.data.id] = screen;
                    }
                    var _cbs = callbacks;
                    callbacks = null;
                    for (var cb of _cbs) {
                        cb();
                    }
                } else {
                    alert(screens.msg);
                    window.location.reload();
                }
            });
            return false;
        }
        return true;
    };
})();

var ensureCalculatedAttributes = (() => {
    var callbacks = null;
    return (callback) => {
        if (callbacks) {
            callbacks.push(callback);
        } else if (calculatedAttributes === null) {
            callbacks = [callback];
            new ApiRequest('GET', '/calculated-attributes-list').send((res, data) => {
                if (res.status < 400) {
                    calculatedAttributes = data;
                    var _cbs = callbacks;
                    callbacks = null;
                    for (var cb of _cbs) {
                        cb();
                    }
                } else {
                    alert(data.msg);
                    window.location.reload();
                }
            });
            return false;
        }
        return true;
    }
})();

var builders = {
    'mood': (handler, reload, config) => {
        config.source_id = '1';
        return null;
    },
    'shake': (handler, reload, config, state) => {
        return (
            <td>
                <Dropdown value={state.field} options={shakeOptions} placeholder='Field' onChange={field => {
                    state.field = field;
                    handler({source_id: field.value});
                }}/>
            </td>
        )
    },
    'screen-answer': (handler, reload, config, state) => {
        ensureScreenData(reload);
        return [
            <td>
                <Dropdown value={state.screen} options={Object.keys(screenData || {}).map(id => ({
                    value: id,
                    label: screenData[id].data.name
                }))} placeholder='Screen' onChange={screen => {
                    state.screen = screen;
                    delete state.question;
                    screenData[screen.value].getQuestions((questions, status) => {
                        if (status < 400) {
                            state.questions = questions;
                            reload();
                        } else {
                            alert(questions.msg);
                            window.location.reload();
                        }
                    });
                    handler({source_id: undefined});
                }}/>
            </td>,
            <td>
                <Dropdown value={state.question} options={(state.questions || []).map(question => ({
                    value: question.id,
                    label: question.text
                }))} placeholder='Question' onChange={question => {
                    state.question = question;
                    handler({source_id: question.value});
                }}/>
            </td>
        ];
    },
    'calculated-attribute': (handler, reload, config, state) => {
        ensureCalculatedAttributes(reload);
        return (
            <td>
                <Dropdown value={state.attribute} options={(calculatedAttributes || []).map(attribute => ({
                    label: attribute.name,
                    value: attribute.id
                }))} placeholder='Attribute' onChange={attribute => {
                    state.attribute = attribute;
                    handler({source_id: attribute.value});
                }}/>
            </td>
        )
    }
};

var stateGenerators = {
    'mood': () => {},
    'shake': (config, state, reload) => {
        state.field = {
            value: config.source_id,
            label: shakeLabels[config.source_id]
        }
    },
    'screen-answer': (config, state, reload) => {
        var func = () => {
            new ApiRequest('GET', '/screen-question-lookup?id=' + config.source_id).send((res, data) => {
                var screen = screenData[data.screen];
                state.screen = {
                    label: screen.data.name,
                    value: data.screen
                };
                screen.getQuestions((questions, status) => {
                   state.questions = questions;
                   state.question = {
                       label: questions.filter(question => question.id === config.source_id)[0].text,
                       value: config.source_id
                   };
                   reload();
                });
            });
        };
        ensureScreenData(func) && func();
    },
    'calculated-attribute': (config, state, reload) => {
        var func = () => {
            state.attribute = {
                label: calculatedAttributes.filter(obj => obj.id === config.source_id)[0].name,
                value: config.source_id
            };
            reload();
        };
        ensureCalculatedAttributes(func) && func();
    }
};

var typeLabels = {
    'mood': 'Mood',
    'shake': 'Shake Data',
    'screen-answer': 'Screen Answer',
    'calculated-attribute': 'Calculated Attribute'
};

var typeOptions = Object.keys(typeLabels).map(key => ({
    value: key,
    label: typeLabels[key]
}));

var Item = SortableElement(({config, state, reload, remove}) => (
    <table>
        <tbody>
            <tr>
                <td style={{width: '12em'}}>
                    <input type='text' style={{width: '10em', padding: '.5em'}} value={config.name} placeholder='Series Name' onChange={event => {
                        config.name = event.target.value;
                        reload();
                    }}/>
                </td>
                <td style={{minWidth: '12em'}}>
                    <Dropdown value={state.type} options={typeOptions} placeholder='Type' onChange={type => {
                        for (var field in config) {
                            if (field !== 'name') {
                                delete config[field];
                            }
                        }
                        for (var field in state) {
                            delete state[field];
                        }
                        config.source_type = type.value;
                        state.type = type;
                        reload();
                    }}/>
                </td>
                {config.source_type in builders ? builders[config.source_type](update => {
                    for (var field in update) {
                        config[field] = update[field];
                    }
                    reload();
                }, reload, config, state) : null}
                <td style={{width: '2em'}}>
                    <button className='closebtn' style={{fontSize: "28px"}}  onClick={remove}>&#xd7;</button>
                </td>
            </tr>
        </tbody>
    </table>
));

var List = SortableContainer(({items, reload}) => (
    <div>
        <table style={{width: '100%'}}>
            <thead>
                <tr>
                    <th style={{width: '12em'}}>Name</th>
                    <th colSpan={100}>Variable</th>
                </tr>
            </thead>
        </table>
        {items.map((series, index) => (
            <Item key={`item-${index}`} index={index} reload={reload} remove={() => {
                items.splice(index, 1);
                reload();
            }} {...series}/>
        ))}
    </div>
));

export default class OverTimeQueryBuilder extends React.Component {
    state = {
        series: [],
        config: this.props.config
    };

    reload = (() => this.setState({})).bind(this);

    render() {
        if (this.props.config !== this.state.config) {
            this.setState({
                config: this.props.config,
                series: this.props.config.series.map(series => {
                    var state = {
                        type: {
                            value: series.source_type,
                            label: typeLabels[series.source_type]
                        }
                    };
                    stateGenerators[series.source_type](series, state, this.reload);
                    return {
                        state,
                        config: series
                    };
                })
            });
            return null;
        }
        return (
            <div id="querybuilder">
                <List lockAxis='y' lockToContainerEdges={true} helperClass='sortableHelper' items={this.state.series} reload={this.reload} onSortEnd={({oldIndex, newIndex}) => {
                    this.setState({
                        series: arrayMove(this.state.series, oldIndex, newIndex)
                    });
                }}/>
                <div style={{marginTop: '1em'}}>
                    <button className="fancybtn" onClick={() => this.setState({
                        series: [
                            ...this.state.series,
                            {
                                state: {},
                                config: {
                                    name: ''
                                }
                            }
                        ]
                    })}>Add Series</button>
                    <button className='fancybtn' style={{marginLeft: '1em'}} onClick={() => {
                        this.props.close();
                        this.props.onChange({
                            type: 'over-time',
                            series: this.state.series.map(series => series.config).filter(config => config.source_type && config.name)
                        });
                    }}>Update Graph</button>
                </div>
            </div>
        );
    }
}
