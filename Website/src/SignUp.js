import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import logo from './logo.ico';
import logo2 from './logo2.ico';
import './SignUp.css';


class SignUp extends Component {

  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      hospital: '',
      phoneNumber: '',
      securityCode: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }
  handleSubmit(event){
    alert(this.state.firstName + '\n '+ this.state.lastName+ '\n '+ this.state.email+ '\n '+ this.state.hospital+ '\n '+ this.state.phoneNumber+ '\n '+ this.state.securityCode);
    event.preventDefault();
  }

  render() {
    return (
      <div className="col-12" style={{height:"96vh", top:"0.01px"}}>
      <div className="App">
      <div id="signUpBox" className="col-3" style={{float:"right", backgroundColor:"white", height:"96vh"}}>
      <center>
      <h1 style={{fontFamily: 'Playfair Display', color:"black", fontSize: '42px', marginTop:"7vh"}}>Sign Up</h1>
      <h5 style = {{fontSize: '16px', fontFamily: 'Playfair Display', textAlign:"left", width:"70%"}}>Please provide valid information below.</h5>
      <form onSubmit = {this.handleSubmit} style={{backgroundColor:"white"}}>
        <input required type="text" name="firstName" placeholder="First Name" value = {this.state.firstName} onChange = {this.handleChange}></input> <br />
        <input required type="text" name="lastName" placeholder="Last Name" value = {this.state.lastName} onChange = {this.handleChange}></input> <br />
        <input required type="text" name="email" placeholder="Email Address" value = {this.state.email} onChange = {this.handleChange}></input> <br />
        <input required type="text" name="hospital" placeholder="Hospital Name" value = {this.state.hospital} onChange = {this.handleChange}></input> <br />
        <input required type="text" name="phoneNumber" placeholder="Phone Number" value = {this.state.phoneNumber} onChange = {this.handleChange}></input> <br />
        <input required type="text" name="securityCode" placeholder="Security Code" value = {this.state.securityCode} onChange = {this.handleChange}></input><br />
        <input type="submit" value="Submit" style={{backgroundColor: "rgba(52, 152, 219,1.0)", color:"white"}}></input><br />
      </form>
      <Link style={{color:"black", textDecoration: "none", fontSize: '16px'}} to = '/Login'>Back To Login</Link>
      </center>
      </div>
      </div>
      </div>
    );
  }
}

export default SignUp;
