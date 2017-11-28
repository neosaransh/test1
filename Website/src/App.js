import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header.js';
import Main from './Main';
import GlobalState from './GlobalState.js';
import Footer from './Footer.js'
import 'react-dropdown/style.css';
import 'react-tabs/style/react-tabs.css';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    new GlobalState().notifyAll();
  }

  render() {
    return (
      <div>
        <Header/>
        <Main />
      </div>
    );
  }
}

//removed <Footer /> from render return

export default App;
