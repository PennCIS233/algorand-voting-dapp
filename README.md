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

## Step 1 - Create the smart contract
In ``` election_smart_contract.py ```, you will be creating a smart contract that conducts an election with multiple discrete choices. You will define each choice as a byte string and user accounts will be able to register and vote for any of the choices. There is a configurable election period defined by global variable, `ElectionEnd` which is relative to the current time
- An account must register in order to vote
- Accounts cannot vote more than once. Accounts that close out of the application before the voting period has concluded, denoted by the global variable, ElectionEnd
- The creator of the election has to approve every account that opts in 

Here's simplified overview of the election smart contract: 
1.  Creator deploys smart contract
2.  User(s) opt-in to the contract
3.  Creator approves/reject user's ability to vote
4.  Approved user can cast vote once
4b. Approved user who voted can remove their vote (potentially then revote) if they closeout or clear program
5.  Repeat 2 to 4 for each user who opts-in before the election end
6.  Election ends and no further changes (opt-ins, votes, approvals/rejects) can be made to the election

### Global Variables
For standardization, we require everyone use the same global variable names in the approval program of the smart contract. 

`Creator` (bytes)
- 32-byte address of the deployer of the smart contract

```ElectionEnd``` (int)
- Round number for when the election will end
- Round number is how the algorand blockchain keeps track of time
- After this round number/time no more opting-in, voting, approvals, etc

```VoteOptions``` (bytes)
- String consisting of all vote options concatenated together separated with commas
- Example: Abby, Barney, Cho, and Di are options then VoteOptions=”Abby,Barney,Cho,Di”

```NumVoteOptions``` (int)
- Number of options to vote for
- We need this variable because Teal/Pyteal/Algorand doesn’t have arrays, so we store the vote options as a string (see above), so we need this variable to tell the smart contract how many voting options there are
- Example: Abby, Barney, Cho, and Di are options, so VoteOptions=”Abby,Barney,Cho,Di” and NumVoteOptions=4

```VotesFor0, VotesFor1, VotesFor2, etc``` (int)
- Vote tally for option i where i is between 0 and NumVoteOptions
- Because PyTeal allows key-value variables, we can produce these variables in a for-loop on smart contract creation and access them when a user tries to vote using the index value of their vote option choice
- Example: VoteOptions=”Abby,Barney,Cho,Di”. VotesFor0 refers to vote tally for Abby. VotesFor1 refers to vote tally for Barney. VotesFor2 refers to vote tally for Cho. VotesFor3 refers to vote tally for Di


### Approval Program

CREATION: 
Step 1: Store the values of election parameters passed from the application arguments of the election that was created. 
- the creator as whoever deployed the smart contract
- the round number for the end of the election 
- the different options to vote for, 
- the number of options there are to vote for 

Although there are many ways to store the vote options, for the purposes of this project, we want you to store them as a string of options separated by commas e.g., "A,B,C,D". Note that index-wise, A=0, B=1, C=2, D=3

Step 2: For all vote options, set initial vote tallies corresponding to all vote options to 0 where the keys are the vote options.


CLOSE OUT: 
Step 1: Removes the user's vote from the correct vote tally if the user closes out of program before the end of the election. 
Step 2: Check that the voter is still in the election period and has actually voted. If so, update vote tally by subtracting one vote for whom the user voted for.

## Step 2 - Deploy the smart contract

In the deploy script, you will implement functions that are used to interact with the smart contract. Smart contracts are implemented using ApplicationCall transactions. These transaction types are as follows:
- `NoOp` - Generic application calls to execute the ApprovalProgram.
- `OptIn` - Accounts use this transaction to begin participating in a smart contract. Participation enables local storage usage.
- `DeleteApplication` - Transaction to delete the application.
- `UpdateApplication` - Transaction to update TEAL Programs for a contract.
- `CloseOut` - Accounts use this transaction to close out their participation in the contract. This call can fail based on the TEAL logic, preventing the account from removing the contract from its balance record.
- `ClearState` - Similar to CloseOut, but the transaction will always clear a contract from the account’s balance record whether the program succeeds or fails.

## Step 3 - Implement the front end

To use our application, we could write scripts to interact with the blockchain, but it is much easier to interact with a nice user interface. So, we will be connecting our blockchain to a React frontend to interact with the blockchain!

#### A brief tour of our React application

In this project, we have pre-built the React application for you to connect to, but we'll briefly touch over the file structure of our project. 

First, React is a JavaScript library for building user interfaces. It utilizes a **component-based** structure that encapsulates its own state. Within each component, we specify state (which are variables such as the election ID, or user accounts) and then return a snippet of code that tells React how to render the component. For more information about React itself, you can find the documentation [here] (https://reactjs.org/docs/hello-world.html). We also utilize the `react-bootstrap` library, which has out-of-the-box components to create a nicer UI. Read more about it [here] (https://react-bootstrap.github.io/components/alerts).

Pages:
- **ConnectPage.js**: The ConnectPage prompts the user to connect to the AlgoSigner browser extension, and once the user is connected, allows the user to input the election id. 
- **ElectionPage.js**: The ElectionPage holds the majority of the functionality: it lets you see all participants in the election, view information about the election, and allows the user to participate in the election.

Components:
- **NavBar.js**: The NavBar component allows the participant to choose your current account, so you can participate in the election from that account.
- **ElectionInfoCard.js**: The ElectionInfoCard component displays the election creator, the last round to participate in the election, the number of votes, the vote options, and a pie chart displaying the vote distribution.
- **ParticipantsCard.js**: The ParticipantsCard component has three tabs: accepted, rejected, and pending. Each of these categories has a list of participants. The list of accepted users also contains the vote that they chose if they have made one. The list of pending users will also contain Accept/Reject buttons if the current account is a creator account. 
- **VoterCard.js**: The VoterCard component displays a card that will 
- **AlgoHandler.js**: The AlgoHandler component contains many helper functions that you will be implementing. You will have to implement functions to interact with the election, such as voting and opting-in, as well as functions to retrieve information about the state of the election.


### Step 2.0

