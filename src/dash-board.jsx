import React from 'react';
import Launchbutton from './launch-button';
import Web3 from 'web3';

export default class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {messageBody: ''}

    this.blockchainProviders = {
      metamask: {id: 0, doShow: true, windowKey: "web3", extension: "Metamask", provider: null},
      ixo_credential_manager: {id: 1, doShow: true, windowKey: "ixoCm", extension: "ixo Keysafe", provider: null}
    };

    // This binding is necessary to make `this` work in the callback
    this.handleExtensionLaunch = this.handleExtensionLaunch.bind(this);
    this.handleMessageBodyChanged = this.handleMessageBodyChanged.bind(this);
    this.getEthereumAddressAsync = this.getEthereumAddressAsync.bind(this);
    this.handleRequestInfoButtonClicked = this.handleRequestInfoButtonClicked.bind(this)

    if (this.blockchainProviders.metamask.doShow) {
      this.initWeb3Provider(this.blockchainProviders.metamask);
    }
    if (this.blockchainProviders.ixo_credential_manager.doShow) {
      this.initWeb3Provider(this.blockchainProviders.ixo_credential_manager);
    }
  }

  handleRequestInfoButtonClicked (e) {
    this.blockchainProviders.ixo_credential_manager.provider.requestInfoFromIxoCM((error, response)=>{
      alert(`Dashboard handling received response for INFO response: ${JSON.stringify(response)}, error: ${JSON.stringify(error)}`)
    })    
  }

  handleSimulateDidDocLedgeringButtonClicked = (e) => {
    this.blockchainProviders.ixo_credential_manager.provider.requestDidDocFromIxoCM((error, didDocResponse)=>{
      if (error) {
        alert(`Simulate signing DID Doc retrieval error: ${JSON.stringify(error)}`)
      } else {
        console.log(`Simulate signing DID Doc retrieval response: \n${JSON.stringify(didDocResponse)}\n`)
        this.blockchainProviders.ixo_credential_manager.provider.requestMessageSigningFromIxoCM(JSON.stringify(didDocResponse), (error, signatureResponse)=>{
          console.log(`Simulate signing DID Doc  SIGN response: \n${JSON.stringify(signatureResponse)}\n, error: ${JSON.stringify(error)}`)

          const {signatureValue, created} = signatureResponse
          const ledgerObject = this.generateLedgerObject(didDocResponse, signatureValue, created)
          const ledgerObjectJson = JSON.stringify(ledgerObject)

          const ledgerObjectHex = new Buffer(ledgerObjectJson).toString("hex").toUpperCase()
          console.log(`****\n${ledgerObjectHex}\n`)
          alert(`Simulate signing DID Doc SIGN ledger object: \n${ledgerObjectJson}\n`)
        })
      }      
    })    
  }

  generateLedgerObject = (didDoc, signature, created) => {
    const signatureValue = [1, signature]
    return {payload: [10, didDoc], signature: {signatureValue, created}}
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
          const IxoInpageProvider = window[blockchainProvider.windowKey]
          blockchainProvider.provider = new IxoInpageProvider();
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

  signMessageWithProvider(message, blockchainProvider) {
    if (blockchainProvider.id === this.blockchainProviders.ixo_credential_manager.id) {
      
      this.blockchainProviders.ixo_credential_manager.provider.requestMessageSigningFromIxoCM(message, (error, response)=>{
        alert(`Dashboard handling received response for SIGN response: ${JSON.stringify(response)}, error: ${JSON.stringify(error)}`)
      })
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
        {this.blockchainProviders.ixo_credential_manager.doShow && 
          <button onClick={this.handleSimulateDidDocLedgeringButtonClicked}>Simulate DID ledgering</button>
        }
        {this.blockchainProviders.ixo_credential_manager.doShow && 
          <button onClick={this.handleRequestInfoButtonClicked}>ixo INFO</button>
        }
        <input value={this.state.messageBody} onChange={this.handleMessageBodyChanged} />
        {this.blockchainProviders.ixo_credential_manager.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.ixo_credential_manager.id}
            title="ixo Sign" 
            handleLaunchEvent={this.handleExtensionLaunch}/>          
        }
        {this.blockchainProviders.metamask.doShow && 
          <Launchbutton
            provider={this.blockchainProviders.metamask.id}
            title="Metamask Sign" 
            handleLaunchEvent={this.handleExtensionLaunch}/>
        }
      </div>      
  )
  }
}
