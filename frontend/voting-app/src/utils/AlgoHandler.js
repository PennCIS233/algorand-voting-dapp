const algosdk = require("algosdk");

// This will handle all algosdk, indexer, and AlgoSigner code
class AlgoHandler {
  constructor() {
    // waits a little while then checks to see if the AlgoSigner extension is installed
    setTimeout(200, () => {
      if (typeof window.AlgoSigner == "undefined") {
        console.log("Please install the AlgoSigner extension");
        alert("Please install the AlgoSigner extension");
        return;
      }
    });
    console.log("New AlgoHandler");

    // The algoClient handles creating Algorand transactions
    const algodToken = {
      "X-API-Key": "OtAhhF0GEa3GnYbsgghbx4L9qO9Ebq6J9m1sjOS0",
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = "";
    this.algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // The indexerClient handles searching the Algorand blockchain for information
    const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2';
    this.indexerClient = new algosdk.Indexer(algodToken, indexerServer, algodPort);
  }

  // getAlgoSignerAccounts
  // Description:
  //  Attempts to connect to the accounts present in the browser's AlgoSigner addon
  // Returns:
  //  accounts (string[]) - string array of all account addresses
  async getAlgoSignerAccounts() {
    if (typeof window.AlgoSigner == "undefined") {
      console.log("Please install the AlgoSigner extension");
      alert("Please install the AlgoSigner extension");
      return;
    }

    // Attempt to connect to AlgoSigner
    // If this fails or an error occurs, return an empty array
    try {
      await window.AlgoSigner.connect();
    } catch (e) {
      console.log(e);
      console.log("Please allow this app to connect to your AlgoSigner accounts");
      alert("Please allow this app to connect to your AlgoSigner accounts");
      return [];
    }

    // Retrieve all the AlgoSigner accounts on the TestNet
    // Note they will be in this format: [{address: 'fsdaklfjdsa'}, {address: 'fsdafsdfer'}, etc]
    let tempAccounts = await window.AlgoSigner.accounts({
      ledger: "TestNet"
    });

    let accounts = tempAccounts.map((x) => {
      return x["address"];
    });


    // Return the accounts in array format: ['address1', 'address2', 'address3', etc]
    return accounts;
  }

  // decodes bytes to string
  bytesToString(bytes) {
    return Buffer.from(bytes, "base64").toString();
  }

  // getElectionState
  // Description:
  //  Retrieves and returns the current global variable values in the given app (appID)
  // Parameters:
  //  appID (number) - id (aka index) of the Algorand smart contract app
  // Returns:
  //  returns (object) - Javascript object of election variables to their values
  //  example:
  //   {
  //     'Creator': 'fjlasjfskfa...',
  //     'VotesFor0': 0,
  //     'VotesFor1': 0,
  //     'VoteOptions': 'A,B,C,D',
  //     ...
  //   }
  async getElectionState(appID) {
    // newState will be returned once it's filled with data
    let newState = {};

    // Use the algodClient to get the the app details
    let app = await this.algodClient.getApplicationByID(appID).do();

    // The data might have a complex structure, feel free to console.log it to see the structure

    // Go through the data and add the global state variables and values to our newState object (dictionary)
    console.log("Application's global state:");
    for (let x of app["params"]["global-state"]) {
      console.log(x);

      // decode the object key
      let key = this.bytesToString(x["key"]);

      // Bytes values need to be decoded
      // Addresses stored as bytes need a special decoding process which we have done for you :)
      let bytesVal =
        key == "Creator"
          ? algosdk.encodeAddress(Buffer.from(x["value"]["bytes"], "base64"))
          : this.bytesToString(x["value"]["bytes"]);
      
      // uint types don't need to be decoded
      let uintVal = x["value"]["uint"];

      // type is 1 if the variable is the bytes value, 2 if the variable is actually the uint value
      let valType = x["value"]["type"];

      // set the value for the key in our newState object to the correct value
      newState[key] = valType == 1 ? bytesVal : uintVal;
    }

    // return the newState
    return newState;
  }

  // getAllLocalStates
  // Description:
  //  Takes a given appID and finds all accounts that have opted-in to it, then returns all users' decoded local states
  // Parameters:
  //  appID (number) - id (aka index) of the Algorand smart contract app
  // Return:
  //  returns (object) - Javascript object (dictionary) of addresses mapped to their states
  //  example: 
  //   {
  //     'jsdalkfjsd...': {
  //       'can_vote': 'yes', 
  //       'voted': 2
  //     }, 
  //     'fdsfdsaf...': {
  //       'can_vote': 'no'
  //     }
  //   }
  async getAllLocalStates(appID) {
    // allLocalStates will be returned once it's filled with data
    let allLocalStates = {};

    // Use this.indexerClient to find all the accounts who have appID associated with their account
    let accountInfo = await this.indexerClient.searchAccounts().applicationID(appID).do();

    // The resultant JavaScript object (dictionary) may have a complex form
    // Try to console.log it out to see the structure
    let accounts = accountInfo['accounts'];
    console.log(accounts);

    // Go through the data and fill allLocalStates which contains all the user's local states
    // Note that the *keys* of smart contract local state variables will need to be decoded using 
    //   Buffer.from(value, "base64").toString() or our helper this.bytesToString(value) function
    // The actual values will also need to be decoded if they are bytes
    // If they are uints they do not need decoding
    for (let acc of accounts) {
      let address = acc["address"];
      allLocalStates[address] = {};

      let apps = acc["apps-local-state"];
      if (apps) {
        for (let app of apps) {
          if (app["id"] == appID) {
            for (let keyValue of app["key-value"]) {
              let key = this.bytesToString(keyValue["key"]);
              if (key == "can_vote") {
                let value = this.bytesToString(keyValue["value"]["bytes"]);
                allLocalStates[address][key] = value;
              } else if (key == "voted") {
                allLocalStates[address][key] = keyValue["value"]["uint"];
              }
            }
          }
        }
      }
    }
    console.log(allLocalStates);

    // Return your JavaScript object
    return allLocalStates;
  }

  // signAndSend
  // Description:
  //  Signs the given transaction using AlgoSigner then sends it out to be added to the blockchain
  // Parameters: 
  //  txn (algosdk transaction) - transaction that needs to be signed
  async signAndSend(txn) {
    // transactions will need to be encoded to Base64. AlgoSigner has a builtin method for this
    let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    // sign the transaction with AlgoSigner
    let signedTxs = await window.AlgoSigner.signTxn([{txn: txn_b64}]);
    console.log(signedTxs);

    // send the message with AlgoSigner
    let tx = await window.AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTxs[0].blob
    });

    return tx;
  }

  // optInAccount
  // Description:
  //  Sends a transaction that opts in the given user (address) to the given app (appID)
  // Parameters:
  //  address (string) - address of the user who wants to opt into the election
  //  appID (number) - app id (aka index) of the smart contract app
  async optInAccount(address, appID) {
    // get the suggested params for the transaction
    console.log(`Attempting to opt-in account ${address} to ${appID}`);
    let params = await this.algodClient.getTransactionParams().do();

    // create the transaction to opt in
    let txn = algosdk.makeApplicationOptInTxn(address, params, appID);
    console.log(txn);

    // sign and send the transaction with our helper this.signAndSend function
    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  // updateUserStatus
  // Description:
  //  sends a transaction from the creator (creatorAddress) to the given app (appID) to approve/reject the given user (userAddress)
  // Parameters:
  //  creatorAddress (string) - address of the creator who is allowed to approve for the transaction
  //  userAddress (string) - address of the user who is being approved/rejected
  //  yesOrNo (string) - "yes" or "no" depending on if the creator wants the user to be allowed to vote or not
  //  appID (number) - app id (aka index) of the smart contract app
  async updateUserStatus(creatorAddress, userAddress, yesOrNo, appID) {
    console.log(`${creatorAddress} attempting to ${yesOrNo == 'yes' ? 'approve' : 'deny'} account ${userAddress}`);

    // get the suggested params for the transaction
    let params = await this.algodClient.getTransactionParams().do();

    // setup the application argument array, note that application arguments need to be encoded
    // strings need to be encoded into Uint8Array
    // addresses, *only* when passed as arguments, need to be decoded with algosdk inbuilt decodeAddress function
    // and then use the public key value
    let appArgs = [];
    let decodedAddress = algosdk.decodeAddress(userAddress);
    appArgs.push(new Uint8Array(Buffer.from('update_user_status')));
    appArgs.push(decodedAddress.publicKey);
    appArgs.push(new Uint8Array(Buffer.from(yesOrNo)));

    // create the transaction with proper app argument array
    // For this application transaction make sure to include the optional array of accounts including both the creators
    // account and also the user's account (both in regular string format, algosdk automatically converts these)
    let txn = algosdk.makeApplicationNoOpTxn(
      creatorAddress,
      params,
      appID,
      appArgs,
      [creatorAddress, userAddress]
    );
    console.log(txn);

    // sign and send the transaction with our helper this.signAndSend function
    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  // vote
  // Description:
  //  Sends a transaction from the given user (address) to vote for the given option (optionIndex) in the given election app (appID)
  // Parameters:
  //  address (string) - address of the user trying to vote
  //  optionIndex (number) - index (starting at 0) corresponding to the user's vote, ie in 'A,B,C' C would be index 2
  //  appID (number) - app id (aka index) of the smart contract app
  async vote(address, optionIndex, appID) {
    console.log(`${address} attempting to vote for option ${optionIndex}`);

    // get the suggested params for the transaction
    let params = await this.algodClient.getTransactionParams().do();

    // setup the application argument array, note that application arguments need to be encoded
    // strings need to be encoded into Uint8Array
    // ints need to be encoded using algosdk's inbuilt encodeUint64 function
    let appArgs = [];
    appArgs.push(new Uint8Array(Buffer.from('vote')));
    appArgs.push(algosdk.encodeUint64(optionIndex));

    // create the transaction with proper application argument array
    let txn = algosdk.makeApplicationNoOpTxn(
      address,
      params,
      appID,
      appArgs
    )
    console.log(txn);

    // sign and send the transaction with our helper this.signAndSend function
    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  // closeOut
  // Description:
  //  sends a transaction from given user (address) to closeout of the given app (appID)
  // Parameters:
  //  address (string) - address of the user trying to closeout of app
  //  appID (number) - app id (aka index) of the smart contract app
  async closeOut(address, appID) {
    console.log(`${address} attempting to close out of app ${appID}`);

    let params = await this.algodClient.getTransactionParams().do();

    let txn = algosdk.makeApplicationCloseOutTxn(address, params, appID);
    console.log(txn);

    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  // clearState
  // Description:
  //  sends a transaction from the given user (address) to the given app (appID) to clear state of the app
  // Parameters:
  //  address (string) - address of the user trying to clear state of the app
  //  appID (number) - app id (aka index) of the smart contract app
  async clearState(address, appID) {
    console.log(`${address} attempting to clear state of app ${appID}`);

    let params = await this.algodClient.getTransactionParams().do();

    let txn = algosdk.makeApplicationClearStateTxn(address, params, appID);
    console.log(txn);

    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }
}

// create and export a singular AlgoHandler instance
var mainAlgoHandler = new AlgoHandler();

export default mainAlgoHandler;
