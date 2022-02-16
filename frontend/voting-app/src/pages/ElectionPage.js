import React, { useEffect, useState } from "react";
import { Row, Col, Container, Modal, Button } from "react-bootstrap";
import mainAlgoHandler from "../components/AlgoHandler";
import NavBar from "../components/NavBar";
import VoterCard from "../components/VoterCard";
import ParticipantsCard from "../components/ParticipantsCard";
import ElectionInfoCard from "../components/ElectionInfoCard";

import { useLocation } from "react-router-dom";

function ElectionPage() {
  let location = useLocation();

  // constant variables for page
  const appID = location.state.appID;
  const accounts = location.state.accts;

  // variables that change state
  const [isError, setIsError] = useState(false);
  const [electionState, setElectionState] = useState({});
  const [mainAccount, setMainAccount] = useState("");
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
    if (accounts.length > 0) setMainAccount(accounts[0]);
    mainAlgoHandler
      .getElectionState(location.state.appID)
      .then((res) => {
        let newTotalVotes = [];
        for (let i = 0; i < res["NumVoteOptions"]; i++) {
          newTotalVotes.push(res[`VotesFor${i}`]);
        }

        let newElectionChoices = res["VoteOptions"].split(",");
        setElectionState(res);
        setTotalVotes(newTotalVotes);
        setElectionChoices(newElectionChoices);
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
      });

    console.log(electionState);

    mainAlgoHandler
      .getAllLocalStates(parseInt(appID))
      .then((allLocalStates) => {
        let newOptedAccounts = {
          yes: [],
          no: [],
          maybe: [],
        };
        for (const address in allLocalStates) {
          let canVote = allLocalStates[address]["can_vote"];
          if ("can_vote" in allLocalStates[address]) {
            newOptedAccounts[canVote].push(address);
          }
        }
        setOptedAccounts(newOptedAccounts);

        let newUserVotes = {};
        for (const address in allLocalStates) {
          if ("voted" in allLocalStates[address]) {
            newUserVotes[address] = allLocalStates[address]["voted"];
          }
        }
        setUserVotes(newUserVotes);
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
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
        <Row xs={1} md={2} className="g-4 mt-3">
          <Col>
            <ParticipantsCard
              appID={appID}
              users={accounts}
              user={mainAccount}
              userVotes={userVotes}
              isCreator={electionState["Creator"] === mainAccount}
              optedAccounts={optedAccounts}
              electionChoices={electionChoices}
            />
          </Col>
          <Col>
            <ElectionInfoCard
              currVotes={totalVotes}
              appID={appID}
              state={electionState}
            />
          </Col>
          {accounts.length > 0 && (
            <Col>
              <VoterCard
                user={mainAccount}
                appID={appID}
                electionState={electionState}
                isAccepted={optedAccounts["yes"].includes(mainAccount)}
                isPending={optedAccounts["maybe"].includes(mainAccount)}
                isRejected={optedAccounts["no"].includes(mainAccount)}
                isVoted={userVotes[mainAccount]}
                electionChoices={electionChoices}
              />
            </Col>
          )}
        </Row>
      </Container>
      <Modal show={isError}>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          There was an error when retrieving the application state. Please check
          that you entered the correct application ID.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" href="/">
            Return to Connect Page
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ElectionPage;
