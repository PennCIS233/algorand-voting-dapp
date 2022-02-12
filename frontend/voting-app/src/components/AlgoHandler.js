const algosdk = require("algosdk");

// This will handle all algosdk, indexer, and AlgoSigner code
class AlgoHandler {
  constructor() {
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

  // connectToAccounts
  // Description:
  //  Attempts to connect to the accounts present in the browser's AlgoSigner addon
  // Returns:
  //  accounts (string[]) - string array of all account addresses
  async connectToAccounts() {
    if (typeof window.AlgoSigner == "undefined") {
      console.log("Please install the AlgoSigner extension");
      alert("Please install the AlgoSigner extension");
      return;
    }

    // attempts to connect to AlgoSigner accounts, will prompt user to allow access to accounts
    try {
      await window.AlgoSigner.connect();
    } catch (e) {
      console.log(e);
      console.log("Please allow this app to connect to your AlgoSigner accounts");
      alert("Please allow this app to connect to your AlgoSigner accounts");
      return;
    }

    // gets information on all the user's TestNet accounts in their AlgoSigner
    // tempAccounts = [{address: 'fsdaklfjdsa'}, {address: 'fsdafsdfer'}, etc]
    let tempAccounts = await window.AlgoSigner.accounts({
      ledger: "TestNet"
    });
    // make data easier to use
    // accounts = ['fsdaklfjdsa', 'fsdafsdfer', etc]
    let accounts = tempAccounts.map((x) => {
      return x["address"];
    });

    return accounts;
  }

  // isCreator
  // Description:
  //  Checks and returns boolean on whether the given user (address) is the creator of the given app (appID)
  // Parameters:
  //  appID (number) - ID of the app
  //  address (string) - address of the specified user's account
  // Returns:
  //  returns (bool) - whether the given address is the creator of the election at electionAddress
  async isCreator(appID, address) {
    // retrieve account's applications
    // see if any of the account's applications have the appID
    let accountInfoResponse = await this.algodClient
      .accountInformation(address)
      .do();
    console.log(accountInfoResponse);
    for (let i = 0; i < accountInfoResponse["created-apps"].length; i++) {
      if (accountInfoResponse["created-apps"][i].id == appID) {
        console.log(`${address} is creator of ${appID}`);
        return true;
      }
    }
    console.log(`${address} is NOT creator of ${appID}`);
    return false;
  }

  // decodes bytes to strings
  decode(encoded) {
    return Buffer.from(encoded, "base64").toString();
  }

  // getElectionState
  // Description:
  //  Retrieves and returns the current global variable values in the given app (appID)
  // Parameters:
  //  appID (number) - id (aka index) of the Algorand smart contract app
  // Returns:
  //  returns (object) - Javascript object of election variables to their values
  async getElectionState(appID) {
    // newState will be returned once it's filled with data
    let newState = {};

    let app = await this.algodClient.getApplicationByID(appID).do();

    console.log("Application's global state:");
    for (let x of app["params"]["global-state"]) {
      console.log(x);

      let key = this.decode(x["key"]);
      let bytesVal =
        key == "Creator"
          ? algosdk.encodeAddress(Buffer.from(x["value"]["bytes"], "base64"))
          : this.decode(x["value"]["bytes"]);
      let uintVal = x["value"]["uint"];
      let valType = x["value"]["type"];

      newState[key] = valType == 1 ? bytesVal : uintVal;
    }
    return newState;
  }

  // this will be changed later to getAllLocalStates
  async getOptedInAccountsAndVotes(appID) {
    let optedInAccounts = {
      'yes': [],
      'no': [],
      'maybe': []
    };
    let allVotes = {}

    let accountInfo = await this.indexerClient.searchAccounts().applicationID(appID).do();

    let accounts = accountInfo['accounts'];
    console.log(accounts);

    // go through all the accounts looking at 'can_vote' variable and add account to correct array
    for (let acc of accounts) {
      let apps = acc["apps-local-state"];
      if (apps) {
        for (let app of apps) {
          if (app["id"] == appID) {
            for (let keyValue of app["key-value"]) {
              let key = this.decode(keyValue["key"]);
              if (key == "can_vote") {
                let value = this.decode(keyValue["value"]["bytes"]);
                optedInAccounts[value].push(acc["address"]);
              } else if (key == "voted") {
                allVotes[acc["address"]] = keyValue["value"]["uint"];
              }
            }
          }
        }
      }
    }

    return [optedInAccounts, allVotes];
  }

  // signAndSend
  // Description:
  //  Signs the given transaction using AlgoSigner then sends it out
  // Parameters: 
  //  txn (algosdk transaction) - transaction that needs to be signed
  async signAndSend(txn) {
    let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    let signedTxs = await window.AlgoSigner.signTxn([{txn: txn_b64}]);
    console.log(signedTxs);

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
    console.log(`Attempting to opt-in account ${address} to ${appID}`);
    let params = await this.algodClient.getTransactionParams().do();

    let txn = algosdk.makeApplicationOptInTxn(address, params, appID);
    console.log(txn);

    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  // creatorApprove TODO: rename to creatorUpdateUserStatus
  // Description:
  //  sends a transaction from the creator (creatorAddress) to the given app (appID) to approve/reject the given user (userAddress)
  // Parameters:
  //  creatorAddress (string) - address of the creator who is allowed to approve for the transaction
  //  userAddress (string) - address of the user who is being approved/rejected
  //  yesOrNo (string) - "yes" or "no" depending on if the creator wants the user to be allowed to vote or not
  //  appID (number) - app id (aka index) of the smart contract app
  async creatorApprove(creatorAddress, userAddress, yesOrNo, appID) {
    console.log(`${creatorAddress} attempting to ${yesOrNo == 'yes' ? 'approve' : 'deny'} account ${userAddress}`);

    let params = await this.algodClient.getTransactionParams().do();
    let appArgs = [];

    let decodedAddress = algosdk.decodeAddress(userAddress);
    appArgs.push(new Uint8Array(Buffer.from('update_user_status')));
    appArgs.push(decodedAddress.publicKey);
    appArgs.push(new Uint8Array(Buffer.from(yesOrNo)));
    console.log(appArgs);

    let txn = algosdk.makeApplicationNoOpTxn(
      creatorAddress,
      params,
      appID,
      appArgs,
      [creatorAddress, userAddress]
    )
    console.log(txn);

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

    let params = await this.algodClient.getTransactionParams().do();

    let appArgs = [];
    appArgs.push(new Uint8Array(Buffer.from('vote')));
    appArgs.push(algosdk.encodeUint64(optionIndex));
    console.log(appArgs);

    let txn = algosdk.makeApplicationNoOpTxn(
      address,
      params,
      appID,
      appArgs
    )
    console.log(txn);


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
