import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ApiRequest from './ApiRequest.js';
import getScreenData from './ScreenDataProvider.js';
import './Screens.css'

var colors = ["#FF5722", "rgba(52, 152, 219,1.0)", "rgba(46, 204, 113,1.0)", "rgba(231, 76, 60,1.0)"];
var colorChoice = Math.floor(Math.random() * colors.length);
/*document.body.style.backgroundImage = "url('#')";*/

class ScreenDetail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.screen.questions) {
            this.props.screen.getQuestions(questions => this.setState({}));
        }
        return (
            <div className="col-12" style={{position:"relative", float:"right", minHeight:"96vh", top:0}}>
                <div id="screensBody" className="col-12" style={{minHeight:"96vh"}}>
                    <h2 style={{fontFamily:"Roboto", fontSize:"50px"}}>{this.props.screen.data.name}</h2>
                    <p style={{textAlign: 'left', marginLeft:"5vw", fontFamily:"Roboto", fontSize:"20px"}}>{this.props.screen.data.instructions}</p>
                    <div style={{textAlign: 'left', marginLeft:"5vw", fontFamily:"Roboto", fontSize:"20px", paddingRight:"30px"}}>
                        {(this.props.screen.questions || []).map(question =>
                            <div>
                                <h3>{question.text}</h3>
                                <ul>
                                    {question.continuation ? <li><strong>Special continuation instructions:</strong> {question.continuation}</li> : ''}
                                    {question.suggestedFrequency ? <li><strong>Suggested frequency:</strong> {question.suggestedFrequency}</li> : ''}
                                    {question.notes ? <li><strong>Notes:</strong> {question.notes}</li> : ''}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

class Screens extends Component {
    constructor(props) {
        super(props);
        this.state = {screens: []};
    }

    componentDidMount() {
        getScreenData((screens, status) => {
            if (status == 200) {
                this.setState({screens});
            } else if (status == 401 || status == 403) {
                this.props.history.push('/login');
            } else {
                alert(screens.msg);
                window.location.reload();
            }
        });
    }

    render(){
        return(
            <div className="row">
                <div className="col-10" style={{position:"relative", float:"right", backgroundColor:"white", minHeight:"96vh"}}>
                    {this.state.current ? <ScreenDetail screen={this.state.current}/> :
                    <center><p style={{top:'50%',color:'darkgray',fontSize:'36px',fontWeight:'bold', width:"60%"}}>Please select a screen to continue</p></center>}
                </div>
                <div id="buttonList" className="col-2" style={{backgroundColor:"rgba(236, 240, 241,1.0)"}}>
                    <div style={{width:'100%', maxHeight:"96vh", overflow: 'scroll'}}>
                        {this.state.screens.map(screen =>
                            <div><button id="screenQuestion" onClick={() => this.setState({current: screen})} style={{backgroundColor: (colors[colorChoice]), color:"white", fontFamily:"Playfair Display", fontSize:"25px"}}>{screen.data.name}</button></div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(Screens);
