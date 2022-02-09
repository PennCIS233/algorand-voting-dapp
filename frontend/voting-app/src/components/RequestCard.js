import React from "react";
import { Card, Button, ListGroup, Tabs, Tab } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";

function RequestCard(props) {
  const handleAccept = (user) => {
    mainAlgoHandler.creatorApprove(
      props.user,
      user,
      "yes",
      parseInt(props.electionId)
    );
  };

  const handleReject = (user) => {
    mainAlgoHandler.creatorApprove(
      props.user,
      user,
      "no",
      parseInt(props.electionId)
    );
  };

  // TODO: show rejected, accepted, opt in with ability to switch between cards
  return (
    <Card>
      <Card.Body>
        <Card.Title>Opted In Users</Card.Title>
        <Tabs
          defaultActiveKey="Accepted"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Accepted" title={`Accepted (${props.optedAccounts['yes'].length})`}>
            <ListGroup>
              {props.optedAccounts["yes"] &&
                props.optedAccounts["yes"].map((user) => (
                  <ListGroup.Item
                    key={user}
                    className="d-flex justify-content-between"
                  >
                    {user.substring(0, 10)}
                    <div>{props.electionChoices[props.userVotes[user]]}</div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="Rejected" title={`Rejected (${props.optedAccounts['no'].length})`}>
            <ListGroup>
              {props.optedAccounts["no"] &&
                props.optedAccounts["no"].map((user) => (
                  <ListGroup.Item
                    key={user}
                    className="d-flex justify-content-between"
                  >
                    {user.substring(0, 10)}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="Opted-In" title={`Pending (${props.optedAccounts['maybe'].length})`}>
            <ListGroup>
              {props.optedAccounts["maybe"] &&
                props.optedAccounts["maybe"].map((user) => (
                  <ListGroup.Item
                    key={user}
                    className="d-flex justify-content-between"
                  >
                    {user.substring(0, 10)}
                    {props.isCreator && (
                      <div>
                        <Button
                          onClick={() => handleAccept(user)}
                          variant="success"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(user)}
                          variant="danger"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
}

export default RequestCard;

/*



*/
