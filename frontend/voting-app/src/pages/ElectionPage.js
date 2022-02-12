import React, { useEffect, useState } from "react";
import { Row, Col, Container, CardGroup } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";
import NavBar from "../components/NavBar";

import VoterCard from "../components/VoterCard";
import ParticipantsCard from "../components/ParticipantsCard";
import ElectionInfoCard from "../components/ElectionInfoCard";

import { useLocation } from "react-router-dom";

function ElectionPage() {
  let location = useLocation();

  const [electionState, setElectionState] = useState({});
  const [accounts, setAccounts] = useState(location.state.accts);
  const [mainAccount, setMainAccount] = useState(accounts[0]);
  const [electionId, setElectionId] = useState(location.state.electionId);
  const [totalVotes, setTotalVotes] = useState([1, 1, 1, 1]);
  const [optedAccounts, setOptedAccounts] = useState({
    maybe: [],
    yes: [],
    no: [],
  });
  const [electionChoices, setElectionChoices] = useState(["A", "B", "C", "D"]);
  const [userVotes, setUserVotes] = useState({});

  const refreshState = () => {
    console.log("refreshing state...");
    mainAlgoHandler.getElectionState(location.state.electionId).then((res) => {
      let newTotalVotes = [];
      for (let i = 0; i < res["NumVoteOptions"]; i++) {
        newTotalVotes.push(res[`VotesFor${i}`]);
      }

      let newElectionChoices = res["VoteOptions"].split(",");
      setElectionState(res);
      setTotalVotes(newTotalVotes);
      setElectionChoices(newElectionChoices);
    });

    console.log(electionState);

    // get list of people participating and user votes
    mainAlgoHandler
      .getOptedInAccountsAndVotes(parseInt(electionId))
      .then((res) => {
        setOptedAccounts(res[0]);
        setUserVotes(res[1]);
      });
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleMainAccountChange = (user) => {
    setMainAccount(user);
    refreshState();
  };

  return (
    <>
      <NavBar
        connected
        handleUserUpdate={handleMainAccountChange}
        accounts={accounts}
        mainAccount={mainAccount}
      />
      <Container>
        <Row className="mt-3 align-items-center">
          <CardGroup>
            <ParticipantsCard
              electionId={electionId}
              users={accounts}
              user={mainAccount}
              userVotes={userVotes}
              isCreator={electionState["Creator"] === mainAccount}
              optedAccounts={optedAccounts}
              electionChoices={electionChoices}
            />
            <ElectionInfoCard
              currVotes={totalVotes}
              electionId={electionId}
              state={electionState}
            />
          </CardGroup>
        </Row>
        <Row>
          <Col>
            <VoterCard
              user={mainAccount}
              electionId={electionId}
              electionState={electionState}
              isAccepted={optedAccounts["yes"].includes(mainAccount)}
              isOpted={optedAccounts["maybe"].includes(mainAccount)}
              isVoted={userVotes[mainAccount]}
              electionChoices={electionChoices}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ElectionPage;
