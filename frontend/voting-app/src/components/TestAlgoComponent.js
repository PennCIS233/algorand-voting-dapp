import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import mainAlgoHandler from "./AlgoHandler";
import { Button, Dropdown, Form, ListGroup } from "react-bootstrap";
import { useReducer } from "react";

function TestAlgoComponent() {
  const [accounts, setAccounts] = useState([]);
  const [mainAccount, setMainAccount] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [appID, setAppID] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [electionState, setElectionState] = useState({});

  useEffect(() => {
    
  });

  const connectAlgoSigner = async (e) => {
    let newAccounts = await mainAlgoHandler.connectToAccounts();
    setAccounts(newAccounts);
  };

  const changeMainAccount = async (acc) => {
    setMainAccount(acc);

    if (appID != '') setIsCreator(await mainAlgoHandler.isCreator(appID, acc));
  }

  const connectElection = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(formData);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);

    let newElectionState = await mainAlgoHandler.getElectionState(formDataObj['appID']);

    setAppID(formDataObj['appID']);
    setElectionState(newElectionState);
    setCreatorAddress(newElectionState['Creator']);

    setIsCreator(newElectionState['Creator'] == mainAccount);
  };

  const getElectionState = async (e) => {
    let newElectionState = await mainAlgoHandler.getElectionState(appID, creatorAddress);
    setElectionState(newElectionState);
  }

  return (
    <Container className="mb-3">
        <Row className="mt-3">
          <h2>Test Algo Component</h2>
        </Row>
        <Row className="mb-3">
          <Container>
            <Button onClick={async () => await connectAlgoSigner()}>Connect to AlgoSigner</Button>
            </Container>
        </Row>
        <Row>
          <Container>
            <h4>Choose your account</h4>
              <ListGroup >
                  {accounts.map((acc, index) => (
                    <ListGroup.Item eventKey={acc} onClick={async () => await changeMainAccount(acc)} key={"li"+acc+index} action>
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
        {isCreator ? 
          <p>Yes, you are the creator</p> : 
          <div>No, you are not</div>
        }
      </Row>
      <Row>
        <h3>Election State</h3>
        <Button onClick={async () => await getElectionState()}>Get Election State</Button>
        <p>{JSON.stringify(electionState)}</p>
      </Row>
    </Container>
  );
}

export default TestAlgoComponent;
