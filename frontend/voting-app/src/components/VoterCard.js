import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";

function VoterCard(props) {
  const [isOpted, setIsOpted] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState("");

  // TODO: check if the user was accepted
  // TODO: automatically assign election creator as accepted?

  const handleVoteSelect = (e) => {
    setVoteChoice(e.target.value);
  };

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    setIsVoted(true);
    mainAlgoHandler.vote(props.user, voteChoice, parseInt(props.electionId));
  };

  const handleOptIn = (e) => {
    e.preventDefault();
    setIsOpted(true);
    mainAlgoHandler.optInAccount(props.user, parseInt(props.electionId));
  };

  const handleClear = (e) => {
    e.preventDefault();
    setIsVoted(false);
    // TODO: clear vote on blockchain
  };

  return (
    <Card bg="light" className="text-center">
      {!isOpted && (
        <div>
          <Card.Header>Opt In to the Election</Card.Header>
          <Card.Body>
            <Card.Text>
              To participate in the election, you must opt-in. If the creator of
              the election accepts, you can vote!
            </Card.Text>
            <Form onSubmit={handleOptIn}>
              <Button variant="info" type="submit">
                Opt-In
              </Button>
            </Form>
          </Card.Body>
        </div>
      )}

      {isOpted && !isAccepted && (
        <div>
          <Card.Header>Waiting for Acceptance</Card.Header>
          <Card.Body>
            <Card.Text>
              Waiting for the creator of the election to accept...
            </Card.Text>
          </Card.Body>
        </div>
      )}

      {isAccepted && (
        <div>
          <Card.Header>Cast Your Vote</Card.Header>
          <Card.Body>
            <Form onSubmit={handleVoteSubmit}>
              <Form.Group controlId="vote-options">
                {["A", "B", "C", "D"].map((choice) => (
                  <Form.Check
                    type="radio"
                    key={choice}
                    value={choice}
                    name="choices"
                    label={choice}
                    onChange={handleVoteSelect}
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

      {isVoted && (
        <div>
          <Card.Header>You Voted!</Card.Header>
          <Card.Body>
            <Card.Text>
              You have cast your vote for option {voteChoice}. If you'd like to
              clear your vote, please click the button below.
            </Card.Text>
            <Form onSubmit={handleClear}>
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

export default VoterCard;
