import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import GlobalState from './GlobalState.js';
import SavedQueryLoader from './SavedQueryLoader.js';
import QuerySaver from './QuerySaver.js';
import OverTimeQueryBuilder from './OverTimeQueryBuilder.js';
import TestDrawer from './Drawer.js';
import ApiRequest from './ApiRequest.js';

class SinglePatientQueryBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {config: {series: []}}
    }

    buildQueryClose = () => {};

    loadSavedQueryClose = () => {};

    saveQueryClose = () => {};

    handler(config) {
        if (this.state.saved) {
            delete this.state.saved;
        }
        this.setState({config});
        this.props.onChange(config);
    }

    save(dataToSave) {
        new ApiRequest('POST', '/querystore', dataToSave).send((res, data) => this.setState({saved: {
            id: data.id,
            name: dataToSave.name
        }}));
    }

    render() {
        return (
            <div>
                <TestDrawer buttonText='Build Query' buttonClass='fancybtn' acceptClose={_ => this.buildQueryClose = _}>
                    <h1>Time-Series Patient Data</h1>
                    <OverTimeQueryBuilder config={this.state.config} onChange={config => this.handler(config)} close={() => this.buildQueryClose()}/>
                </TestDrawer>
                <TestDrawer buttonText='Load Saved Query' buttonClass='fancybtn' acceptClose={_ => this.loadSavedQueryClose = _} style={{marginLeft: '1em'}}>
                    <h1>Load Saved Query</h1>
                    <SavedQueryLoader onSelect={saved => {
                        this.handler(saved.config);
                        this.setState({saved});
                    }} close={() => this.loadSavedQueryClose()}/>
                </TestDrawer>
                {this.state.config.series.length ? [
                    <TestDrawer buttonText={this.state.saved ? 'Save Query As' : 'Save Query'} buttonClass='fancybtn' acceptClose={_ => this.saveQueryClose = _} style={{marginLeft: '1em'}}>
                        <h1>Save Query</h1>
                        <QuerySaver config={this.state.config} onSave={data => this.save(data)} close={() => this.saveQueryClose}/>
                    </TestDrawer>,
                    this.state.saved ? <button className='fancybtn' style={{marginLeft: '1em'}} onClick={() => this.save({...this.state.saved, config: this.state.config})}>Update '{this.state.saved.name}'</button> : null,
                    <Link to='/multipatient-query' onClick={() => new GlobalState().setValue('query-config', this.state.config)}><button className='fancybtn' style={{marginLeft: '1em'}}>Add Patients</button></Link>,
                    <button className='fancybtn' style={{marginLeft: '1em'}} onClick={() => this.handler({series: []})}>Reset</button>
                ] : null}
            </div>
        );
    }
}

export default withRouter(SinglePatientQueryBuilder);
