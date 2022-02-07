import { decodeAddress } from "algosdk";

const algosdk = require("algosdk");

// This will handle all algosdk and algosigner code
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

    this.accounts = [];

    const algodToken = {
      "X-API-Key": "OtAhhF0GEa3GnYbsgghbx4L9qO9Ebq6J9m1sjOS0",
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = "";
    this.algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
    this.indexerClient = new algosdk.Indexer(
      algodToken,
      indexerServer,
      algodPort
    );
  }

  // connects to AlgoSigner accounts on TestNet
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
      console.log(
        "Please allow this app to connect to your AlgoSigner accounts"
      );
      alert("Please allow this app to connect to your AlgoSigner accounts");
      return;
    }

    // gets information on all the user's TestNet accounts in their AlgoSigner
    // tempAccounts = [{address: 'fsdaklfjdsa'}, {address: 'fsdafsdfer'}, etc]
    let tempAccounts = await window.AlgoSigner.accounts({
      ledger: "TestNet",
    });
    // make data easier to use
    // this.accounts = ['fsdaklfjdsa', 'fsdafsdfer', etc]
    this.accounts = tempAccounts.map((x) => {
      return x["address"];
    });

    console.log("Connected to accounts");
    console.log(this.accounts);

    return this.accounts;
  }

  // isCreator
  // electionAddress - address of the specified election
  // accountAddress - address of the specified user's account
  // return bool - whether the given accountAddress is the creator of the election at electionAddress
  async isCreator(appID, accountAddress) {
    // retrieve account's applications
    // see if any of the account's applications have the appID
    let accountInfoResponse = await this.algodClient
      .accountInformation(accountAddress)
      .do();
    console.log(accountInfoResponse);
    for (let i = 0; i < accountInfoResponse["created-apps"].length; i++) {
      if (accountInfoResponse["created-apps"][i].id == appID) {
        console.log(`${accountAddress} is creator of ${appID}`);
        return true;
      }
    }
    console.log(`${accountAddress} is NOT creator of ${appID}`);
    return false;
  }

  // decodes bytes to strings
  decode(encoded) {
    return Buffer.from(encoded, "base64").toString();
  }

  // retrieve global variables of election
  async getElectionState(appID) {
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

  async getOptedInAccountsAndVotes(appID) {
    let optedInAccounts = {
      yes: [],
      no: [],
      maybe: [],
    };
    let allVotes = {};

    let accountInfo = await this.indexerClient
      .searchAccounts()
      .applicationID(appID)
      .do();

    let accounts = accountInfo["accounts"];
    console.log(accounts);

    // go through all the accounts looking at 'can_vote' variable and add account to correct array
    for (let acc of accounts) {
      let apps = acc["apps-local-state"];
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

    return [optedInAccounts, allVotes];
  }

  async signAndSend(txn) {
    let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    let signedTxs = await window.AlgoSigner.signTxn([{ txn: txn_b64 }]);
    console.log(signedTxs);

    let tx = await window.AlgoSigner.send({
      ledger: "TestNet",
      tx: signedTxs[0].blob,
    });

    return tx;
  }

  async optInAccount(address, appID) {
    console.log(`Attempting to opt-in account ${address} to ${appID}`);
    let params = await this.algodClient.getTransactionParams().do();

    let txn = algosdk.makeApplicationOptInTxn(address, params, appID);
    console.log(txn);

    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  async creatorApprove(senderAddress, approvingAccount, yesOrNo, appID) {
    console.log(
      `${senderAddress} attempting to ${
        yesOrNo == "yes" ? "approve" : "deny"
      } account ${approvingAccount}`
    );

    let params = await this.algodClient.getTransactionParams().do();
    let appArgs = [];

    let decodedAddress = algosdk.decodeAddress(approvingAccount);
    appArgs.push(new Uint8Array(Buffer.from("update_user_status")));
    appArgs.push(decodedAddress.publicKey);
    appArgs.push(new Uint8Array(Buffer.from(yesOrNo)));
    console.log(appArgs);

    let txn = algosdk.makeApplicationNoOpTxn(
      senderAddress,
      params,
      appID,
      appArgs,
      [senderAddress, approvingAccount]
    );
    console.log(txn);

    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }

  async vote(senderAddress, optionIndex, appID) {
    console.log(
      `${senderAddress} attempting to vote for option ${optionIndex}`
    );

    let params = await this.algodClient.getTransactionParams().do();

    let appArgs = [];
    appArgs.push(new Uint8Array(Buffer.from("vote")));
    appArgs.push(algosdk.encodeUint64(optionIndex));
    console.log(appArgs);

    let txn = algosdk.makeApplicationNoOpTxn(
      senderAddress,
      params,
      appID,
      appArgs
    );
    console.log(txn);

    let tx = await this.signAndSend(txn);
    console.log(tx);

    return tx;
  }
}

var mainAlgoHandler = new AlgoHandler();

export default mainAlgoHandler;
