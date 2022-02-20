import { secrets } from "./secrets";
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

    // Setup the algod client using the secrets imported variable
    this.algodClient = new algosdk.Algodv2(secrets.algodHeader, secrets.algodServer, "");

    // Setup the indexer client using the secrets imported variable
    this.indexerClient = new algosdk.Indexer(secrets.algodHeader, secrets.indexerServer, "");
  }

  /** 
   * Attempts to connect to the accounts present in the browser's AlgoSigner addon.
   *
   * @returns {string[]} - Array of all account addresses in string format.
   */
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
    // Note they will be in this format: [{address: "fsdaklfjdsa"}, {address: "fsdafsdfer"}, etc]
    let tempAccounts = await window.AlgoSigner.accounts({
      ledger: "TestNet"
    });

    let accounts = tempAccounts.map((x) => {
      return x["address"];
    });


    // Return the accounts in array format: ["address1", "address2", "address3", etc]
    return accounts;
  }

  /**
   * Decodes base64 string to JavaScript standard string.
   * 
   * @param {string} encodedString - string encoded in base64
   * @returns {string} - regular JavaScript string 
   */
  base64ToString(encodedString) {
    return Buffer.from(encodedString, "base64").toString();
  }

  /** 
   * Retrieves and returns the current global variable values in the given app (appID).
   *
   * @param {number} appID - App ID (aka index) of the Algorand smart contract app.
   * @return {object} - Javascript object of election variables mapped to their respective values.
   * 
   * @example 
   * // returns 
   * //   {
   * //     "Creator": "fjlasjfskfa...",
   * //     "VoteOptions": "A,B,C,D",
   * //     "VotesFor0": 0,
   * //     "VotesFor1": 0,
   * //     ...
   * //   } 
   * getElectionState(appID)
   */
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
      let key = this.base64ToString(x["key"]);

      // Bytes values need to be decoded
      // Addresses stored as bytes need a special decoding process which we have done for you :)
      let bytesVal =
        key == "Creator"
          ? algosdk.encodeAddress(Buffer.from(x["value"]["bytes"], "base64"))
          : this.base64ToString(x["value"]["bytes"]);
      
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

  /** 
   * Finds all accounts that have opted-in to the specified app and returns their local states.
   *
   * @param {number} appID - App ID (aka index) of the Algorand smart contract app.
   * @return {object} - Object of addresses mapped to an object of the addresses' key-value 
   * local state.
   * 
   * @example 
   * // returns 
   * //   {
   * //     "jsdalkfjsd...": {
   * //       "can_vote": "yes", 
   * //       "voted": 2
   * //     }, 
   * //     "fdsfdsaf...": {
   * //       "can_vote": "no"
   * //     }
   * //   }
   * getAllLocalStates(appID)
   */
  async getAllLocalStates(appID) {
    // allLocalStates will be returned once it's filled with data
    let allLocalStates = {};

    // Use this.indexerClient to find all the accounts who have appID associated with their account
    let accountInfo = await this.indexerClient.searchAccounts().applicationID(appID).do();

    // The resultant JavaScript object (dictionary) may have a complex form
    // Try to console.log it out to see the structure
    let accounts = accountInfo["accounts"];
    console.log(accounts);

    // Go through the data and fill allLocalStates which contains all the user's local states
    // Note that the *keys* of smart contract local state variables will need to be decoded using 
    //   Buffer.from(value, "base64").toString() or our helper this.base64ToString(value) function
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
              let key = this.base64ToString(keyValue["key"]);
              if (key == "can_vote") {
                let value = this.base64ToString(keyValue["value"]["bytes"]);
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

  /** 
   * Signs the given transaction using AlgoSigner then sends it out to be added to the blockchain.
   *
   * @param {AlgoSDK Transaction} txn - Transaction that needs to be signed and sent.
   */
  async signAndSend(txn) {
    // transactions will need to be encoded to Base64. AlgoSigner has a builtin method for this
    let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    // sign the transaction with AlgoSigner
    let signedTxs = await window.AlgoSigner.signTxn([{txn: txn_b64}]);
    console.log(signedTxs);

    // send the message with AlgoSigner
    let tx = await window.AlgoSigner.send({
      ledger: "TestNet",
      tx: signedTxs[0].blob
    });

    return tx;
  }

  /** 
   * Sends a transaction that opts in the given account to the given app.
   *
   * @param {string} address - Address of the user who wants to opt into the election.
   * @param {number} appID - App ID (aka index) of the smart contract app.
   */
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

  /** 
   * Sends a transaction from the creator to the given app to approve/reject the given user.
   *
   * @param {string} creatorAddress - Address of the creator, who is allowed to approve/reject.
   * @param {string} userAddress - Address of the user who is being approved/rejected.
   * @param {string} yesOrNo - "yes" or "no" corresponding to whether user should be allowed to vote 
   * or not.
   * @param {number} appID - App ID (aka index) of the smart contract app.
   */
  async updateUserStatus(creatorAddress, userAddress, yesOrNo, appID) {
    console.log(`${creatorAddress} attempting to ${yesOrNo == "yes" ? "approve" : "deny"} account ${userAddress}`);

    // get the suggested params for the transaction
    let params = await this.algodClient.getTransactionParams().do();

    // Setup the application argument array, note that application arguments need to be encoded
    // Strings need to be encoded into Uint8Array
    // Addresses, *only* when passed as arguments, need to be decoded with algosdk inbuilt 
    // decodeAddress function
    // and then use the public key value
    // Remember the first argument for an application call should be the identifier
    // In this case the identifier is "update_user_status"
    let appArgs = [];
    let decodedAddress = algosdk.decodeAddress(userAddress);
    appArgs.push(new Uint8Array(Buffer.from("update_user_status")));
    appArgs.push(decodedAddress.publicKey);
    appArgs.push(new Uint8Array(Buffer.from(yesOrNo)));

    // Create the transaction with proper app argument array
    // For this application transaction make sure to include the optional array of accounts 
    // including both the creators
    // Account and also the user's account (both in regular string format, algosdk automatically 
    // converts these)
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

  /** 
   * Sends a transaction from the given user to vote for the given option in the given election app.
   *
   * @param {string} address - Address of the user trying to vote.
   * @param {number} optionIndex - Index (starting at 0) corresponding to the user's vote, 
   * ie in "A,B,C" the optionIndex for C would be index 2.
   * @param {number} appID - App ID (aka index) of the smart contract app.
   */
  async vote(address, optionIndex, appID) {
    console.log(`${address} attempting to vote for option ${optionIndex}`);

    // Get the suggested params for the transaction
    let params = await this.algodClient.getTransactionParams().do();

    // Setup the application argument array, note that application arguments need to be encoded
    // Strings need to be encoded into Uint8Array
    // Ints need to be encoded using algosdk's inbuilt encodeUint64 function
    // Remember the first argument for an application call should be the identifier
    // In this case the identifier is "vote"
    let appArgs = [];
    appArgs.push(new Uint8Array(Buffer.from("vote")));
    appArgs.push(algosdk.encodeUint64(optionIndex));

    // create the transaction with proper application argument array
    let txn = algosdk.makeApplicationNoOpTxn(
      address,
      params,
      appID,
      appArgs
    )
    console.log(txn);

    // Sign and send the transaction with our this.signAndSend function
    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  /** 
   * Sends a transaction from given account to close out of the given app.
   *
   * @param {string} address - Address of the user trying to close out.
   * @param {number} appID - App ID (aka index) of the smart contract app.
   */
  async closeOut(address, appID) {
    console.log(`${address} attempting to close out of app ${appID}`);

    let params = await this.algodClient.getTransactionParams().do();

    let txn = algosdk.makeApplicationCloseOutTxn(address, params, appID);
    console.log(txn);

    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  /** 
   * Sends a transaction from the given user to the given app to clear state of the app.
   *
   * @param {string} address - Address of the user trying to clear state.
   * @param {number} appID - App ID (aka index) of the smart contract app.
   */
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
const mainAlgoHandler = new AlgoHandler();

export default mainAlgoHandler;
