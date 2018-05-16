import React from 'react';

export default class Launchbutton extends React.Component {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick(e) {
        this.props.handleLaunchEvent(this.props.provider);
    }
  
    render() {
      return (
        <button onClick={this.handleClick}>{this.props.title}</button>
      );
    }
  }