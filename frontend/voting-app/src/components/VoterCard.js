import React from "react";
import { Card, Button, Container, Form } from "react-bootstrap";

class VoterCard extends React.Component {
  constructor(props) {
    super(props);
    // assumes user is passed in as a prop
    // TODO: handle when user == creator (auto accept)
    this.state = {
      voteOptions: ["1", "2", "3", "4"],
      voteChoice: "1",
      opted: false,
      accepted: false,
      voted: false,
    };

    this.handleVoteSelect = this.handleVoteSelect.bind(this);
    this.handleVoteSubmit = this.handleVoteSubmit.bind(this);
    this.handleOptIn = this.handleOptIn.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleVoteSelect(e) {
    this.setState({
      voteChoice: e.target.value,
    });
  }

  handleVoteSubmit(e) {
    e.preventDefault();
    this.setState({ voted: true });
    console.log(this.state.voteChoice);
    // TODO: send vote to blockchain
  }

  handleOptIn(e) {
    e.preventDefault();
    this.setState({ opted: true });
    // TODO: send opt-in to blockchain
  }

  handleClear(e) {
    e.preventDefault();
    this.setState({ voted: false });
    // TODO: clear vote on blockchain
  }

  render() {
    return (
      <Card bg="light">
        {!this.state.opted && (
          <div>
            <Card.Header>Opt In to the Election</Card.Header>
            <Card.Body>
              <Card.Text>
                To participate in the election, you must opt-in. If the creator
                of the election accepts, you can vote!
              </Card.Text>
              <Form onSubmit={this.handleOptIn}>
                <Button variant="info" type="submit">
                  Opt-In
                </Button>
              </Form>
            </Card.Body>
          </div>
        )}

        {this.state.opted && !this.state.accepted && (
          <div>
            <Card.Header>Waiting for Acceptance</Card.Header>
            <Card.Body>
              <Card.Text>
                Waiting for the creator of the election to accept...
              </Card.Text>
            </Card.Body>
          </div>
        )}

        {this.state.accepted && (
          <div>
            <Card.Header>Cast Your Vote</Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleVoteSubmit}>
                <Form.Group controlId="vote-options">
                  {this.state.voteOptions.map((choice) => (
                    <Form.Check
                      type="radio"
                      key={choice}
                      value={choice}
                      name="choices"
                      label={choice}
                      onChange={this.handleVoteSelect}
                    />
                  ))}
                </Form.Group>
                <Button variant="info" type="submit">
                  Vote
                </Button>
              </Form>
            </Card.Body>
          </div>
        )}

        {this.state.voted && (
          <div>
            <Card.Header>You Voted!</Card.Header>
            <Card.Body>
              <Card.Text>
                You have cast your vote for option {this.state.voteChoice}. If
                you'd like to clear your vote, please click the button below.
              </Card.Text>
              <Form onSubmit={this.handleClear}>
                <Button variant="info" type="submit">
                  Clear Vote
                </Button>
              </Form>
            </Card.Body>
          </div>
        )}
      </Card>
    );
  }
}
export default VoterCard;
