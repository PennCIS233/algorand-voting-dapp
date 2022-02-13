## Step 3 - Implement Frontend AlgoSDK and Indexer Logic  
  
If our frontend wants to display relevant information to our users it will need a way to retrieve data from the Algorand blockchain. Similarly, if our frontend wants to allow users to interact with our election smart contract our frontend will need to be able to send transactions to the Algorand blockchain.   
  
### Step 3.0 - Getting Familiar with the Tools  

#### JavaScript  
  
We do not assume that you have extensive knowledge about JavaScript. JavaScript is a very newcomer-friendly language that aligns nicely with other languages' syntax and paradigms. You will need to know variables, functions, loops, conditionals, and async/await in JavaScript. Here are some resources to get you started:  
- [Learn javascript in Y Minutes](https://learnxinyminutes.com/docs/javascript/ "Learn javascript in Y Minutes") - basic JavaScript information  
- [The await keyword](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await#the_await_keyword "The await keyword") - Essentially all you need to know about async/await for this homework  
- Google - We highly encourage you to search for documentation, tutorials, and other resources if you would like to know more about any functionality or design patterns in JavaScript (how to iterate through an array, ternary operations, etc)  
  
#### AlgoSDK  

In Practical Homework 1 and parts of this homework you have used the Python version of the AlgoSDK. The frontend will make use of the JavaScript version of the AlgoSDK. Both versions are very similar in functionality and even close in syntax. Take a look at the documentation here for how the Javscript AlgoSDK interacts with smart contracts: [https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/apps/](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/apps/)

#### AlgoSigner

You downloaded the AlgoSigner extension in step 0. Now any website visited will have AlgoSigner code injected into the website that can be used by the code in the website. This code can be accessed through the variable `window.AlgoSigner`. Read this documentation to learn about signing transactions using AlgoSigner: https://github.com/PureStake/algosigner/blob/develop/docs/dApp-integration.md#working-with-transactions

#### Purestake Indexer API

Purestake has an API setup for querying historical data from the Algorand blockchain. You will use this API to retrieve data on who has opted-in to your election. Take a look at this example to see how the it uses the Indexer to read the local state of all accounts which opted-in to the application: https://developer.algorand.org/solutions/example-digital-exchange-smart-contract-application/

#### `frontend/src/components/AlgoHandler.js`

This file exports a singular instance of the class it contains which is meant to encapsulate data retrieval and transaction-sending from and to the Algorand blockchain.  
  
We provide you a skeleton outline with all the necessary functions needed for you to fill out.

### Step 3.1 - Retrieving Data

In `frontend/src/components/AlgoHandler.js` fill out the following 4 functions with the commented functionality. Remember, don't change the function names. Feel free to add helper functions if you want. 

 1. `getAlgoSignerAccounts`
 2. `isCreator`
 3. `getElectionState`
 4. `getAllLocalStates`

### Step 3.2 - Sending Transactions

In `frontend/src/components/AlgoHandler.js` fill out the following 6 functions with the commented functionality. Remember, don't change the function names. Feel free to add helper functions if you want. 

 1. `signAndSend`
 3. `optInAccount`
 4. `updateUserStatus`
 5. `vote`
 6. `closeOut`
 7. `clearState`