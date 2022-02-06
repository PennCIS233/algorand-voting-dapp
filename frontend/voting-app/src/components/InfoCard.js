import React from "react";
import { Card, Row, Container, ListGroup } from "react-bootstrap";

class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    // assumes electionId is passed as a prop
    // this stuff is static so it could all be passed as a prop lowkey
    this.state = {
      registerStart: "01-01-2022",
      registerEnd: "01-01-2023",
      numVoters: 12,
      creatorId: "account1",
    };
  }

  componentDidMount() {
    // use this.props.electionId to get election info
  }

  render() {
    return (
      <Card bg="light">
        <Card.Header>Election Info</Card.Header>
        <Card.Body>
          <ListGroup>
            <ListGroup.Item>Creator ID: {this.state.creatorId}</ListGroup.Item>
            <ListGroup.Item>
              Registration Starts: {this.state.registerStart}
            </ListGroup.Item>
            <ListGroup.Item>
              Registration Ends: {this.state.registerEnd}
            </ListGroup.Item>
            <ListGroup.Item>
              Number of Voters: {this.state.numVoters}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}

export default InfoCard;
