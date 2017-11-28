import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './PasswordReset.css';

class PasswordReset extends Component{

  constructor(props){
    super(props);
    this.state = {
      userName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }
  handleSubmit(event){
    alert(this.state.oldPassword +' '+ this.state.newPassword);
    event.preventDefault();
  }
  render(){
    return(
      <div className="col-12" style={{minHeight:"96vh", top:"0.01px"}}>
        <div id="passwordResetBox"  className="col-3 scrollable" style={{float:"right", backgroundColor:"white", minHeight:"96vh"}}>
        <center style={{backgroundColor:"white"}}>
        <h1 style={{fontFamily: 'Playfair Display', color:'black', fontSize: '42px', marginTop:"20%"}}>Password Reset</h1>
        <h5 style = {{fontSize: '16px', fontFamily: 'Playfair Display', textAlign:"left", width:"70%"}}>Enter username to procced</h5>
        <form onSubmit = {this.handleSubmit} style={{backgroundColor:"white"}}>
          <input required type="text" name="userName" placeholder="Username" value = {this.state.userName} onChange = {this.handleChange}></input> <br />
          <input type="submit" value="Submit" style={{backgroundColor: "rgba(52, 152, 219,1.0)", color: "white"}}></input>
        </form>
        <Link style={{color:"black", textDecoration: "none", fontSize: '16px'}} to = '/Login'>Back To Login</Link>
        </center>
        </div>
      </div>
    );
  }
}



export default PasswordReset;
