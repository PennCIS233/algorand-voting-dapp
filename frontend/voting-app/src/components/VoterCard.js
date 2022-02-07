import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import { decode, signAndSend } from "./Helpers";

// TODO: change into hook
class VoterCard extends React.Component {
  constructor(props) {
    super(props);
    // assumes user is passed in as a prop
    // TODO: handle when user == creator (auto accept)
    this.state = {
      voteOptions: ["1", "2", "3", "4"],
      voteChoice: "1",
      opted: false,
      accepted: false,
      voted: false,
    };

    this.handleVoteSelect = this.handleVoteSelect.bind(this);
    this.handleVoteSubmit = this.handleVoteSubmit.bind(this);
    this.handleOptIn = this.handleOptIn.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.optInAccount = this.optInAccount.bind(this);
    this.vote = this.vote.bind(this);
  }

  handleVoteSelect(e) {
    this.setState({
      voteChoice: e.target.value,
    });
  }

  handleVoteSubmit(e) {
    e.preventDefault();
    this.setState({ voted: true });
    console.log(this.state.voteChoice);
    // TODO: send vote to blockchain
  }

  async vote(senderAddress, optionIndex, electionId) {
    const algosdk = require("algosdk");
    console.log(
      `${senderAddress} attempting to vote for option ${optionIndex}`
    );

    const algodToken = {
      "X-API-Key": "OtAhhF0GEa3GnYbsgghbx4L9qO9Ebq6J9m1sjOS0",
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = "";
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    let params = await algodClient.getTransactionParams().do();

    let appArgs = [];
    appArgs.push(new Uint8Array(Buffer.from("vote")));
    appArgs.push(algosdk.encodeUint64(optionIndex));
    console.log(appArgs);

    let txn = algosdk.makeApplicationNoOpTxn(
      senderAddress,
      params,
      parseInt(electionId),
      appArgs
    );
    console.log(txn);

    let tx = await signAndSend(txn);
    console.log(tx);

    return tx;
  }

  async optInAccount(address, electionId) {
    const algosdk = require("algosdk");
    console.log(`Attempting to opt-in account ${address} to ${electionId}`);
    const algodToken = {
      "X-API-Key": "OtAhhF0GEa3GnYbsgghbx4L9qO9Ebq6J9m1sjOS0",
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = "";
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    let params = await algodClient.getTransactionParams().do();
    let txn = algosdk.makeApplicationOptInTxn(
      address,
      params,
      parseInt(electionId)
    );
    console.log(txn);

    let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    let signedTxs = await window.AlgoSigner.signTxn([{ txn: txn_b64 }]);
    console.log(signedTxs);

    // TODO: handle error when user has already opted-in
    let tx = await window.AlgoSigner.send({
      ledger: "TestNet",
      tx: signedTxs[0].blob,
    });

    console.log(tx);
  }

  handleOptIn(e) {
    e.preventDefault();
    this.optInAccount(this.props.user, this.props.electionId);
    this.setState({ opted: true });
  }

  handleClear(e) {
    e.preventDefault();
    this.setState({ voted: false });
    // TODO: clear vote on blockchain
  }

  render() {
    return (
      <Card bg="light">
        {!this.state.opted && (
          <div>
            <Card.Header>Opt In to the Election</Card.Header>
            <Card.Body>
              <Card.Text>
                To participate in the election, you must opt-in. If the creator
                of the election accepts, you can vote!
              </Card.Text>
              <Form onSubmit={this.handleOptIn}>
                <Button variant="info" type="submit">
                  Opt-In
                </Button>
              </Form>
            </Card.Body>
          </div>
        )}

        {this.state.opted && !this.state.accepted && (
          <div>
            <Card.Header>Waiting for Acceptance</Card.Header>
            <Card.Body>
              <Card.Text>
                Waiting for the creator of the election to accept...
              </Card.Text>
            </Card.Body>
          </div>
        )}

        {this.state.accepted && (
          <div>
            <Card.Header>Cast Your Vote</Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleVoteSubmit}>
                <Form.Group controlId="vote-options">
                  {this.state.voteOptions.map((choice) => (
                    <Form.Check
                      type="radio"
                      key={choice}
                      value={choice}
                      name="choices"
                      label={choice}
                      onChange={this.handleVoteSelect}
                    />
                  ))}
                </Form.Group>
                <Button variant="info" type="submit">
                  Vote
                </Button>
              </Form>
            </Card.Body>
          </div>
        )}

        {this.state.voted && (
          <div>
            <Card.Header>You Voted!</Card.Header>
            <Card.Body>
              <Card.Text>
                You have cast your vote for option {this.state.voteChoice}. If
                you'd like to clear your vote, please click the button below.
              </Card.Text>
              <Form onSubmit={this.handleClear}>
                <Button variant="info" type="submit">
                  Clear Vote
                </Button>
              </Form>
            </Card.Body>
          </div>
        )}
      </Card>
    );
  }
}
export default VoterCard;
