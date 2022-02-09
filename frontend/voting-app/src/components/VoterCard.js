import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";

function VoterCard(props) {
  const [voteChoice, setVoteChoice] = useState("");

  // TODO: check if the user was accepted

  const handleVoteSelect = (e) => {
    setVoteChoice(e.target.value);
  };

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    let voteValue =
      voteChoice == "A" ? 0 : voteChoice == "B" ? 1 : voteChoice == "C" ? 2 : 3;
    mainAlgoHandler.vote(props.user, voteValue, parseInt(props.electionId));
  };

  const handleOptIn = (e) => {
    e.preventDefault();
    mainAlgoHandler.optInAccount(props.user, parseInt(props.electionId));
  };

  const handleClear = (e) => {
    e.preventDefault();
    // TODO: clear vote on blockchain
  };

  return (
    <Card>
      {!props.isOpted && !props.isAccepted && (
        <Card.Body>
          <Card.Title>Opt In to the Election</Card.Title>
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
      )}

      {props.isOpted && !props.isAccepted && (
        <Card.Body>
          <Card.Title>Waiting for Acceptance</Card.Title>
          <Card.Text>
            Waiting for the creator of the election to accept...
          </Card.Text>
        </Card.Body>
      )}

      {props.isAccepted && !props.isVoted && (
        <div>
          <Card.Body>
            <Card.Title>Cast Your Vote</Card.Title>
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

      {props.isVoted && (
        <Card.Body>
          <Card.Title>You Voted!</Card.Title>
          <Card.Text>
            You have cast your vote for option {props.electionChoices[props.isVoted]}
          </Card.Text>
        </Card.Body>
      )}
    </Card>
  );
}

export default VoterCard;
