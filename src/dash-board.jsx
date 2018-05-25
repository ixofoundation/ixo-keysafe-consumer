import React from 'react';
import Launchbutton from './launch-button';
import Web3 from 'web3';

export default class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {messageBody: ''};

    this.blockchainProviders = {
      web3Metamask: {id: 0, doShow: true, windowKey: "web3", extension: "Metamask", provider: null},
      web3Ixo: {id: 1, doShow: true, windowKey: "web3Ixo", extension: "IXO Credential Manager", provider: null}
    };

    // This binding is necessary to make `this` work in the callback
    this.handleExtensionLaunch = this.handleExtensionLaunch.bind(this);
    this.handleMessageBodyChanged = this.handleMessageBodyChanged.bind(this);
    this.getEthereumAddressAsync = this.getEthereumAddressAsync.bind(this);
    this.getIxoDidAsync = this.getIxoDidAsync.bind(this);

    if (this.blockchainProviders.web3Metamask.doShow) {
      this.initWeb3Provider(this.blockchainProviders.web3Metamask);
    }
    if (this.blockchainProviders.web3Ixo.doShow) {
      this.initWeb3Provider(this.blockchainProviders.web3Ixo);
    }
  }

  initWeb3Provider(blockchainProvider) {
    if (!window[blockchainProvider.windowKey]) {
      blockchainProvider.doShow = false;
      window.alert(`Please install ${blockchainProvider.extension} first.`);
    } else {
      if (!blockchainProvider.provider) {
        if (blockchainProvider.id === this.blockchainProviders.web3Metamask.id) {
          blockchainProvider.provider = new Web3(window[blockchainProvider.windowKey].currentProvider);
        } else if (blockchainProvider.id === this.blockchainProviders.web3Ixo.id) {
          // blockchainProvider.provider = window[blockchainProvider.windowKey].currentProvider;
          blockchainProvider.provider = new Web3(window[blockchainProvider.windowKey].currentProvider);
        }
      }  
    }
  }

  handleMessageBodyChanged(e) {
    this.setState({messageBody: e.target.value});
  }

  handleExtensionLaunch(providerId) {
    // console.log(`***** target: ${target}`);

    if (this.state.messageBody.length === 0) {
      return;
    }
    
    const blockchainProvider = (providerId === this.blockchainProviders.web3Metamask.id)?this.blockchainProviders.web3Metamask:this.blockchainProviders.web3Ixo;
    this.signMessageWithProvider(this.state.messageBody, blockchainProvider);
  }

  signMessageWithProvider(message, blockchainProvider) {
    var getAddress = this.getEthereumAddressAsync;
    if (blockchainProvider.id === this.blockchainProviders.web3Ixo.id) {
      getAddress = this.getIxoDidAsync;
    }

    getAddress().then(address=>{
      console.log(`${blockchainProvider.extension} -> Address: ${address}`);

      // actual signing ->>
      var dataInHex = '0x' + new Buffer(message).toString('hex');

      blockchainProvider.provider.eth.personal.sign(dataInHex, address, "test password!")
      .then(console.log);
    });
  
  }


  // getIxoDidAsync() {
  //   return new Promise((resolve, reject)=>{
  //     resolve(this.blockchainProviders.web3Ixo.provider.debug());
  //   });
  // }
  getIxoDidAsync() {
    const eth = this.blockchainProviders.web3Ixo.provider.eth;
    return new Promise((resolve, reject)=>{
      // resolve(provider.debug());
      eth.getAccounts(function (error, accounts) {
        if (error || 0 === accounts.length) {
          reject(error);
        }
        resolve(accounts[0]);
      });
    });
  }

  getEthereumAddressAsync() {
    const eth = this.blockchainProviders.web3Metamask.provider.eth;
    return new Promise((resolve, reject)=>{
      // resolve(provider.debug());
      eth.getAccounts(function (error, accounts) {
        if (error || 0 === accounts.length) {
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
        {this.blockchainProviders.web3Metamask.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.web3Metamask.id}
            title="Metamask" 
            handleLaunchEvent={this.handleExtensionLaunch}/>
        }
        {this.blockchainProviders.web3Ixo.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.web3Ixo.id}
            title="IXO CM" 
            handleLaunchEvent={this.handleExtensionLaunch}/>          
        }
      </div>      
  );
  }
}
