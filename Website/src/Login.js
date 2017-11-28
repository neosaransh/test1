import React, { Component } from 'react';
import './Login.css';
import Header from './Header.js';
import { Link, withRouter } from 'react-router-dom';
import ApiRequest from './ApiRequest.js';
import GlobalState from './GlobalState.js';
import logo from './logo.ico';
import logo2 from './logo2.ico';

const state = new GlobalState();

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    state.clear();
    //everytime the login page is loaded, the background is set to the default background image
    document.body.style.backgroundImage = "url('https://www.gapyear.com/images/content/11.08.07-ces_ft_doctor_6966282.jpg')";
  }
  changeBackgroundImage() {
    document.body.style.backgroundImage = "url('#')";
  }
  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }
  handleSubmit(event){
    event.preventDefault();
    new ApiRequest('POST', '/login', {username: this.state.username, password: this.state.password}).send((res, data) => {
      if (res.status == 200) {
        this.changeBackgroundImage();
        state.setValue('session', data.session_token);
        state.setValue('admin', data.admin === true);
        this.props.history.push('/clientlist');
        console.log('done');
      } else {
        alert('Login unsuccessful; message: ' + data.msg);
      }
    });
  }
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return (
      <div className="col-12" style={{height:"96vh", top:0}}>
      <div className="App">

        <div className = "loginBox col-3 scrollable" style={{float:"right", backgroundColor:"white", minHeight:"96vh"}}>
            <div style = {{margin:"auto", display:"block"}}> 
            <h1 style = {{position:"relative", fontSize: '42px', fontFamily: 'Playfair Display', marginTop:"30%"}}>Welcome.</h1>
            <h5 style = {{fontSize: '16px', fontFamily: 'Playfair Display', textAlign:"left", marginLeft:"14%", width:"70%"}}>This is Medimo Labs - World's Smartest Medical Assisstant</h5>
            <form onSubmit = {this.handleSubmit} style={{backgroundColor:"white"}}>
              <input required type="text" name="username" placeholder="Username" value = {this.state.username} onChange = {this.handleChange}></input> <br/>
              <input required type="password" name="password" placeholder="Password" value = {this.state.password} onChange = {this.handleChange} style={{color:"black"}}></input> <br/>
              <input id="loginButton" type="Submit" value="Submit" onClick = {this.handleSubmit} style={{backgroundColor: "rgba(52, 152, 219,1.0)", color:"white"}}></input>
            </form>
            <Link style={{color:"black", textDecoration: "none", fontSize: '16px'}} to = '/passwordreset'>Password Reset</Link>
            <br />
            <Link style={{color:"black", textDecoration: "none", fontSize: '16px'}} to='/signup'>No Account? Sign Up Here</Link>
            <br />
            <img src={logo} style={{width:"80px", height:"80px", marginTop:"30px"}}/>
            <img src={logo2} style={{marginLeft:"2vw", width:"50px", height:"80px", marginTop:"30px"}}/> {/*logo2 should have a height:width ratio of 1.6*/}
            </div>
            </div>
        </div>
      </div>
    );
  }
}
//to revert to middle login, remove the inline marginTop from welcome h1, and remove all inline style from loginBox div
export default withRouter(Login);
