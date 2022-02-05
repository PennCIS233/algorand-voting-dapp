const algosdk = require('algosdk')

// This will handle all algosdk and algosigner code
class AlgoHandler {
  constructor() {
    setTimeout(200, () => {
      if(typeof window.AlgoSigner == 'undefined') {
        console.log('Please install the AlgoSigner extension');
        alert('Please install the AlgoSigner extension');
        return;
      }
    });
    console.log('New AlgoHandler');

    this.accounts = [];
    this.mainAccount = null;
    
    const algodToken = { 
      'X-API-Key': 'OtAhhF0GEa3GnYbsgghbx4L9qO9Ebq6J9m1sjOS0'
    };
    const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
    const algodPort = '';
    this.algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  }

  // connects to AlgoSigner accounts on TestNet
  async connectToAccounts() {
    if(typeof window.AlgoSigner == 'undefined') {
      console.log('Please install the AlgoSigner extension');
      alert('Please install the AlgoSigner extension');
      return;
    }

    // attempts to connect to AlgoSigner accounts, will prompt user to allow access to accounts
    try {
      await window.AlgoSigner.connect();
    } catch (e) {
      console.log(e);
      console.log('Please allow this app to connect to your AlgoSigner accounts');
      alert('Please allow this app to connect to your AlgoSigner accounts');
      return;
    }

    // gets information on all the user's TestNet accounts in their AlgoSigner
    // tempAccounts = [{address: 'fsdaklfjdsa'}, {address: 'fsdafsdfer'}, etc]
    let tempAccounts = await window.AlgoSigner.accounts({
      ledger: 'TestNet'
    });
    // make data easier to use
    // this.accounts = ['fsdaklfjdsa', 'fsdafsdfer', etc]
    this.accounts = tempAccounts.map((x) => { return x['address']});

    console.log('Connected to accounts');
    console.log(this.accounts);

    return this.accounts;
  }

  // use for when switching accounts
  selectMainAccount(address) {
    this.mainAccount = address;
  }

  // isCreator
  // electionAddress - address of the specified election
  // accountAddress - address of the specified user's account
  // return bool - whether the given accountAddress is the creator of the election at electionAddress
  async isCreator(appID, accountAddress) {
    // retrieve account's applications
    // see if any of the account's applications have the appID
    let accountInfoResponse = await this.algodClient.accountInformation(accountAddress).do();
    console.log(accountInfoResponse);
    for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) { 
      if (accountInfoResponse['created-apps'][i].id == appID) {
          console.log(`${accountAddress} is creator of ${appID}`);
          return true;
      }
    }
    console.log(`${accountAddress} is NOT creator of ${appID}`);
    return false;
  }

  decode(encoded) {
    return Buffer.from(encoded, "base64").toString();
  }

  async getElectionState(appID, creatorAddress) {
    let newState = {};

    let accountInfoResponse = await this.algodClient.accountInformation(creatorAddress).do();
    for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) { 
      if (accountInfoResponse['created-apps'][i].id == appID) {
        console.log("Application's global state:");
        for (let x of accountInfoResponse['created-apps'][i]['params']['global-state']) {
          console.log(x);
          // console.log(Buffer.from(x['value']['bytes'], '64').toString());
          // console.log(Number(x['value']['uint']));
          let key = this.decode(x['key']);
          let bytesVal = (key == 'Creator') ? algosdk.encodeAddress(Buffer.from(x['value']['bytes'], "base64")) : this.decode(x['value']['bytes']);
          let uintVal = x['value']['uint'];
          let valType = x['value']['type'];

          newState[key] = (valType == 1) ? bytesVal : uintVal;
        }

        return newState;
      }
    }
  }
}

var mainAlgoHandler = new AlgoHandler();

export default mainAlgoHandler;