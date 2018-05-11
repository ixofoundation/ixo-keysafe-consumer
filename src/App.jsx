import React, { Component } from 'react';
import './App.css';
import Dashboard from './dash-board';

class App extends Component {


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">IXO Credential Manager consumer</h1>
        </header>
        <Dashboard/>
      </div>
    );
  }
}

export default App;
