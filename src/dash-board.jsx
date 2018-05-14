import React from 'react';
import Launchbutton from './launch-button';

var Web3 = require('web3');

var targets = {
  METAMASK: 0,
  IXO_CM: 1
};

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleLaunchEvent = this.handleLaunchEvent.bind(this);

    this.state = {web3: 'undefined'};
    this.initWeb3();
  }

  initWeb3() {
    if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
      const web3Provider = window.web3.currentProvider;
      this.setState({web3: new Web3(web3Provider)});
    } else {    
      console.error('No web3 provider found. Please install Metamask on your browser.');
      alert('No web3 provider found. Please install Metamask on your browser.');
    }
  }

  handleLaunchEvent(target) {
    console.log(`***** target: ${target}`);
    debugger;

    var msg = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
    
    var from = this.state.web3.eth.accounts[0];
    this.state.web3.eth.sign(from, msg, function (err, result) {
      if (err) return console.error(err);
      console.log('SIGNED:' + result);
    });

    // if (typeof window.web3 !== 'undefined') {
    //   const payload = {key1: "value1", key2: "key2", key3: "key3"};
      
    //   // // This user has MetaMask, or another Web3 browser installed!
    //   // var ethereumProvider = web3.currentProvider;

    //   var web3 = new Web3(window.web3.currentProvider);
    //   debugger;

    //   var msg = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
    //   var from = web3.eth.accounts[0];
    //   web3.eth.sign(from, msg, function (err, result) {
    //     if (err) return console.error(err);
    //     console.log('SIGNED:' + result);
    //   });

    //   // web3.getAccounts(function (err, accounts) {
    //   //   web3.eth.getBalance(accounts[0], function (err, balance) {
    //   //     console.log('Your balance is ' + Web3.fromWei(balance, 'ether'));
    //   //   });
    //   // });
    // }

    // // let myWeb3 = new Web3(window.web3.currentProvider);
    // window.web3.sign('{"key1": "value1"}').then(function (signature) {
    //   console.log(`***** signature: ${signature}`);
    // });
  }

  render() {
    return (
      <div>
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
