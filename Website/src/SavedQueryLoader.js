import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import ApiRequest from './ApiRequest.js';

var savedQueries = {};

export default class SavedQueryLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.state = {};
        new ApiRequest('GET', '/querystore').send((res, data) => {
            console.log(data);
            savedQueries = {};
            for (var _query of data) {
                savedQueries[_query.id] = _query;
            }
            this.setState({options: data.map(query => ({value: query.id, label: query.name}))});
        });
    }

    render() {
        return (
            <div>
                <div style={{marginLeft: '2em', marginRight: '2em'}}>
                    <Dropdown value={this.state.selected} options={this.state.options} onChange={selected => this.setState({selected})}/>
                </div>
                <div style={{marginTop: '1em'}}>
                    <button className='fancybtn' onClick={() => {
                        if (!this.state.selected) {
                            return;
                        }
                        this.props.close();
                        this.props.onSelect(savedQueries[this.state.selected.value]);
                    }}>OK</button>
                </div>
            </div>
        );
    }
}
