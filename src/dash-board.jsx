import React from 'react';
import Launchbutton from './launch-button';

const Eth = require('ethjs-query');
var Web3 = require('web3');
var web3Metamask = null;
var web3Ixo = null;

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

    //init web3 for Metamask
    if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
      web3Metamask = new Web3(window.web3.currentProvider);
    } else {    
      console.error('No web3 provider for Metamask found. Please install Metamask in your browser.');
      alert('No web3 provider for Metamask found. Please install Metamask in your browser.');
    }

    //init web3 for IxoCM
    if (typeof window.web3Ixo !== 'undefined' && typeof window.web3Ixo.currentProvider !== 'undefined') {
      web3Ixo = new Web3(window.web3Ixo.currentProvider);
    } else {    
      console.error('No web3 provider for IXO Credential Manager found. Please install IXO Credential Manager in your browser.');
      alert('No web3 provider for IXO Credential Manager found. Please install IXO Credential Manager in your browser.');
    }
    debugger;
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
          this.signWithIxoCM(this.state.messageBody);
          break;
      default:
        alert('Unknown action requested.');
    }    
  }

  signWithIxoCM(message) {
    this.getDidAsyncFromIxoCM().then(did=>{
      console.log(`IxoCM -> DID: ${did}`);
    });
  }

  signWithMetamask(message) {
    this.getDidAsyncFromMetamask().then(did=>{
      console.log(`Metamask -> DID: ${did}`);
      const eth = new Eth(web3Metamask.currentProvider);

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

  getDidAsyncFromIxoCM() {
    return new Promise((resolve, reject)=>{
      web3Ixo.eth.getAccounts(function (error, accounts) {
        if (error) {
          reject(error);
        }
        resolve(accounts[0]);
      });
    });
  }

  getDidAsyncFromMetamask() {
    return new Promise((resolve, reject)=>{
      web3Metamask.eth.getAccounts(function (error, accounts) {
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
