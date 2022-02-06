import React, { useEffect, useState } from "react";
import { Row, Card, Container, Button, Form } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

function ConnectPage() {
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  let navigate = useNavigate();

  const connectAlgoSigner = async (e) => {
    let newAccounts = await mainAlgoHandler.connectToAccounts();
    setAccounts(newAccounts);
    setIsConnected(true);
  };

  const handleElectionSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    navigate("/election", {
      state: { accts: accounts, electionId: formDataObj["electionId"] },
    });
  };

  return (
    <>
      <NavBar />
      <Container>
        <Row className="px-3 mt-3">
          <Row>
            <Card className="mt-5" bg="light">
              <Card.Header>Connect to AlgoSigner</Card.Header>
              <Card.Body>
                <Button variant="info" onClick={connectAlgoSigner}>
                  Connect
                </Button>
              </Card.Body>
            </Card>
          </Row>
        </Row>
      </Container>
      <Container>
        <Row className="px-3 mt-3">
          <Card className="mt-5" bg="light">
            <Card.Header>Election ID</Card.Header>
            <Card.Body>
              <Form onSubmit={async (e) => await handleElectionSubmit(e)}>
                <Form.Group className="mb-3" controlId="electionId">
                  <Form.Control
                    disabled={!isConnected}
                    type="election"
                    name="electionId"
                    placeholder="Enter election id"
                  />
                </Form.Group>
                <Button variant="info" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
}

export default ConnectPage;
