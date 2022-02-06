import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import NavBar from "../components/NavBar";

import InfoCard from "../components/InfoCard";
import VoterCard from "../components/VoterCard";
import VoteChart from "../components/VoteChart";

import RequestCard from "../components/RequestCard";
import AcceptCard from "../components/AcceptCard";

import { useNavigate, useLocation } from "react-router-dom";

function ElectionPage() {
  let location = useLocation();
  let navigate = useNavigate();

  const [electionState, setElectionState] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [mainAccount, setMainAccount] = useState("");
  const [creatorAddress, setCreatorAddress] = useState("");
  const [electionId, setElectionId] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [isVotePage, setIsVotePage] = useState(true);

  useEffect(() => {
    setElectionId(location.state.electionId);
    let newElectionState = await mainAlgoHandler.getElectionState(
      location.state.electionId
    );

    console.log(newElectionState);

    setElectionState(newElectionState);
    setCreatorAddress(newElectionState["Creator"]);
    setIsCreator(newElectionState["Creator"] == mainAccount);
  });

  const getElectionState = async (e) => {
    let newElectionState = await mainAlgoHandler.getElectionState(
      electionId,
      creatorAddress
    );
    setElectionState(newElectionState);
  };

  return (
    <>
      <NavBar connected />
      {isVotePage && (
        <Container>
          <Row className="px-3 mt-3">
            <Col>
              <Row className="px-1">
                <InfoCard electionId={electionId} />
              </Row>
              <Row className="px-1 mt-3">
                <VoterCard user={mainAccount} />
              </Row>
            </Col>
            <Col className="px-1">
              <VoteChart currVotes={this.state.currVotes} />
            </Col>
          </Row>
        </Container>
      )}
      {!isVotePage && (
        <Container>
          <Row className="px-3 mt-3">
            <RequestCard users={electionState} />
          </Row>
          <Row className="px-3 mt-3">
            <AcceptCard users={electionState} />
          </Row>
        </Container>
      )}
    </>
  );
}

export default ElectionPage;

/*

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


*/
