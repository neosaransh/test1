import React, {Component} from 'react';
import {SocketProvider} from 'socket.io-react';
import io from 'socket.io-client';
import {withRouter} from "react-router-dom";
import GlobalState from './GlobalState.js';
import ApiRequest from './ApiRequest.js';
import './Chat.css';

const socket = io({query: {session_token: new GlobalState().getValue('session')}});
const handlers = {};

socket.on('connected', (data) => {
    console.log('Connected to socket');
    this.contentUrl = data['content_url'];
});

socket.on('chat message', msg => {
    if (msg.sender in handlers) {
        handlers[msg.sender].forEach(handler => handler(msg));
    }
});

const renderers = {
    text: msg => [
        <span>{msg.contents}</span>,
        <p className='message-timestamp'>{msg.sent_at.toLocaleString()}</p>
    ],
    image: msg => [
        <span><img src={this.contentUrl + '/chat/images/' + msg.contents}/></span>,
        <p className='message-timestamp'>{msg.sent_at.toLocaleString()}</p>
    ]
};

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: ''
        };
        new ApiRequest('GET', '/chat/messages?contact_id=' + this.props.recipient).send((res, messages) => {
            if (res.status < 400) {
                this.setState({messages});
            } else {
                alert(messages);
                this.props.history.push('/login');
            }
        });
        this.receive = msg => this.setState({messages: [...this.state.messages, msg]});
    }

    componentDidMount() {
        this.scrollDummy.scrollIntoView();
        if (this.props.recipient in handlers) {
            handlers[this.props.recipient].push(this.receive);
        } else {
            handlers[this.props.recipient] = [this.receive];
        }
    }

    componentDidUpdate() {
        this.scrollDummy.scrollIntoView();
    }

    render() {
        return (
            <div className="chat" style={this.props.style || {}}>
                {this.state.messages ?
                    <ul className="chat-messages">
                        {this.state.messages.map(msg => (
                            <li className={msg.sender === 'me' ? 'message-sent' : 'message-received'}>
                                {msg.content_type in renderers && renderers[msg.content_type](msg) ||
                                <span className='message-error'/>}
                            </li>
                        ))}
                    </ul>
                    :
                    <span className="loading"/>
                }
                <div ref={el => this.scrollDummy = el}/>
                <form onSubmit={event => {
                    event.preventDefault();
                    if (this.state.messageText === '') {
                        return;
                    }
                    var msg = {
                        recipient: this.props.recipient,
                        sent_at: new Date(),
                        content_type: 'text',
                        contents: this.state.messageText
                    };
                    this.state.messages.push({...msg, sender: 'me'});
                    socket.emit('chat-message-send', msg, ack => this.setState({messageText: ''}));
                }}>
                    <input value={this.state.messageText}
                           onChange={event => this.setState({messageText: event.target.value})}/>
                    <button type='button' onClick={() => {
                        this.upload.click();
                    }}>Upload
                    </button>
                    <button>Send</button>
                    <input type='file' id='upload' style={{visibility: 'hidden', display: 'inline', height: '0px'}}
                           ref={el => this.upload = el} onChange={() => {
                        var reader = new FileReader();
                        reader.onload = e => {
                            new ApiRequest('PUT', '/chat/images/upload', reader.result, this.upload.files[0].type).send((res, data) => {
                                if (res.status < 400) {
                                    this.upload.value = '';
                                    var msg = {
                                        recipient: this.props.recipient,
                                        sent_at: new Date(),
                                        content_type: 'image',
                                        contents: data.name
                                    };
                                    this.state.messages.push({...msg, sender: 'me'});
                                    socket.emit('chat-message-send', msg, ack => this.setState({}));
                                }
                            });
                        };
                        reader.readAsArrayBuffer(this.upload.files[0]);
                    }}/>
                </form>
            </div>
        );
    }
}

export default withRouter(Chat);
