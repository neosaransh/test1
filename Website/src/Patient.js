import React from 'react';
import {withRouter} from 'react-router-dom';
import Chat from './Chat.js';
import ApiRequest from './ApiRequest.js';
import PatientScreenEditor from './PatientScreenEditor.js';

class Patient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: this.props.location.pathname.split('/').pop()
        };
        new ApiRequest('GET', '/client?id=' + this.state.client).send((res, data) => {
            if (res.status < 400) {
                this.setState({data});
            } else {
                alert(data);
                this.props.history.push('/login');
            }
        });
    }

    render() {
        return this.state.data ? (
            <div style={{overflow: 'hidden', height: 'inherit', width: '100%', paddingBottom: '3em', paddingTop: '5em'}}>
                <h1 style={{display: 'block'}}>{this.state.data.patient.name}</h1>
                <Chat recipient={this.state.data.patient.id} style={{float: 'left', width: '40%', height: '100%'}}/>
                <PatientScreenEditor patient={this.state.client} style={{width: '60%', display: 'block', marginLeft: '40%', height: '100%', paddingBottom: '3em'}}/>
            </div>
        ) : null;
    }
}

export default withRouter(Patient);
