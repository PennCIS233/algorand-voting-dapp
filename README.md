# Practical Homework 1: Algorand Election dApp      
 In this homework you will build an election dApp (decentralized app), creating a smart contract on the Algorand network and a webapp frontend.    
    
The smart contract will handle the logic and data for the election.    
    
The webapp frontend will allow users to easily interact with the smart contract from their browser.    
  
## Why do this homework   

### Why Smart Contracts?  
  
### Why Web frontends?  
  
  
## Background Concepts  

  ## Overview  
  
  ### Tools

    
## Step 0 - Setup  
  
### Step 0.0 - Complete Practical Homework

1 In [Practical Homework 1](https://github.com/PennCIS233/Practical-HW1) you install **Python** and **Pip**, setup your **PureStake account**, and install **PyCharm**.
      
If you have not setup any of those please refer to the [Practical HW 1](https://github.com/PennCIS233/Practical-HW1).  
      
### Step 0.1 - Download Chrome and AlgoSigner  
  
[Google Chrome](https://www.google.com/chrome) is a browser developed by Google and allows third-party extensions that a user downloads to interact with the webpages which that user visits.      
      
[AlgoSigner](https://www.purestake.com/technology/algosigner/) is a Chrome browser extension created by PureStake which manages a user's Algorand keys, allowing that user to sign and send transactions (sending Algos or smart contract interactions) from their browser. Websites can prompt a transaction, and the user can see the transaction's details and choose whether or not to sign and send it from the AlgoSigner extension.    
    
Once you have Google Chrome installed add the AlgoSigner extension at this [link](https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm?hl=en-US).
    
### Step 0.2 - Setup AlgoSigner Accounts  
  
 In practical homework 1 you created two Algorand accounts. Account A and Account B. Once you have Algorand installed on Chrome do the following.    
    
 - Import Account A and Account B into AlgoSigner **on the TestNet**    
   - Save the addresses in form.md    
 - Create 2 new accounts Account C and Account D using AlgoSigner **on the TestNet**    
   - Save the addresses in form.md    
    
A walkthrough on how to do both of these can be seen here:    
[https://www.youtube.com/watch?v=tG-xzG8r770](https://www.youtube.com/watch?v=tG-xzG8r770)    
    
**Remember to save and safeguard your password and mnemonics!**  
  ### Step 0.3 - Fund AlgoSigner Accounts    
 In the same way as practical homework 1, in order to use your accounts you need to fund them. Use a [dispenser](https://bank.testnet.algorand.network/) to fund the accounts.  
  
### Step 0.4 - Install PyTeal

Install the PyTeal library, `pyteal`, by typing this into your terminal:

```bash
pip3 install pyteal
```


### Step 0.5 - Install Node.js and set up environment

First, check if you have Node installed by running `node -v; npm -v`. You should have a Node version of at least x.x.x.

If you do not have Node.js, you can download it [here] (https://nodejs.org/en/download/).

Next, download the files for this project. Open your terminal, and `cd` into the TODO directory. Once inside the directory, type `npm install`, which will download all the dependencies required for the project. Specifically, the dependencies specified in package.json will be downloaded into a node_modules/ directory.

To see i fyou have everything working, type `npm start`. You should see a basic webpage appear in your browser at localhost:3000. If you made it this far, then your setup has been successful!

