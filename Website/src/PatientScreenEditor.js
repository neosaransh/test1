import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ApiRequest from './ApiRequest.js';
import getScreenData from './ScreenDataProvider.js';
import RenderedScreenAnswer from './RenderedScreenAnswer.js';
import ScreenAnswerEditor from './ScreenAnswerEditor.js';
import './PatientScreenEditor.css';

class PatientScreenEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {selected: false};
    }

    componentDidMount() {
        delete this.state.screens;
        this.setState({selected: false});
        getScreenData((screens, status) => {
            if (status < 400) {
                this.setState({screens});
            } else {
                alert(screens);
                this.props.history.push('/login');
            }
        });
    }

    render() {
        return this.state.screens ? (
            <Tabs style={this.props.style || {}}>
                <TabList>
                    <Tab>Available Screens</Tab>
                    <Tab>Reports</Tab>
                </TabList>
                <TabPanel className='patient-screen-tab'>
                    {this.state.selected ? this.state.selected === true ? <p>Loading...</p> : [
                        <h1 style={{display: 'inline-block', float: 'left', marginLeft: '3em'}}>{this.state.selected.name}</h1>,
                        <a className='patient-screen-btn' style={{float: 'right', margin: '2em'}} onClick={() => this.setState({selected: false})}>Go back</a>,
                        <table style={{margin: '2em', height: 'auto', width: 'calc(100% - 4em)', boxSizing: 'border-box'}}>
                            <thead>
                            <tr>
                                <th style={{width: '60%'}}>Question</th>
                                <th colSpan={2}>Answer</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.selected.questions.map(question => (
                                <tr>
                                    <td style={{paddingLeft: '.5em', textAlign: 'left'}}>{question.text}</td>
                                    {this.state.editing === question ? [
                                        <td>
                                            <ScreenAnswerEditor answerBase={question.answerBase} onChange={newAnswer => this.setState({newAnswer})}/>
                                        </td>,
                                        <td>
                                            <p style={{float: 'right', display: 'inline-block', width: '21em'}}>
                                                <a className='patient-screen-btn' onClick={() => {
                                                    delete this.state.editing;
                                                    delete this.state.newAnswer;
                                                    this.forceUpdate();
                                                }}>Cancel</a>
                                                <a className='patient-screen-btn' style={{marginLeft: '1em'}} onClick={() => {
                                                    new ApiRequest('POST', '/screen-answers', {
                                                        question: question.id,
                                                        answer: this.state.newAnswer,
                                                        client: this.props.patient
                                                    }).send((answer => (res, data) => {
                                                        if (res.status < 400) {
                                                            delete this.state.saving;
                                                            question.answer = {
                                                                ...answer,
                                                                createdAt: new Date()
                                                            };
                                                            this.forceUpdate();
                                                        } else {
                                                            alert(data);
                                                            this.props.history.push('/login');
                                                        }
                                                    })(this.state.newAnswer));
                                                    delete this.state.editing;
                                                    delete this.state.newAnswer;
                                                    this.setState({saving: question});
                                                }}>Save</a>
                                            </p>
                                        </td>
                                    ] : [
                                        this.state.saving === question ? (
                                            <td>
                                                <p>Saving...</p>
                                            </td>
                                        ) : question.answer ? (
                                            <td>
                                                <p><RenderedScreenAnswer value={question.answer.answer}/></p>
                                                <p className='answer-date'>{question.answer.createdAt.toLocaleString()}</p>
                                            </td>
                                        ) : (
                                            <td className='no-answer'/>
                                        ),
                                        <td>
                                            <a className='patient-screen-btn' style={{float: 'right'}} onClick={() => this.setState({
                                                editing: question,
                                                newAnswer: ''
                                            })}>Edit</a>
                                        </td>
                                    ]}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ] : this.state.screens.map(screen => (
                        <p><a className='patient-screen-btn' onClick={() => {
                            this.setState({selected: true});
                            var gen;
                            gen = (function* (_this) {
                                screen.getQuestions((data, status) => {
                                    if (status < 400) {
                                        gen.next();
                                    } else {
                                        alert(data);
                                        _this.props.history.push('/login');
                                    }
                                });
                                var answers;
                                new ApiRequest('GET', '/screen-answers?screen=' + screen.data.id + '&client=' + _this.props.patient).send((res, data) => {
                                    console.log(data);
                                    if (res.status < 400) {
                                        answers = data;
                                        gen.next();
                                    } else {
                                        alert(data);
                                        _this.props.history.push('/login');
                                    }
                                });
                                yield 0;
                                yield 0;
                                _this.setState({selected: {
                                    name: screen.data.name,
                                    questions: screen.questions.map(question => ({
                                        ...question,
                                        answer: answers[question.id]
                                    }))
                                }});
                            })(this);
                            gen.next();
                        }}>{screen.data.name}</a></p>
                    ))}
                </TabPanel>
                <TabPanel style={{height: '100%'}}>
                    <p>TODO: Reports</p>
                </TabPanel>
            </Tabs>
        ) : <p>Loading...</p>;
    }
}

export default withRouter(PatientScreenEditor)
