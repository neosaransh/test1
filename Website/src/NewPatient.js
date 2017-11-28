import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import Dropdown from 'react-dropdown';
import './NewPatient.css';
import ApiRequest from './ApiRequest.js';

function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    return [year, month, day].join('-');
}

var empty = {
    data: {
        name: '',
        username: '',
        dob: formatDate(new Date()),
        gender: '',
        ethnicity: '',
    },
    provider: null
};

class NewPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...empty,
            providerOptions: []
        };
        new ApiRequest('GET', '/providers').send((res, data) => {
            if (res.status < 400) {
                this.setState({providerOptions: data.map(provider => ({
                    value: provider.id,
                    label: provider.name
                }))});
            } else {
                alert(data);
                this.props.history.push('/login');
            }
        });
    }

    render() {
        return this.state.request_id ? (
            <div id='newpatient' className='scrollable'>
                <h1>New Patient Added</h1>
                <p>Please give this code to the patient:</p>
                <code>{this.state.request_id}</code>
                <div>
                    <button onClick={() => {
                        delete this.state.request_id;
                        this.setState(empty);
                    }}>OK</button>
                </div>
            </div>
        ) : (
            <div id='newpatient'>
                <h1>Add New Patient</h1>
                <form onSubmit={event => {
                    event.preventDefault();
                    new ApiRequest('POST', '/newpatient', {
                        ...this.state.data,
                        provider: this.state.provider && this.state.provider.value
                    }).send((res, data) => {
                        this.setState(data);
                    });
                }}>
                    <div>
                        <p><span><label>Full Name</label></span></p>
                        <input placeholder='Full Name' value={this.state.data.name} onChange={event => this.setState({data: {...this.state.data, name: event.target.value}})}/>
                    </div>
                    <div>
                        <p><span><label>Username</label></span></p>
                        <input placeholder='Username' value={this.state.data.username} onChange={event => this.setState({data: {...this.state.data, username: event.target.value}})}/>
                    </div>
                    <div>
                        <p><span><label>Date of Birth</label></span></p>
                        <input type='date' value={this.state.data.dob} onChange={event => this.setState({data: {...this.state.data, dob: event.target.value}})}/>
                    </div>
                    <div>
                        <p><span><label>Gender</label></span></p>
                        <input placeholder='Gender' value={this.state.data.gender} onChange={event => this.setState({data: {...this.state.data, gender: event.target.value}})}/>
                    </div>
                    <div>
                        <p><span><label>Ethnicity</label></span></p>
                        <input placeholder='Ethnicity' value={this.state.data.ethnicity} onChange={event => this.setState({data: {...this.state.data, ethnicity: event.target.value}})}/>
                    </div>
                    <div>
                        <p><span><label>Provider</label></span></p>
                        <Dropdown placeholder='Provider' value={this.state.provider} onChange={provider => this.setState({provider})} options={this.state.providerOptions}/>
                    </div>
                    <button>Add</button>
                </form>
            </div>
        );
    }
}

export default withRouter(NewPatient);
