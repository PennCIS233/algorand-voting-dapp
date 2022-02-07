import React from "react";
import { Card, ListGroup } from "react-bootstrap";

function InfoCard(props) {
  const numVotes =
    props.state["VotesFor0"] +
    props.state["VotesFor1"] +
    props.state["VotesFor2"] +
    props.state["VotesFor3"];
  return (
    <Card bg="light">
      <Card.Header>Election Info</Card.Header>
      <Card.Body>
        <ListGroup>
          <ListGroup.Item>
            Creator ID:{" "}
            {props.state["Creator"]
              ? props.state["Creator"].substring(0, 10)
              : ""}
          </ListGroup.Item>
          <ListGroup.Item>
            Registration Ends: {Date(props.state["ElectionEnd"] * 1000)}
          </ListGroup.Item>
          <ListGroup.Item>Number of Voters: {numVotes}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default InfoCard;
