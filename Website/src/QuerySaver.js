import React, { Component } from 'react';

export default class QuerySaver extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <input type='text' style={{marginLeft: '2em', marginRight: '2em'}} placeholder='Name' value={this.state.name} onChange={event => this.setState({name: event.target.value})}/>
                <div style={{marginTop: '1em'}}>
                    <button className='fancybtn' onClick={() => {
                        this.props.close();
                        this.props.onSave({
                            config: this.props.config,
                            name: this.state.name
                        });
                    }}>OK</button>
                </div>
            </div>
        );
    }
}
