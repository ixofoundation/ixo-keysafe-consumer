import React from 'react';
import Launchbutton from './launch-button';
import Web3 from 'web3';

export default class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {messageBody: ''}

    this.blockchainProviders = {
      metamask: {id: 0, doShow: true, windowKey: "web3", extension: "Metamask", provider: null},
      ixo_credential_manager: {id: 1, doShow: true, windowKey: "ixoCm", extension: "IXO Credential Manager", provider: null}
    };

    // This binding is necessary to make `this` work in the callback
    this.handleExtensionLaunch = this.handleExtensionLaunch.bind(this);
    this.handleMessageBodyChanged = this.handleMessageBodyChanged.bind(this);
    this.getEthereumAddressAsync = this.getEthereumAddressAsync.bind(this);
    this.requestInfoFromIxoCM = this.requestInfoFromIxoCM.bind(this)

    if (this.blockchainProviders.metamask.doShow) {
      this.initWeb3Provider(this.blockchainProviders.metamask);
    }
    if (this.blockchainProviders.ixo_credential_manager.doShow) {
      this.initWeb3Provider(this.blockchainProviders.ixo_credential_manager);
    }
  }

  initWeb3Provider(blockchainProvider) {
    if (!window[blockchainProvider.windowKey]) {
      blockchainProvider.doShow = false;
      window.alert(`Please install ${blockchainProvider.extension} first.`);
    } else {
      if (!blockchainProvider.provider) {
        if (blockchainProvider.id === this.blockchainProviders.metamask.id) {
          blockchainProvider.provider = new Web3(window[blockchainProvider.windowKey].currentProvider);
        } else if (blockchainProvider.id === this.blockchainProviders.ixo_credential_manager.id) {
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
    
    const blockchainProvider = (providerId === this.blockchainProviders.metamask.id)?this.blockchainProviders.metamask:this.blockchainProviders.ixo_credential_manager;
    this.signMessageWithProvider(this.state.messageBody, blockchainProvider);
  }

  handleIxoInfoClick (e) {
    this.requestInfoFromIxoCM()
  }

  postMessageToContentscript (method, data = null) {
    window.postMessage({
      origin: 'ixo-dapp',
      message: {method, data}
    }, "*");
  }

  requestMessageSigningFromIxoCM (data) {
    const method = 'ixo-sign'
    this.postMessageToContentscript(method, data)
  }

  requestInfoFromIxoCM (e) {
    const method = 'ixo-info'
    this.postMessageToContentscript(method)    
  }

  signMessageWithProvider(message, blockchainProvider) {
    if (blockchainProvider.id === this.blockchainProviders.ixo_credential_manager.id) {
      
      this.requestMessageSigningFromIxoCM(message)
      return
    } else {
      this.getEthereumAddressAsync().then(address=>{
        console.log(`${blockchainProvider.extension} -> Address: ${address}`);
  
        // actual signing ->>
        var dataInHex = '0x' + new Buffer(message).toString('hex');
  
        blockchainProvider.provider.eth.personal.sign(dataInHex, address, "test password!")
        .then(console.log);
      });
    }  
  }

  getEthereumAddressAsync() {
    const eth = this.blockchainProviders.metamask.provider.eth;
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
        <button onClick={this.requestInfoFromIxoCM}>IXO INFO</button>
        <input value={this.state.messageBody} onChange={this.handleMessageBodyChanged} />
        {this.blockchainProviders.ixo_credential_manager.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.ixo_credential_manager.id}
            title="IXO-CM Sign" 
            handleLaunchEvent={this.handleExtensionLaunch}/>          
        }
        {this.blockchainProviders.metamask.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.metamask.id}
            title="Metamask Sign" 
            handleLaunchEvent={this.handleExtensionLaunch}/>
        }
      </div>      
  );
  }
}
