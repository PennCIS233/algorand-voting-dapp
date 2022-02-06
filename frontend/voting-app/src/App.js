import React from "react";
import Container from "react-bootstrap/Container";

import NavBar from "./components/NavBar";
import VoterPage from "./pages/VoterPage";
import ConnectPage from "./pages/ConnectPage";
import ElectionPage from "./pages/ElectionPage";
import CreatorPage from "./pages/CreatorPage";

import "./App.css";

import mainAlgoHandler from "./components/AlgoHandler";
import TestAlgoComponent from "./components/TestAlgoComponent";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      electionId: 0,
    };
  }

  render() {
    return (
      <div className="background-color">
        <NavBar />
        <Container>
          <CreatorPage />
        </Container>
      </div>
    );
  }
}

export default App;

/*
{!this.state.disableElection && (
            <Row className="px-5">
              <Container className="px-5">
                <Card className="mt-5" bg="light">
                  <Card.Header>Election ID</Card.Header>
                  <Card.Body>
                    <Form onSubmit={this.handleElectionSubmit}>
                      <Form.Group className="mb-3" controlId="electionId">
                        <Form.Control
                          disabled={this.state.disableElection}
                          type="election"
                          placeholder="Enter election id"
                          onChange={this.handleElectionChange}
                        />
                      </Form.Group>
                      <Button variant="info" type="submit">
                        Submit
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Container>
            </Row>
          )}
          {this.state.disableElection && (
            <div>
              <Row className="px-5 mt-5">
                {!this.state.disableUser && (
                  <Container className="px-5">
                    <Card bg="light">
                      <Card.Header>Register for Election</Card.Header>
                      <Card.Body>
                        <Form onSubmit={this.handleRegisterSubmit}>
                          <Form.Group className="mb-3" controlId="userId">
                            <Form.Control
                              disabled={this.state.disableUser}
                              type="user"
                              placeholder="Enter user id"
                              onChange={this.handleRegisterChange}
                            />
                          </Form.Group>
                          <Button variant="info" type="submit">
                            Submit
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Container>
                )}
                {this.state.disableUser && (
                  <Container className="px-5">
                    <Card bg="light">
                      <Card.Header>Cast Your Vote</Card.Header>
                      <Card.Body>
                        <Form onSubmit={this.handleVoteSubmit}>
                          <Form.Group controlId="vote-options">
                            {this.state.currVotes.map((choice) => (
                              <Form.Check
                                disabled={this.state.disableVote}
                                type="radio"
                                key={choice.title}
                                value={choice.title}
                                name="choices"
                                label={choice.title}
                                onChange={this.handleVoteSelect}
                              />
                            ))}
                          </Form.Group>
                          <Button variant="info" type="submit">
                            Submit
                          </Button>
                        </Form>
                      </Card.Body>
                      <Card.Footer>
                        Remember, you can only vote once!
                      </Card.Footer>
                    </Card>
                  </Container>
                )}
              </Row>
              <Row className="px-5 mt-5">
                <Col className="pl-0">
                  <Card bg="light">
                    <Card.Header>Election Statistics</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        You are currently viewing election{" "}
                        {this.state.electionId}
                      </Card.Text>
                      {!this.state.disableUser && (
                        <Card.Text>
                          Once you register for the election, you can vote!
                        </Card.Text>
                      )}
                      {this.state.disableUser && (
                        <Card.Text>
                          You are registered as user {this.state.user}
                        </Card.Text>
                      )}
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          Registration Start: 12:00am
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Registration End: 12:00pm
                        </ListGroup.Item>
                        <ListGroup.Item>Total Votes: 21</ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="pr-0">
                  <VoteChart currVotes={this.state.currVotes} />
                </Col>
              </Row>
            </div>
          )}
          */
