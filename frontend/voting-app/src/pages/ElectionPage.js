import React, { useEffect, useState } from "react";
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
  const [creatorAddress, setCreatorAddress] = useState("");
  const [electionId, setElectionId] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [currVotes, setCurrVotes] = useState([1, 1, 1, 1]);

  useEffect(() => {
    setAccounts(location.state.accts);
    setElectionId(location.state.electionId);
    if (!mainAccount) setMainAccount(accounts[0]);
    getElectionState();
  });

  const getElectionState = async () => {
    mainAlgoHandler.getElectionState(location.state.electionId).then((res) => {
      if (JSON.stringify(res) !== JSON.stringify(electionState)) {
        setElectionState(res);
        setCreatorAddress(res["Creator"]);
        setIsCreator(res["Creator"] === mainAccount);
        // setCurrVotes([
        //   res["VotesFor0"],
        //   res["VotesFor1"],
        //   res["VotesFor2"],
        //   res["VotesFor3"],
        // ]);
      }
    });
  };

  const changeMainAccount = async (acc) => {
    console.log(acc);
    setMainAccount(acc);
    if (electionId !== "")
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
        <Row>
          <CardGroup>
            <VoterCard user={mainAccount} electionId={electionId} />
            <VoteChart
              currVotes={currVotes}
              electionId={electionId}
              state={electionState}
            ></VoteChart>
          </CardGroup>
        </Row>
        <Row>
          <Col>
            <RequestCard
              electionId={electionId}
              users={accounts}
              user={mainAccount}
              isCreator={isCreator}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ElectionPage;
