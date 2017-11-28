import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import ApiRequest from './ApiRequest.js';

class Goals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client: this.props.location.pathname.split('/').pop(),
            modified: false
        };
        this.updates = [];
        this.addUpdate = (goal, key, newValue) => {
            var update = this.updates.filter(u => u.goal === goal);
            if (update.length) {
                update = update[0];
            } else {
                update = {
                    goal,
                    updates: {}
                };
                this.updates.push(update);
            }
            update.updates[key] = newValue;
            this.setState({modified: true});
        };
        this.newGoals = [];
        this.addNewGoal = () => {
            var goal = {
                createdAt: new Date(),
                issuer: 'Physician'
            };
            this.state.goals.push(goal);
            this.newGoals.push(goal);
            this.setState({modified: true});
        };
        new ApiRequest('GET', '/client?id=' + this.state.client).send((res, mhr) => {
            if (res.status < 400) {
                this.setState({mhr});
            } else {
                alert(mhr);
                this.props.history.push('/login');
            }
        });
        new ApiRequest('GET', '/goals?client=' + this.state.client).send((res, goals) => {
            if (res.status < 400) {
                console.log(goals);
                this.setState({goals});
            } else {
                alert(goals);
                this.props.history.push('/login');
            }
        });
    }

    render() {
        return this.state.saving ? <p>Saving...</p> : (this.state.mhr && this.state.goals) ? (
            <div id='goals-manager' className='scrollable'>
                <h1>{this.state.mhr.patient.name}'s Goals</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Created</th>
                        <th>Uploader</th>
                        <th>Task</th>
                        <th>Completed</th>
                        <th>Accepted</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.goals.map(goal => (
                        <tr>
                            <td>{goal.createdAt.toLocaleString()}</td>
                            <td>{goal.issuer}</td>
                            <td><input value={goal.goal} onChange={event => {
                                goal.goal = event.target.value;
                                this.addUpdate(goal, 'goal', event.target.value);
                            }}/></td>
                            <td><input type='checkbox' checked={goal.completed} onChange={event => {
                                goal.completed = event.target.checked;
                                this.addUpdate(goal, 'completed', event.target.checked);
                            }}/></td>
                            <td>{goal.accepted ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={5}>
                            <button className='fancybtn' onClick={this.addNewGoal}>Add</button>
                            {this.state.modified ? <button className='fancybtn' style={{marginLeft: '1em'}} onClick={() => {
                                this.setState({saving: true});
                                var gen;
                                gen = (function* (_this) {
                                    var count = 0;
                                    for (var goal of _this.newGoals) {
                                        new ApiRequest('POST', '/goals', {
                                            type: 'new',
                                            goal: goal.goal,
                                            client: _this.state.client
                                        }).send((res, data) => {
                                            if (res.status < 400) {
                                                goal.id = data.id;
                                                gen.next();
                                            } else {
                                                alert(JSON.stringify(data));
                                                _this.props.history.push('/login');
                                            }
                                        });
                                        count++;
                                    }
                                    while (count-- > 0) {
                                        yield 0;
                                    }
                                    for (var update of _this.updates) {
                                        new ApiRequest('POST', '/goals', {
                                            id: update.goal.id,
                                            type: 'update',
                                            updates: update.updates
                                        }).send((res, data) => {
                                            if (res.status < 400) {
                                                gen.next();
                                            } else {
                                                alert(JSON.stringify(data));
                                                _this.props.history.push('/login');
                                            }
                                        });
                                        count++;
                                    }
                                    while (count-- > 0) {
                                        yield 0;
                                    }
                                    _this.updates = [];
                                    _this.newGoals = [];
                                    _this.setState({
                                        saving: false,
                                        modified: false
                                    });
                                })(this);
                                setImmediate(() => gen.next());
                            }}>Save</button> : null}
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        ) : <p>Loading...</p>;
    }
}

export default withRouter(Goals);
