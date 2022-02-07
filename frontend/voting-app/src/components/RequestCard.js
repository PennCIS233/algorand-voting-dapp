import React, { useState, useEffect } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";

function RequestCard(props) {
  const [maybeAccounts, setMaybeAccounts] = useState([]);
  const [acceptedAccounts, setAcceptedAccounts] = useState([]);
  const [rejectedAccounts, setRejectedAccounts] = useState([]);
  useEffect(() => {
    mainAlgoHandler
      .getOptedInAccountsAndVotes(parseInt(props.electionId))
      .then((res) => {
        let optedAccounts = res[0];
        if (optedAccounts) {
          setMaybeAccounts(optedAccounts["maybe"]);
          setAcceptedAccounts(optedAccounts["yes"]);
          setRejectedAccounts(optedAccounts["no"]);
        }
      });
  }, [props.electionId, props.mainAccount, props.isCreator]);

  const handleAccept = (user) => {
    mainAlgoHandler.creatorApprove(
      user,
      props.user,
      "yes",
      parseInt(props.electionId)
    );
  };

  const handleReject = (user) => {
    mainAlgoHandler.creatorApprove(
      user,
      props.user,
      "no",
      parseInt(props.electionId)
    );
  };
  // TODO: show rejected, accepted, opt in with ability to switch between cards
  // do it like this: https://react-bootstrap.github.io/components/cards/#navigation
  return (
    <Card bg="light">
      <Card.Header>Opted In Users</Card.Header>
      <Card.Body>
        <ListGroup>
          {maybeAccounts &&
            maybeAccounts.map((user) => (
              <ListGroup.Item
                key={user}
                className="d-flex justify-content-between"
              >
                {user}
                {props.isCreator && (
                  <div>
                    <Button
                      onClick={() => handleAccept(user)}
                      variant="success"
                    >
                      Accept
                    </Button>
                    <Button onClick={() => handleReject(user)} variant="danger">
                      Reject
                    </Button>
                  </div>
                )}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default RequestCard;
