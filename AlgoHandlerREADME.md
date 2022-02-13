## Step 4 - Frontend Logic: `AlgoHandler.js` 
  
If our frontend wants to display relevant information to our users it will need a way to retrieve data from the Algorand blockchain. Similarly, if our frontend wants to allow users to interact with our election smart contract our frontend will need to be able to send transactions to the Algorand blockchain. We will make use of the PureStake Algod client and Indexer client to retrieve information about the current state of our smart contract. We will use the AlgoSDK and AlgoSigner to create, sign, and send transactions to be added to the Algorand TestNet.

#### How
`frontend/src/components/AlgoHandler.js` is meant to contain all functionality related to retrieving information about the smart contract and sending transactions to the Algorand TestNet.
  
### Step 4.0 - Getting Familiar with the Tools  

#### JavaScript  
  
We do not assume that you have extensive knowledge about JavaScript. JavaScript is a very newcomer-friendly language that aligns nicely with other languages' syntax and paradigms. You will need to know variables, functions, loops, conditionals, and async/await in JavaScript. Here are some resources to get you started:  
- [Learn javascript in Y Minutes](https://learnxinyminutes.com/docs/javascript/ "Learn javascript in Y Minutes") - basic JavaScript information  
- [The await keyword](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await#the_await_keyword "The await keyword") - Essentially all you need to know about async/await for this homework  
- Google - We highly encourage you to search for documentation, tutorials, and other resources if you would like to know more about any functionality or design patterns in JavaScript (how to iterate through an array, ternary operations, etc)  
  
#### AlgoSDK  

In Practical Homework 1 and parts of this homework you have used the Python version of the AlgoSDK. The frontend will make use of the JavaScript version of the AlgoSDK. Both versions are very similar in functionality and even close in syntax. 

Take a look at the documentation here for how the Javscript AlgoSDK interacts with smart contracts: 
- [https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/apps/](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/apps/)
- https://algorand.github.io/js-algorand-sdk/

#### AlgoSigner

You downloaded the AlgoSigner extension in step 0. Now any website visited will have AlgoSigner code injected into the website that can be used by the website. This code can be accessed through the variable `window.AlgoSigner`. 

Here is some useful documentation: 
- https://github.com/PureStake/algosigner/blob/develop/docs/dApp-integration.md#working-with-transactions
- https://purestake.github.io/algosigner-dapp-example/

#### Purestake Indexer API

Purestake has an API setup for querying historical data from the Algorand blockchain. You will use this API to retrieve data on who has opted-in to your election. 

Take a look at this example to see how it uses the Indexer to read the local state of all accounts which opted-in to the application: https://developer.algorand.org/solutions/example-digital-exchange-smart-contract-application/

#### AlgoHandler.js `frontend/src/components/AlgoHandler.js`

This file exports a singular instance of the class it contains which is meant to encapsulate data retrieval and transaction-sending from and to the Algorand blockchain.  
  
We provide you a skeleton outline with all the necessary functions needed for you to fill out. You will be graded on producing the correct outputs for these functions (for those that have a specified return) and for sending the correct properly-formatted transactions (for those that require sending a transaction) .

### Step 4.1 - AlgoHandler constructor

In `frontend/src/components/AlgoHandler.js` fill out the `TODO` sections. Remember, don't change the variable names. You can define additional variables if needed.

- Set the `this.algodClient` variable
- Set the `this.indexerClient` variable

### Step 4.2 - Retrieving Data

In `frontend/src/components/AlgoHandler.js` fill out the following 4 functions with the commented functionality. Remember, don't change the function names. Feel free to add helper functions if you want. Remember to use JavaScript's `await` keyword when using `this.algodClient`, `this.algodIndexer`, and `window.AlgoSigner`

#### Relevant Documentation

- https://developer.algorand.org/solutions/example-digital-exchange-smart-contract-application/
- https://github.com/PureStake/algosigner/blob/develop/docs/dApp-integration.md#algosignerconnect

 1. `getAlgoSignerAccounts()`
    - **TODO:** Connect to AlgoSigner
    - **TODO:** Retrieve all addresses in array format and return them
 2. `isCreator(appID, address)`
    - **TODO:** Return a boolean based on if the given `address` is the creator of the app at `appID`
    - **HINT:** Two possible approaches are given in the code comments
 3. `getElectionState(appID)`
    - **TODO:** Use `this.algodClient` to retrieve the app details
    - The rest is filled out for you :)
 4. `getAllLocalStates(appID)`
    - **TODO:** Use `this.indexerClient` to find all accounts who are associated with the given app
    - **TODO:** Take the data and format it into a neat JavaScript object (nearly equivalent to a Python dictionary) as specified
      - Example:
      ``` 
        {
          'jsdalkfjsd...': {
            'can_vote': 'yes', 
            'voted': 2
          }, 
          'fdsfdsaf...': {
            'can_vote': 'no'
          },
          'asdffdsaf...': {
            'can_vote': 'maybe'
          }
        }
      ```
      - **Note:** Only include values that are included in the original object. If a user does not have a value for `voted` then don't include the `voted` variable

### Step 4.3 - Sending Transactions

In `frontend/src/components/AlgoHandler.js` fill out the following 6 functions with the commented functionality. Remember, don't change the function names. Feel free to add helper functions if you want. Remember to use JavaScript's `await` when using `this.algodClient`, `this.algodIndexer`, and `window.AlgoSigner`

#### Relevant Documentation

- https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/apps/#application-methods
- https://github.com/PureStake/algosigner/blob/develop/docs/dApp-integration.md#algosignersigntxntxnobjects
- https://algorand.github.io/js-algorand-sdk/

 1. `signAndSend(txn)`
     - **TODO:** Convert the transaction to Base64 with AlgoSigner's method
     - **TODO:** Sign the base64 transaction with AlgoSigner
     - **TODO:** Send the message with AlgoSigner
 2. `optInAccount(address, appID)`
     - **TODO:** Get the suggested params from `this.algodClient`
     - **TODO:** Create the opt-in transaction
     - **TODO:** Sign and send the transaction with our `this.signAndSend` function
 3. `updateUserStatus(creatorAddress, userAddress, yesOrNo, appID)`
    - **TODO:** Get the suggested params from `this.algodClient`
    - **TODO:** Set up the transaction app arguments
    - **TODO:** Create the transaction
      - Include both the creator's address and user's address in the optional address array when creating the transaction (different from app args)
    - **TODO:** Sign and send the transaction with our `this.signAndSend` function
 4. `vote(address, optionIndex, appID)`
    - **TODO:** Create app parameters, create transaction, sign and send 
 5. `closeOut(address, appID)`
    - **TODO:** Create transaction, sign and send, similar to above
 6. `clearState(address, appID)`
    - **TODO:** Create transaction, sign and send, similar to above
