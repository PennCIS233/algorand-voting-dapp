import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import NavBar from "../components/NavBar";

import RequestCard from "../components/RequestCard";
import AcceptCard from "../components/AcceptCard";

class CreatorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      electionId: "1234",
      currUser: "account1",
      creator: "account1",
      optedUsers: ["account3", "account4"],
      acceptedUsers: ["account1", "account2"],
    };
  }
  render() {
    return (
      <>
        <NavBar connected />
        <Container>
          <Row className="px-3 mt-3">
            <RequestCard users={this.state.optedUsers} />
            <AcceptCard users={this.state.acceptedUsers} />
          </Row>
          <Row className="px-3 mt-3"></Row>
        </Container>
      </>
    );
  }
}

export default CreatorPage;
