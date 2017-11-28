import React, { Component } from 'react';
import './Header.css';
import medilogo from './medilogoheader.jpg';
import changeToDefaultBackground from './changeBackgroundBasedOnLogin.js';
import search from './search.css';
import { Link, withRouter } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import * as AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import * as AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import Search from './searchbar.js';
import GlobalState from './GlobalState.js';

export default class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {};
        new GlobalState().subscribe(session => {
            this.setState({session});
            changeToDefaultBackground(session);
        }, 'session');
        new GlobalState().subscribe(admin => this.setState({admin}), 'admin');
    }

    render(){
        return(
            <div className='col-12'>
                <nav className ='navbar-dropdown animated'>
                    <ul>
                        {this.state.session ? [
                            <Link to = '/clientlist'><li id='clientListButton'><a className='block'>Client List</a></li></Link>,
                            <li id='clientUpdatesButton'><a className='block'>Client Updates</a></li>,
                            <Link to = '/contact'><li id='contactButton'><a className='block'>Contact</a></li></Link>,
                            <Link to = '/screens'><li id='screenBrowserButton'><a className='block'>Screen Browser</a></li></Link>,
                            ...(this.state.admin ? [
                                <Link to = '/newpatient'><li><a className='block'>New Patient</a></li></Link>
                            ] : []),
                            <Link to='/login'><li style={{float:'right'}} id='signOutButton'><a className='block'>Sign Out</a></li></Link>,
                            <li style={{float:'right'}}><Search /></li>
                        ] : [
                            <li id='mainSiteButton'><a className='block'>Main Site</a></li>,
                            <li id='coporateSiteButton'><a className='block'>Corporate Site</a></li>
                        ]}
                    </ul>
                </nav>
            </div>
        );
    }

}
