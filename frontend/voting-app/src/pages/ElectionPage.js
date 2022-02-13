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

  // constant variables for page
  const electionId = location.state.electionId;
  const accounts = location.state.accts;

  // variables that change state
  const [electionState, setElectionState] = useState({});
  const [mainAccount, setMainAccount] = useState(accounts[0]);
  const [totalVotes, setTotalVotes] = useState([]);
  const [electionChoices, setElectionChoices] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [optedAccounts, setOptedAccounts] = useState({
    maybe: [],
    yes: [],
    no: [],
  });

  // refreshState
  // Description:
  //  Calls API to get election state and list of all users that have opted-in
  const refreshState = () => {
    console.log("refreshing state...");
    mainAlgoHandler.getElectionState(location.state.electionId).then((res) => {
      if (!res) {
        // TODO: handle incorrect election
      }
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

    mainAlgoHandler
      .getAllLocalStates(parseInt(electionId))
      .then((allLocalStates) => {
        let newOptedAccounts = {
          yes: [],
          no: [],
          maybe: [],
        };
        for (const address in allLocalStates) {
          let canVote = allLocalStates[address]["can_vote"];
          if (canVote) {
            newOptedAccounts[canVote].push(address);
          }
        }
        setOptedAccounts(newOptedAccounts);

        let newUserVotes = {};
        for (const address in allLocalStates) {
          let userVote = allLocalStates[address]["voted"];
          if (userVote) {
            newUserVotes[address] = userVote;
          }
        }
        setUserVotes(newUserVotes);
      });
  };

  // useEffect
  // Description:
  //  Retrieves election state when component is first rendered
  useEffect(() => {
    refreshState();
  }, []);

  // handleMainAccountChange
  // Description:
  //  Updates the main account and updates the state
  // Parameters:
  //   user (string) - user to change main account to
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
        refreshState={refreshState}
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
