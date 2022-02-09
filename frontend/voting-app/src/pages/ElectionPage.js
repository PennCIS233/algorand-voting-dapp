import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Container, CardGroup } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";
import NavBar from "../components/NavBar";

import VoterCard from "../components/VoterCard";
import VoteChart from "../components/VoteChart";
import RequestCard from "../components/RequestCard";

import { useLocation } from "react-router-dom";

function ElectionPage() {
  let location = useLocation();

  const [electionState, setElectionState] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [mainAccount, setMainAccount] = useState("");
  const [electionId, setElectionId] = useState("");
  const [totalVotes, setTotalVotes] = useState([1, 1, 1, 1]);
  const [optedAccounts, setOptedAccounts] = useState({
    maybe: [],
    yes: [],
    no: [],
  });
  const [electionChoices, setElectionChoices] = useState(["A", "B", "C", "D"]);
  const [userVotes, setUserVotes] = useState({});

  const onMount = useCallback(() => {
    setAccounts(location.state.accts);
    setElectionId(location.state.electionId);
  }, []);

  const checkArray = (a, b) => {
    if (a.length !== b.length) return false;

    a.sort();
    b.sort();

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const checkEquals = (a, b) => {
    if (a == null || b == null) return false;
    return (
      checkArray(a["maybe"], b["maybe"]) &&
      checkArray(a["yes"], b["yes"]) &&
      checkArray(a["no"], b["no"])
    );
  };

  useEffect(() => {
    onMount();
    if (!mainAccount) setMainAccount(accounts[0]);

    // get election state
    mainAlgoHandler.getElectionState(location.state.electionId).then((res) => {
      if (JSON.stringify(res) !== JSON.stringify(electionState)) {
        let newTotalVotes = []
        for (let i = 0; i < res["NumVoteOptions"]; i++) {
          newTotalVotes.push(res[`VotesFor${i}`]);
        }

        let newElectionChoices = res["VoteOptions"].split(",");

        setElectionState(res);
        setTotalVotes(newTotalVotes);
        setElectionChoices(newElectionChoices);
      }
    });

    console.log(electionState);

    // get list of people participating and user votes
    mainAlgoHandler
      .getOptedInAccountsAndVotes(parseInt(electionId))
      .then((res) => {
        let newOptedAccounts = res[0];
        if (newOptedAccounts) {
          if (!checkEquals(newOptedAccounts, optedAccounts)) {
            let newUserVotes = res[1];
            if (!checkArray(newOptedAccounts["yes"], optedAccounts["yes"])) {
              setUserVotes(newUserVotes);
            }
            setOptedAccounts(newOptedAccounts);
          }
        }
      });
  });

  return (
    <>
      <NavBar
        connected
        handleUserUpdate={setMainAccount}
        accounts={accounts}
        mainAccount={mainAccount}
      />
      <Container>
        <Row className="mt-3 align-items-center">
          <CardGroup>
            <RequestCard
              electionId={electionId}
              users={accounts}
              user={mainAccount}
              userVotes={userVotes}
              isCreator={electionState["Creator"] === mainAccount}
              optedAccounts={optedAccounts}
              electionChoices={electionChoices}
            />
            <VoteChart
              currVotes={totalVotes}
              electionId={electionId}
              state={electionState}
            />
          </CardGroup>
        </Row>
        <Row className="mt-3">
          <Col>
            <VoterCard
              user={mainAccount}
              electionId={electionId}
              electionState={electionState}
              isAccepted={optedAccounts["yes"].includes(mainAccount)}
              isOpted={optedAccounts["maybe"].includes(mainAccount)}
              isVoted={userVotes[mainAccount]}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ElectionPage;
