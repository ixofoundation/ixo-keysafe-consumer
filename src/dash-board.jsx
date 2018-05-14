import React from 'react';
import Launchbutton from './launch-button';

const Eth = require('ethjs-query');
var Web3 = require('web3');
var web3 = null;

var targets = {
  METAMASK: 0,
  IXO_CM: 1
};

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messageBody: ''};

    // This binding is necessary to make `this` work in the callback
    this.handleLaunchEvent = this.handleLaunchEvent.bind(this);
    this.handleMessageBodyChanged = this.handleMessageBodyChanged.bind(this);

    //init web3
    if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
      web3 = new Web3(window.web3.currentProvider);
    } else {    
      console.error('No web3 provider found. Please install Metamask on your browser.');
      alert('No web3 provider found. Please install Metamask on your browser.');
    }
  }

  handleMessageBodyChanged(e) {
    this.setState({messageBody: e.target.value});
  }

  handleLaunchEvent(target) {
    console.log(`***** target: ${target}`);
    if (this.state.messageBody.length === 0) {
      return;
    }

    switch(target) {
      case targets.METAMASK:
          this.signWithMetamask(this.state.messageBody);
          break;
      case targets.IXO_CM:
          alert('Going to sign with IXO CM.');
          break;
      default:
        alert('Unknown action requested.');
    }    
  }

  signWithMetamask(message) {
    this.getDidAsyncFromMetamask().then(did=>{
      const eth = new Eth(web3.currentProvider);

      // var toSend = JSON.stringify(payload);
      var msg = '0x' + new Buffer(this.state.messageBody).toString('hex');

      eth.personal_sign(msg, did)
          .then((signature) => {
            console.log(`SUCCESS signature: ${signature}`);
          });
    }, error=>{
      console.error(`ERROR error: ${error}`);
      alert(error);
    });
  }

  getDidAsyncFromMetamask() {
    return new Promise((resolve, reject)=>{
      web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          reject(error);
        }
        resolve(accounts[0]);
      });
    });
  }

  render() {
    return (
      <div>
        <input value={this.state.messageBody} onChange={this.handleMessageBodyChanged} />
        <Launchbutton
          event={targets.METAMASK}
          title="Metamask" 
          handleLaunchEvent={this.handleLaunchEvent}/>

        <Launchbutton 
          event={targets.IXO_CM}
          title="Ixo CM" 
          handleLaunchEvent={this.handleLaunchEvent}/>
          
      </div>      
  );
  }
}
