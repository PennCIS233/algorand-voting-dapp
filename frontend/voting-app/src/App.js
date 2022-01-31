import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

import NavBar from "./components/NavBar";
import VoteChart from "./components/VoteChart";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      electionId: 0,
      disableElection: false,
      user: 0,
      disableUser: false,
      currVotes: [
        { title: "1", value: 2, color: "#3181ba" },
        { title: "2", value: 5, color: "#45134c" },
        { title: "3", value: 1, color: "#632656" },
        { title: "4", value: 5, color: "#4dc8e9" },
        { title: "5", value: 3, color: "#aa21b9" },
      ],
      voteChoice: 0,
      disableVote: true,
    };
    this.handleElectionChange = this.handleElectionChange.bind(this);
    this.handleElectionSubmit = this.handleElectionSubmit.bind(this);
    this.handleRegisterChange = this.handleRegisterChange.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleVoteSelect = this.handleVoteSelect.bind(this);
    this.handleVoteSubmit = this.handleVoteSubmit.bind(this);
  }

  handleElectionChange(e) {
    this.setState({ electionId: e.target.value });
  }

  handleElectionSubmit(e) {
    e.preventDefault();
    console.log(this.state.electionId);
    this.setState({ disableElection: true });
    // TODO: search for election on blockchain
  }

  handleRegisterChange(e) {
    this.setState({ user: e.target.value });
  }

  handleRegisterSubmit(e) {
    e.preventDefault();
    this.setState({ disableUser: true, disableVote: false });

    console.log(this.state.user);
    // TODO: create/find user
  }

  handleVoteSelect(e) {
    this.setState({
      voteChoice: e.target.value,
    });
  }

  handleVoteSubmit(e) {
    e.preventDefault();
    this.setState({ disableVote: true });
    console.log(this.state.voteChoice);
    // TODO: send vote to blockchain
  }

  render() {
    return (
      <div className="background-color">
        <NavBar />
        <Container className="px-5">
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
        </Container>
      </div>
    );
  }
}

export default App;
