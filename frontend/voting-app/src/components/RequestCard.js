import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

class RequestCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleAccept = this.handleAccept.bind(this);
  }
  handleAccept(user) {
    // accept user
  }
  render() {
    return (
      <Card bg="light">
        <Card.Header>Users to Accept</Card.Header>
        <Card.Body>
          <ListGroup>
            {this.props.users.map((user) => (
              <ListGroup.Item className="d-flex justify-content-between">
                {user}
                <Button
                  onClick={() => this.handleAccept(user)}
                  variant="success"
                >
                  Accept
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}

export default RequestCard;
