import React from 'react';
import Launchbutton from './launch-button';
import Web3 from 'web3';

let web3 = null; // Will hold the web3 instance

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
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      // We don't know window.web3 version, so we use our own instance of web3
      // with provider given by window.web3
      web3 = new Web3(window.web3.currentProvider);
    }
    // if (!web3.eth.coinbase) {
    //   window.alert('Please activate MetaMask first.');
    //   return;
    // }
  }

  handleMessageBodyChanged(e) {
    this.setState({messageBody: e.target.value});
  }

  handleLaunchEvent(target) {
    // console.log(`***** target: ${target}`);
    if (this.state.messageBody.length === 0) {
      return;
    }

    this.signWithMetamask(this.state.messageBody);
  }

  // var data = '0x' + new Buffer(this.state.messageBody).toString('hex');
  // toHex(text) {
  //   var hex = '';
  //   for(var i=0;i<text.length;i++) { hex += ''+text.charCodeAt(i).toString(16); }
  //   return `0x${hex}`;
  // }

  signWithMetamask(message) {
    this.getDidAsyncFromMetamask().then(did=>{
      console.log(`Metamask -> DID: ${did}`);

      var data = '0x' + new Buffer(message).toString('hex');
      web3.eth.personal.sign(data, did, "test password!")
      .then(console.log);

      // web3.eth.personal.sign(
      //   web3.fromUtf8(message),
      //   did,
      //   (err, signature) => {
      //     if (err) {
      //       console.error(`err: ${err}`);
      //       return;
      //     }
      //     console.log(`signature: ${signature}`);
      //   }
      // );
    });
  }

  // getDidAsyncFromIxoCM() {
  //   return new Promise((resolve, reject)=>{
  //     web3Ixo.eth.getAccounts(function (error, accounts) {
  //       if (error) {
  //         reject(error);
  //       }
  //       resolve(accounts[0]);
  //     });
  //   });
  // }

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
      </div>      
  );
  }
}
