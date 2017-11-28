import React, { Component } from 'react';
import './Contact.css';
import Header from './Header.js';
import { Link, withRouter } from 'react-router-dom';
import ApiRequest from './ApiRequest.js';
import GlobalState from './GlobalState.js';

class Email extends React.Component {
    render () {
        return (
            <form className="col-12 scrollable" style={{height:"96vh", top:0, backgroundColor:"white"}}>
                <center>
                    <h1 style={{fontSize:"40px"}}>Get In Touch With Us</h1>
                    <input type="Email" placeholder="Your Email Address" className="formInput"></input>
                    <br/>
                    <input placeholder="Message Title" className="formInput"></input>
                    <br/>
                    <textarea placeholder="Message Body" className="col-6 center" style={{minHeight:"60vh", marginTop:10, fontFamily:"Playfair Display", backgroundColor:"rgba(236, 240, 241,1.0)", border:"none", fontSize:"16px", resize:"none"}}></textarea>
                    <br/>
                    <input type="submit" className="formInput" style={{backgroundColor:"#2ecc71", color:"white"}}></input>
                    <br/>
                </center>
            </form>
        );
    }
}

export default Email;