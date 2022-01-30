import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import NavBar from "./components/NavBar";
import VoteChart from "./components/VoteChart";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      electionId: 0,
      disableElection: false,
      user: 0,
      disableUser: false,
      currVotes: [
        { title: "1", value: 2, color: "#800080" },
        { title: "2", value: 5, color: "#FF0000" },
        { title: "3", value: 1, color: "#0000FF" },
        { title: "4", value: 5, color: "#00FF00" },
        { title: "5", value: 3, color: "#FF00FF" },
      ],
      voteChoice: 0,
      disableVote: false,
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
    this.setState({ disableUser: true });
    console.log(this.state.user);
    // TODO: create/find user
  }

  handleVoteSelect(e) {
    this.setState({ voteChoice: e.target.value });
  }

  handleVoteSubmit(e) {
    e.preventDefault();
    this.setState({ disableVote: true });
    console.log(this.state.voteChoice);
    // TODO: send vote to blockchain
  }

  render() {
    return (
      <>
        <NavBar />
        <Container className="px-5">
          <Row>
            <Container className="px-5">
              <Card className="mt-5">
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
          <Row>
            <Container className="px-5">
              <Card className="mt-5">
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
          </Row>
          <Row className="mt-5">
            <Col>
              <Container className="pl-5">
                <Form onSubmit={this.handleVoteSubmit}>
                  <Form.Select
                    disabled={this.state.disableVote}
                    onChange={this.handleVoteSelect}
                  >
                    <option>Open this select menu</option>
                    {this.state.currVotes.map((choice) => (
                      <option key={choice.title} value={choice.title}>
                        {choice.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Button variant="info" type="submit">
                    Submit
                  </Button>
                </Form>
              </Container>
            </Col>
            <Col>
              <VoteChart currVotes={this.state.currVotes} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;
