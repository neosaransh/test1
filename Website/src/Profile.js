import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import './loginbackground.png';
import './Profile.css';
import ApiRequest from './ApiRequest.js';
import Moment from 'moment'; //apparently REALLY needs this one
import SinglePatientQueryBuilder from "./SinglePatientQueryBuilder.js";
import QueryGraph from './QueryGraph.js';


class ClientProfile extends React.Component {

    render() {
        //const profImg = this.props.parentState.data.patient.profileimg;
        //const imgURL = profImg.url();
        console.log(this.props.parentState.data.patient.profileimg);

        return (
            <div id="clientProfile">
                <h1>Client: {this.props.parentState.data.patient.name}</h1>
                <img src={this.props.parentState.data.patient.profileimg || 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'} alt='Profile Picture' id='profilePicImg' />
                <p id="clientDataSummary">Summary: {this.props.parentState.data.notes || ''}</p>
                <p><Link to={`/patient/${this.props.parentState.client}`}>Interact</Link></p>
                <p><Link to={`/goals/${this.props.parentState.client}`}>Goals</Link></p>
            </div>
        );
    }
}

class ClientInfoTable extends React.Component {
    render() {
        return (
            <div id="clientDataTable">
                <table>
                    <thead>
                    <tr>
                        <th id="tableheader" colSpan={2}>Patient Info</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Height</td>
                        <td id="dataCell">{this.props.parentState.data.patient.height}</td>
                    </tr>
                    <tr>
                        <td>Weight</td>
                        <td id="dataCell">{this.props.parentState.data.patient.weight}</td>
                    </tr>
                    <tr>
                        <td>Condition</td>
                        <td id="dataCell">{this.props.parentState.data.patient.condition}</td>
                    </tr>
                    <tr>
                        <td>Medication</td>
                        <td id="dataCell">{this.props.parentState.data.patient.medication}</td>
                    </tr>
                    <tr>
                        <td>Goals</td>
                        <td id="dataCell">{this.props.parentState.data.patient.goals}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class ClientDataVis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var id = this.props.parentState.client;
        return (
            <div id="clientGraph">
                <div>
                    <h1>{this.props.parentState.data.patient.name} Trends</h1>
                    <SinglePatientQueryBuilder onChange={config => {
                        this.setState({query: {
                            clients: [id],
                            ...config
                        }});
                    }}/>
                    <QueryGraph query={this.state.query} />
                </div>
            </div>
        );
    }
}

class _RenderProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {patient: {}},
            client: this.props.location.pathname.split('/').pop()
        };
    }

    componentDidMount() {
        new ApiRequest('GET', '/client?id=' + this.state.client).send((res, data) => {
            if (res.status == 200) {
                this.setState({data});
            } else {
                alert('The requested patient could not be found');
                this.props.history.goBack();
            }
        });
    }

    render() {
        return (
            <div className='backgroundOverride scrollable'>
                <div id="top">
                    <ClientProfile parentState={this.state}/>
                    <ClientInfoTable parentState={this.state}/>
                </div>
                <div id="bottom">
                    <ClientDataVis parentState={this.state}/>
                </div>
            </div>
        );
    }
}

export default withRouter(_RenderProfile);
