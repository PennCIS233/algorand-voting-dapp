import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";
import NavBar from "../components/NavBar";

import InfoCard from "../components/InfoCard";
import VoterCard from "../components/VoterCard";
import VoteChart from "../components/VoteChart";
import RequestCard from "../components/RequestCard";

import { useNavigate, useLocation } from "react-router-dom";

function ElectionPage() {
  let location = useLocation();
  let navigate = useNavigate(); // TODO: create a back to start button

  const [electionState, setElectionState] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [mainAccount, setMainAccount] = useState("");
  const [creatorAddress, setCreatorAddress] = useState("");
  const [electionId, setElectionId] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [currVotes, setCurrVotes] = useState([1, 1, 1, 1]);

  useEffect(() => {
    setAccounts(location.state.accts);
    setElectionId(location.state.electionId);
    setMainAccount(accounts[0]);
    mainAlgoHandler.getElectionState(location.state.electionId).then((res) => {
      if (JSON.stringify(res) !== JSON.stringify(electionState)) {
        console.log(JSON.stringify(res), JSON.stringify(electionState));
        setElectionState(res);
        setCreatorAddress(res["Creator"]);
        setIsCreator(res["Creator"] == mainAccount);
        setCurrVotes([
          res["VotesFor0"],
          res["VotesFor1"],
          res["VotesFor2"],
          res["VotesFor3"],
        ]);
      }
    });
  }, [electionState, creatorAddress, isCreator, currVotes, electionId]);

  const getElectionState = async (e) => {
    mainAlgoHandler.getElectionState(location.state.electionId).then((res) => {
      console.log(location.state.electionId);
      console.log(res);
      setElectionState(res);
      setCreatorAddress(res["Creator"]);
      setIsCreator(res["Creator"] == mainAccount);
      setCurrVotes([
        res["VotesFor0"],
        res["VotesFor1"],
        res["VotesFor2"],
        res["VotesFor3"],
      ]);
    });
  };

  const changeMainAccount = async (acc) => {
    setMainAccount(acc);
    if (electionId != "")
      setIsCreator(await mainAlgoHandler.isCreator(electionId, acc));
  };

  return (
    <>
      <NavBar
        connected
        handleUserUpdate={changeMainAccount}
        accounts={accounts}
        mainAccount={mainAccount}
      />
      <Container>
        <Row className="px-3 mt-3">
          <Col>
            <Row className="px-1">
              <InfoCard electionId={electionId} state={electionState} />
            </Row>
            <Row className="px-1 mt-3">
              <VoterCard user={mainAccount} electionId={electionId} />
            </Row>
          </Col>
          <Col className="px-1">
            <VoteChart currVotes={currVotes}></VoteChart>
          </Col>
        </Row>
        <Row className="px-3 mt-3">
          <RequestCard
            electionId={electionId}
            users={accounts}
            user={mainAccount}
            isCreator={isCreator}
          />
        </Row>
      </Container>
    </>
  );
}

export default ElectionPage;
