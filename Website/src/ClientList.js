import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ApiRequest from './ApiRequest.js';
import './FullClientList.css';

class FullClientList extends Component{
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        new ApiRequest('GET', '/clientlist').send((res, data) => {
            if (res.status == 200) {
                this.setState({data});
            } else if (res.status == 401 || res.status == 403) {
                this.props.history.push('/login');
            }
        });
    }

    render(){
        return(
            <div className="col-12 scrollable">
                <div style={{width:"85%", margin:"auto", display:"block", position:"relative", zIndex:"1", backgroundColor:"white"}}>
                {this.state.data.map(client =>

                    <Link to={`/profile/${client.id}`}>
                        <button className="clientListNames" style={{backgroundColor: "white"}} >
                            <img src={client.profileimg || 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'} className="clientImage"/>
                            <p><center>{client.name}</center></p>
                        </button>
                    </Link>

                )}
                </div>

            </div>
        );
    }
}
const listStyles={
    color: '#8c8c8c ',
    fontSize: 30,
};


export default withRouter(FullClientList);
