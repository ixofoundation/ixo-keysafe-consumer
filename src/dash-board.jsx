import React from 'react';
import Launchbutton from './launch-button';
import Web3 from 'web3';

export default class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);

    this.registerContentscriptEventListener()

    this.state = {messageBody: ''}

    this.blockchainProviders = {
      web3Metamask: {id: 0, doShow: true, windowKey: "web3", extension: "Metamask", provider: null},
      web3Ixo: {id: 1, doShow: true, windowKey: "web3Ixo", extension: "IXO Credential Manager", provider: null}
    };

    // This binding is necessary to make `this` work in the callback
    this.handleExtensionLaunch = this.handleExtensionLaunch.bind(this);
    this.handleMessageBodyChanged = this.handleMessageBodyChanged.bind(this);
    this.getEthereumAddressAsync = this.getEthereumAddressAsync.bind(this);
    this.handleIxoDidClick = this.handleIxoDidClick.bind(this)
    this.handleIxoInfoClick = this.handleIxoInfoClick.bind(this)

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

  handleIxoDidClick (e) {
    this.requestDidFromIxoCM()
  }

  handleIxoInfoClick (e) {
    this.requestInfoFromIxoCM()
  }

  registerContentscriptEventListener () {
    window.addEventListener("message", function(event) {
      if (event.source === window &&
          event.data.origin &&
          event.data.origin === "ixo-cm") {
            const reply = event.data
            console.log(`!!!webpage received reply: ${JSON.stringify(reply)}`)
            alert(`Page script received reply:  ${JSON.stringify(reply)}`)
      }
    });
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

  requestDidFromIxoCM () {
    const method = 'ixo-didi'
    this.postMessageToContentscript(method)
  }

  requestInfoFromIxoCM () {
    const method = 'ixo-info'
    this.postMessageToContentscript(method)    
  }

  signMessageWithProvider(message, blockchainProvider) {
    // default to Ethereum address retrieval
    var getAddress = this.getEthereumAddressAsync;
    if (blockchainProvider.id === this.blockchainProviders.web3Ixo.id) {
      
      this.requestMessageSigningFromIxoCM(message)
      return
    }
    getAddress().then(address=>{
      console.log(`${blockchainProvider.extension} -> Address: ${address}`);

      // actual signing ->>
      var dataInHex = '0x' + new Buffer(message).toString('hex');

      blockchainProvider.provider.eth.personal.sign(dataInHex, address, "test password!")
      .then(console.log);
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
        <button onClick={this.handleIxoDidClick}>IXO DID</button>
        <button onClick={this.handleIxoInfoClick}>IXO INFO</button>
        <input value={this.state.messageBody} onChange={this.handleMessageBodyChanged} />
        {this.blockchainProviders.web3Ixo.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.web3Ixo.id}
            title="IXO-CM Sign" 
            handleLaunchEvent={this.handleExtensionLaunch}/>          
        }
        {this.blockchainProviders.web3Metamask.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.web3Metamask.id}
            title="Metamask Sign" 
            handleLaunchEvent={this.handleExtensionLaunch}/>
        }
      </div>      
  );
  }
}
