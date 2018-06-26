The purpose of this project is for it to behave as a consumer of the IXO Keysafe browser extension (https://github.com/ixofoundation/ixo-keysafe-browser-extension)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Table of Contents

- [Quickstart](#quickstart)

- [Features](#features)
  - [detect absence of Ixo Keystore browser extension](#absent-extension)
  - [instantiate Ixo Keystore browser extension](#instantiate-extension)
  - [request keysafe information](#keysafe-information)
  - [request keysafe DID document](#keysafe-get-did-doc)
  - [request keysafe to present message signing](#keysafe-request-signing)

- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run build](#npm-run-build)
  - [npm run eject](#npm-run-eject)

## Quickstart

1. Clone this repository
2. run `npm install`
3. start the application on localhost port 3000 by running `npm run start`


  ## Features

### `absent extension`

In the case of the page loading and not finding the constructor for the IxoKeysafeInpageProvider on the global window object an alert will show indicating this.  All functionality relating to interaction with the Ixo Keysafe will also not be available

```javascript
if (!window["ixoKs"]) {
      window.alert("Please install IXO Keysafe first.");
}
```

### `instantiate extension`

```
const IxoKeysafeInpageProvider = window["ixoKs"];
this.ixoKsProvider = new IxoKeysafeInpageProvider();
```

### `keysafe information`

```
this.ixoKsProvider.getInfo((error, response)=>{
  console.log(`Callback received response for getInfo. response: ${JSON.stringify(response)}, error: ${JSON.stringify(error)}`);
})
```
__a successful response looks like this:__
```
{
	"didDoc": {
		"did": "did:sov:BhHF1yt33YVivywggsKZ4k",
		"pubKey": "6q5GvVbsarDupenM8hmJugjy3yqyRPAAT2ixoQ6XCBuL"
	},
	"name": "Your Account Name"
}
```

### `keysafe get DID doc`

```
this.ixoKsProvider.getDidDoc((error, response)=>{
  if (error) {
    // handle error
  } else {
    // continue with successful response
  }
}
```
__a successful response looks like this:__
```
{
	"didDoc": {
		"did": "did:sov:BhHF1yt33YVivywggsKZ4k",
		"pubKey": "6q5GvVbsarDupenM8hmJugjy3yqyRPAAT2ixoQ6XCBuL"
	}
}
```

### `keysafe request signing`

```
const textToSign = '{"key1": "value1", "key2": "this entire textToSign can be any string really"}';
this.ixoKsProvider.requestSigning(textToSign, (error, response)=>{
  if (error) {
    // handle error
  } else {
    // continue with successful response
  }
})
```
__a successful response looks like this:__
```
{
	"type": "ed25519-sha-256",
	"created": "2018-06-07T14:51:37Z",
	"creator": "did:sov:BhHF1yt33YVivywggsKZ4k",
	"publicKey": "52PTt1eA5gGSiXBuoNwtGrN3p52XKTHb4ayer48MCahR",
	"signatureValue": "B59D2CA3B084C1DE38E08627815AE62EE7DC03E466688267BCACA04B61040DDF8DCDB9CFC713D4B9694B5499281F9ACFE734C663A91E17CA48335F9CC8B58704"
}
```

  ## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

