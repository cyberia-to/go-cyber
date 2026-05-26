#!/usr/bin/env node
const { SigningCyberClient, OfflineDappWallet } = require("../build/index");

const fs = require("fs-extra");

async function main() {
  const client = await SigningCyberClient.remotedapp(new OfflineDappWallet(), {});

  console.log("--------get all messages and types (not all yet)--------\n");
  // console.log(client.render())
  // console.log(JSON.parse(client.render()))

  const items = client.render();

  fs.writeFileSync("./msg.json", items, (err) => {
    if (err) return console.error(err);
    console.log("success!");
  });
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
