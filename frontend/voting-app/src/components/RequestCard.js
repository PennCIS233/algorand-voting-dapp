import React, { useState, useEffect } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import { decode, signAndSend } from "./Helpers";

function RequestCard(props) {
  const [optedInAccounts, setOptedInAccounts] = useState([]);
  const [acceptedAccounts, setAcceptedAccounts] = useState([]);
  const [rejectedAccounts, setRejectedAccounts] = useState([]);
  useEffect(() => {
    getOptedInAccounts(props.electionId);
  }, [props.electionId]);

  const handleAccept = (user) => {
    creatorApprove(user, props.user, "yes", props.electionId);
  };

  const handleReject = (user) => {
    creatorApprove(user, props.user, "yes", props.electionId);
  };

  const getOptedInAccounts = async (electionId) => {
    const algosdk = require("algosdk");
    const algodToken = {
      "X-API-Key": "OtAhhF0GEa3GnYbsgghbx4L9qO9Ebq6J9m1sjOS0",
    };
    const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
    const algodPort = "";
    let indexerClient = new algosdk.Indexer(
      algodToken,
      indexerServer,
      algodPort
    );

    let accountInfo = await indexerClient
      .searchAccounts()
      .applicationID(electionId)
      .do();

    let accounts = accountInfo["accounts"];

    // go through all the accounts looking at 'can_vote' variable and add account to correct array
    for (let acc of accounts) {
      let apps = acc["apps-local-state"];
      if (apps) {
        for (let app of apps) {
          if (app["id"] == electionId) {
            for (let keyValue of app["key-value"]) {
              let key = decode(keyValue["key"]);
              if (key == "can_vote") {
                let value = decode(keyValue["value"]["bytes"]);
                if (value === "maybe") {
                  setOptedInAccounts((optedInAccounts) => [
                    ...optedInAccounts,
                    acc["address"],
                  ]);
                } else if (value === "yes") {
                  setAcceptedAccounts((acceptedAccounts) => [
                    ...acceptedAccounts,
                    acc["address"],
                  ]);
                } else if (value === "no") {
                  setRejectedAccounts((rejectedAccounts) => [
                    ...rejectedAccounts,
                    acc["address"],
                  ]);
                }
              }
            }
          }
        }
      }
    }
  };

  const creatorApprove = async (
    senderAddress,
    approvingAccount,
    yesOrNo,
    electionId
  ) => {
    const algosdk = require("algosdk");
    console.log(
      `${senderAddress} attempting to ${
        yesOrNo == "yes" ? "approve" : "deny"
      } account ${approvingAccount}`
    );
    const algodToken = {
      "X-API-Key": "OtAhhF0GEa3GnYbsgghbx4L9qO9Ebq6J9m1sjOS0",
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = "";
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    let params = await algodClient.getTransactionParams().do();
    let appArgs = [];

    let decodedAddress = algosdk.decodeAddress(approvingAccount);
    appArgs.push(new Uint8Array(Buffer.from("update_user_status")));
    appArgs.push(decodedAddress.publicKey);
    appArgs.push(new Uint8Array(Buffer.from(yesOrNo)));
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
  };

  return (
    <Card bg="light">
      <Card.Header>Opted In Users</Card.Header>
      <Card.Body>
        <ListGroup>
          {optedInAccounts &&
            optedInAccounts.map((user) => (
              <ListGroup.Item
                key={user}
                className="d-flex justify-content-between"
              >
                {user}
                {props.isCreator && (
                  <div>
                    <Button
                      onClick={() => handleAccept(user)}
                      variant="success"
                    >
                      Accept
                    </Button>
                    <Button onClick={() => handleReject(user)} variant="danger">
                      Reject
                    </Button>
                  </div>
                )}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default RequestCard;
