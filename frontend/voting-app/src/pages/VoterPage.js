import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import NavBar from "../components/NavBar";

import InfoCard from "../components/InfoCard";
import VoterCard from "../components/VoterCard";
import VoteChart from "../components/VoteChart";

class VoterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      electionId: "1234",
      voterPage: true,
      currUser: "account1",
      currVotes: [
        { title: "1", value: 2, color: "#3181ba" },
        { title: "2", value: 5, color: "#45134c" },
        { title: "3", value: 1, color: "#632656" },
        { title: "4", value: 5, color: "#4dc8e9" },
        { title: "5", value: 3, color: "#aa21b9" },
      ],
    };
  }
  render() {
    return (
      <>
        <NavBar connected />
        <Container>
          <Row className="px-3 mt-3">
            <Col>
              <Row className="px-1">
                <InfoCard electionId={this.state.electionId} />
              </Row>
              <Row className="px-1 mt-3">
                <VoterCard user={this.state.currUser} />
              </Row>
            </Col>
            <Col className="px-1">
              <VoteChart currVotes={this.state.currVotes} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default VoterPage;
