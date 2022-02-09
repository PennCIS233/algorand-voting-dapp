import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import mainAlgoHandler from "./AlgoHandler";
import { Button, Form, ListGroup } from "react-bootstrap";
// import { useReducer } from "react";

function TestAlgoComponent() {
  const [accounts, setAccounts] = useState([]);
  const [mainAccount, setMainAccount] = useState("");
  const [creatorAddress, setCreatorAddress] = useState("");
  const [appID, setAppID] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [electionState, setElectionState] = useState({});
  const [optedInAccounts, setOptedInAccounts] = useState({
    'yes': [],
    'no': [],
    'maybe': []
  });
  const [voteOptions, setVoteOptions] = useState([]);
  const [allVotes, setAllVotes] = useState({});

  useEffect(() => {});

  const connectAlgoSigner = async (e) => {
    let newAccounts = await mainAlgoHandler.connectToAccounts();
    setAccounts(newAccounts);
  };

  const changeMainAccount = async (acc) => {
    setMainAccount(acc);

    if (appID != "") setIsCreator(await mainAlgoHandler.isCreator(appID, acc));
  };

  const connectElection = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());

    let newElectionState = await mainAlgoHandler.getElectionState(formDataObj['appID']);
    let [newOptedInAccounts, newAllVotes] = await mainAlgoHandler.getOptedInAccountsAndVotes(formDataObj['appID']);

    let newVoteOptions = newElectionState['VoteOptions'].split(',');

    setAppID(Number(formDataObj['appID']));
    setElectionState(newElectionState);
    setVoteOptions(newVoteOptions);
    setAllVotes(newAllVotes);
    setCreatorAddress(newElectionState['Creator']);
    setOptedInAccounts(newOptedInAccounts)

    setIsCreator(newElectionState["Creator"] == mainAccount);
  };

  const getElectionState = async (e) => {
    let newElectionState = await mainAlgoHandler.getElectionState(appID);
    let [newOptedInAccounts, newAllVotes] = await mainAlgoHandler.getOptedInAccountsAndVotes(appID);

    let newVoteOptions = newElectionState['VoteOptions'].split(',');

    setElectionState(newElectionState);
    setVoteOptions(newVoteOptions);
    setAllVotes(newAllVotes);
    setOptedInAccounts(newOptedInAccounts)
  }

  const hasUserOptedIn = () => {
    return (JSON.stringify(optedInAccounts).includes(mainAccount));
  }

  const getUserOptInStatus = () => {
    for (let key in optedInAccounts) {
      if (optedInAccounts[key].includes(mainAccount)) return key;
    }
    return null;
  }

  const optInAccount = async () => {
    await mainAlgoHandler.optInAccount(mainAccount, appID);
  }

  const creatorApprove = async (user, choice) => {
    await mainAlgoHandler.creatorApprove(mainAccount, user, choice, appID);
  }

  // a user is allowed to vote iff they have 'yes' as can_vote and they have not already voted
  const canMainAccountVote = () => {
    return optedInAccounts['yes'].includes(mainAccount) && !(mainAccount in allVotes);
  }

  const vote = async (optionIndex) => {
    await mainAlgoHandler.vote(mainAccount, optionIndex, appID);
  }

  const mainAccountCloseOut = async () => {
    await mainAlgoHandler.closeOut(mainAccount, appID);
  }

  const mainAccountClearState = async () => {
    await mainAlgoHandler.clearState(mainAccount, appID);
  }

  return (
    <Container className="mb-3">
      <Row className="mt-3">
        <h2>Test Algo Component</h2>
      </Row>
      <Row className="mb-3">
        <Container>
          <Button onClick={async () => await connectAlgoSigner()}>
            Connect to AlgoSigner
          </Button>
        </Container>
      </Row>
      <Row>
        <Container>
          <h4>Choose your account</h4>
          <ListGroup>
            {accounts.map((acc, index) => (
              <ListGroup.Item
                eventKey={acc}
                onClick={async () => await changeMainAccount(acc)}
                key={"li" + acc + index}
                action
              >
                {acc}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <p>Connected Account: {mainAccount}</p>
        </Container>
      </Row>
      <Row className="mb-3">
        <h3>Connect to Election</h3>
        <Form onSubmit={async (e) => await connectElection(e)}>
          <Form.Group className="mb-3" controlId="formAppID">
            <Form.Label>Smart Contract App ID</Form.Label>
            <Form.Control name="appID" type="lg" placeholder="App ID" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Connect
          </Button>
        </Form>
      </Row>
      <Row className="mb-3">
        <h3>Are you the creator of this smart contract?</h3>
        {isCreator ? (
          <p>Yes, you are the creator</p>
        ) : (
          <div>No, you are not</div>
        )}
      </Row>
      <Row>
        <h3>Election State</h3>
        <Button onClick={async () => await getElectionState()}>Get Election State</Button>
        <h5>Global Variables</h5>
        <div><pre>{JSON.stringify(electionState, null, 2)}</pre></div>
        <h5>Opted-In Accounts can_vote Status</h5>
        <div><pre>{JSON.stringify(optedInAccounts, null, 2)}</pre></div>
      </Row>
      <Row>
        <h3>Opt-In</h3>
        {(!hasUserOptedIn() && 
          <div>
            <p><b>You have NOT opted-in</b></p>
            <Button onClick={async () => {await optInAccount()}}>Opt-In</Button>
            <p>After clicking this button wait 10 seconds then press the  'Get Election State' button</p>
          </div>
          ) 
          || 
          <div>
            <p>You have opted in.</p>
            {getUserOptInStatus() == 'yes' && <p>You are allowed to vote</p>}
            {getUserOptInStatus() == 'no' && <p>You are NOT allowed to vote</p>}
            {getUserOptInStatus() == 'maybe' && <p>Your voting status is still being determined</p>}
          </div>
          
          }
        {/* {hasUserOptedIn() && <p><b>You have opted-in</b></p>} */}
      </Row>
      <Row>
        <h3 className="mb-3">Vote</h3>
        <h5>All votes</h5>
        <div className="mb-3">
          <pre>{JSON.stringify(allVotes, null, 2)}</pre>
        </div>
        {voteOptions.map((option, index) => (
          <Card key={`vote-option-${option}-${index}`} className="mb-3">
            <h6>{option}</h6>
            <p>{electionState[`VotesFor${index}`]} votes</p>
            <div>
              {(() => {
                if (allVotes[mainAccount] == index) {
                  return (<Badge bg="success">Your Vote</Badge>);
                } else if (canMainAccountVote()) {
                  return (<Button variant='primary' onClick={async () => {await vote(index)}}>Vote</Button>);
                } else {
                  return (<Button variant='secondary' disabled>Vote</Button>);
                }
              })()}
            </div>
          </Card>
        ))}
      </Row>
      <Row>
        <h3>Pending Voters</h3>
        {optedInAccounts['maybe'].map((acc, index) => (
          <Card key={`card-${acc}-${index}`} className="mb-3">
            <h6>{acc}</h6>
            {isCreator ? 
              <div className="mb-3">
                <div>You are allowed to Allow or Deny this account's ability to vote</div>
                <Button variant='success' onClick={async () => {await creatorApprove(acc, 'yes')}}>Allow</Button>
                <Button variant='danger' onClick={async () => {await creatorApprove(acc, 'no')}}>Deny</Button>
              </div> :
              <div className="mb-3">
                <div>You are NOT allowed to Allow or Deny this account's ability to vote</div>
                <Button variant='success' disabled>Allow</Button>
                <Button variant='danger' disabled>Deny</Button>
              </div>
            }
          </Card>
        ))}
      </Row>
      <Row>
        { hasUserOptedIn() &&
          <div>
            <Button onClick={async () => {await mainAccountCloseOut()}}>Close out</Button>
            <Button onClick={async () => {await mainAccountClearState()}}>Clear state</Button>
          </div>
        }
      </Row>
    </Container>
  );
}

export default TestAlgoComponent;
