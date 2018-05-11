import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      clicks: prevState.clicks + 1
    }));
  }

  render() {
    return (
      <div>
        <div>{this.state.clicks}</div>
        <button onClick={this.handleClick}>Click</button>
      </div>      
  )
  }
}
