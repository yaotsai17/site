import React, { Component } from 'react';
import './App.css';
import Header from './component/header/Header';

class App extends Component {
  render() {
    return (
      <div className="app-root-container">
        <Header />
      </div>
    );
  }
}

export default App;
