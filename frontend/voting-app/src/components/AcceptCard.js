import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

class AcceptCard extends React.Component {
  render() {
    return (
      <Card bg="light">
        <Card.Header>Users to Accept</Card.Header>
        <Card.Body>
          <ListGroup>
            {this.props.users.map((user) => (
              <ListGroup.Item>{user}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}

export default AcceptCard;
