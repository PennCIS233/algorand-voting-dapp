export async function signAndSend(txn) {
  let txn_b64 = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

  let signedTxs = await window.AlgoSigner.signTxn([{ txn: txn_b64 }]);
  console.log(signedTxs);

  let tx = await window.AlgoSigner.send({
    ledger: "TestNet",
    tx: signedTxs[0].blob,
  });

  return tx;
}

export function decode(encoded) {
  return Buffer.from(encoded, "base64").toString();
}
