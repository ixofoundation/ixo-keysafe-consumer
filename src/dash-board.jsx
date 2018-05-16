import React from 'react';
import Launchbutton from './launch-button';
import Web3 from 'web3';

const web3Providers = {
  web3Metamask: {id: 0, doShow: true, windowKey: "web3", extension: "Metamask", provider: null},
  web3Ixo: {id: 1, doShow: true, windowKey: "web3Ixo", extension: "IXO Credential Manager", provider: null}
};

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messageBody: ''};

    // This binding is necessary to make `this` work in the callback
    this.handleExtensionLaunch = this.handleExtensionLaunch.bind(this);
    this.handleMessageBodyChanged = this.handleMessageBodyChanged.bind(this);

    if (web3Providers.web3Metamask.doShow) {
      web3Providers.web3Metamask.provider = this.getWeb3Instance(web3Providers.web3Metamask);
    }
    if (web3Providers.web3Ixo.doShow) {
      web3Providers.web3Ixo.provider = this.getWeb3Instance(web3Providers.web3Ixo);
    }
  }

  getWeb3Instance(web3Provider) {
    if (!window[web3Provider.windowKey]) {
      web3Provider.doShow = false;
      window.alert(`Please install ${web3Provider.extension} first.`);
      return null;
    }
    if (!web3Provider.provider) {
      // We don't know window.web3 version, so we use our own instance of web3
      // with provider given by window.web3
      return new Web3(window[web3Provider.windowKey].currentProvider);
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
    
    const web3Provider = (providerId === web3Providers.web3Metamask.id)?web3Providers.web3Metamask:web3Providers.web3Ixo;
    this.signMessageWithProvider(this.state.messageBody, web3Provider);
  }

  // var data = '0x' + new Buffer(this.state.messageBody).toString('hex');
  // toHex(text) {
  //   var hex = '';
  //   for(var i=0;i<text.length;i++) { hex += ''+text.charCodeAt(i).toString(16); }
  //   return `0x${hex}`;
  // }

  signMessageWithProvider(message, web3Provider) {
    this.getDidAsyncFromProvider(web3Provider.provider).then(did=>{
      console.log(`${web3Provider.extension} -> DID: ${did}`);

      var data = '0x' + new Buffer(message).toString('hex');
      web3Provider.provider.eth.personal.sign(data, did, "test password!")
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

  getDidAsyncFromProvider(provider) {
    return new Promise((resolve, reject)=>{
      provider.eth.getAccounts(function (error, accounts) {
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
        {web3Providers.web3Metamask.doShow && 
          <Launchbutton
            provider={web3Providers.web3Metamask.id}
            title="Metamask" 
            handleLaunchEvent={this.handleExtensionLaunch}/>
        }
        {web3Providers.web3Ixo.doShow && 
          <Launchbutton
            provider={web3Providers.web3Ixo.id}
            title="IXO CM" 
            handleLaunchEvent={this.handleExtensionLaunch}/>          
        }
      </div>      
  );
  }
}
