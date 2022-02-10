import React from "react";
import { Card, Button, Accordion, Tabs, Tab } from "react-bootstrap";
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
          <Tab
            eventKey="Accepted"
            title={`Accepted (${props.optedAccounts["yes"].length})`}
          >
            <Accordion>
              {props.optedAccounts["yes"] &&
                props.optedAccounts["yes"].map((user) => (
                  <Accordion.Item eventKey={user}>
                    <Accordion.Header>
                      {user.substring(0, 20) + "..."}
                    </Accordion.Header>
                    <Accordion.Body>
                      Creator: {user}
                      {"\n"}
                      Vote: {props.electionChoices[props.userVotes[user]]}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </Tab>
          <Tab
            eventKey="Rejected"
            title={`Rejected (${props.optedAccounts["no"].length})`}
          >
            <Accordion>
              {props.optedAccounts["no"] &&
                props.optedAccounts["no"].map((user) => (
                  <Accordion.Item eventKey={user}>
                    <Accordion.Header>
                      {user.substring(0, 20) + "..."}
                    </Accordion.Header>
                    <Accordion.Body>Creator: {user}</Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </Tab>
          <Tab
            eventKey="Opted-In"
            title={`Pending (${props.optedAccounts["maybe"].length})`}
          >
            <Accordion>
              {props.optedAccounts["maybe"] &&
                props.optedAccounts["maybe"].map((user) => (
                  <Accordion.Item eventKey={user}>
                    <Accordion.Header>
                      {user.substring(0, 20) + "..."}
                    </Accordion.Header>
                    <Accordion.Body>
                      Creator: {user}
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
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
}

export default RequestCard;

/*



*/
