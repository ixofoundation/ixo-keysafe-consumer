class IxoCmTerminus {

  // PUBLIC METHODS
  //
  // THE FIRST SECTION OF METHODS ARE PUBLIC-FACING,
  // MEANING THEY ARE USED BY CONSUMERS OF THIS CLASS.
  //
  // THEIR SURFACE AREA SHOULD BE CHANGED WITH GREAT CARE.

  constructor (opts) {
      console.log('CTOR of IxoCmTerminus')
      this.registerWindowListener()
  }

  requestMessageSigningFromIxoCM = (data) => {
    const method = 'ixo-sign'
    this.postMessageToContentscript(method, data)
  }

  requestInfoFromIxoCM = () => {
    const method = 'ixo-info'
    this.postMessageToContentscript(method)    
  }

  // PRIVATE METHODS
  //
  // THESE METHODS ARE ONLY USED INTERNALLY TO THE KEYRING-CONTROLLER
  // AND SO MAY BE CHANGED MORE LIBERALLY THAN THE ABOVE METHODS.

  registerWindowListener () {
    console.log('inside registerWindowListener()')

    /*
    Listen for messages from the page.
    If the message was from the page script, forward it to background.js.
    */
    window.addEventListener("message", (event) => {
      if (event.data.origin === 'ixo-cm') {
          const reply = event.data
          this.handleIxoCMReply(reply)
      }      
    })
  }

  postMessageToContentscript (method, data = null) {
    window.postMessage({
      origin: 'ixo-dapp',
      message: {method, data}
    }, "*");
  }

  handleIxoCMReply = (reply) => {
    alert(`IxoCmTerminus handling received reply:  ${JSON.stringify(reply)}`)
  }
}

module.exports = IxoCmTerminus
