import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";

function VoterCard(props) {
  const [voteChoice, setVoteChoice] = useState("");

  // handleVoteSelect
  // Description:
  //  Updates the states when the user changes their vote option
  const handleVoteSelect = (e) => {
    setVoteChoice(e.target.value);
  };

  // handleVoteSubmit
  // Description:
  //  Sends the vote to the blockchain.
  const handleVoteSubmit = (e) => {
    e.preventDefault();
    const choices = props.electionChoices.split(",");
    let voteValue = choices.indexOf(voteChoice);
    if (voteValue > -1)
      mainAlgoHandler.vote(props.user, voteValue, parseInt(props.appID));
  };

  // handleOptIn
  // Description:
  //  Opts the user into the election on the blockchain.
  const handleOptIn = (e) => {
    e.preventDefault();
    mainAlgoHandler.optInAccount(props.user, parseInt(props.appID));
  };

  // handleClear
  // Description:
  //  Clears the user vote on the blockchain.
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

      {props.isAccepted && props.isVoted === undefined && (
        <div>
          <Card.Body>
            <Card.Title>Cast Your Vote</Card.Title>
            <Form onSubmit={handleVoteSubmit}>
              <Form.Group controlId="vote-options">
                {props.electionChoices.split(",").map((choice) => (
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

      {props.isVoted !== undefined && (
        <Card.Body>
          <Card.Title>You Voted!</Card.Title>
          <Card.Text>
            You have cast your vote for option{" "}
            {props.electionChoices[props.isVoted]}
          </Card.Text>
        </Card.Body>
      )}
    </Card>
  );
}

export default VoterCard;
