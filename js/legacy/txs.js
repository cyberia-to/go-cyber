#!/usr/bin/env node
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const { stringToPath } = require("@cosmjs/crypto");
const { SigningCyberClient, OfflineDappWallet } = require("../build/index");
const { GasPrice } = require("@cosmjs/stargate");
const { fromBase64 } = require("@cosmjs/encoding");

const mnemonic =
  "pudding actor cactus garden sadness cotton sign denial patch shell silly extend tube way unlock vocal famous actor danger mean acoustic garment medal fatigue";
const rpcUrl = "http://localhost:26657";
const prefix = "cyber";
const tokenDenom = "nick";
const hdPath = stringToPath("m/44'/118'/0'/0/0");

const fs = require("fs-extra");

async function main() {
  // const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { hdPath: hdPath, prefix: prefix });
  // const options = { prefix: prefix, gasPrice: GasPrice.fromString("0.02boot") };
  // const client = await SigningCyberClient.connectWithSigner(rpcUrl, signer, options);
  const client = await SigningCyberClient.remotedapp(new OfflineDappWallet(), {});

  const myAddress = "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq";

  console.log("--------Cyberlink #1--------");
  try {
    var response = await client.cyberlink(
      myAddress,
      "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
    );
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------signAndBroadcast offline dapp wallet--------\n");
  console.log(
    client.signAndBroadcast(myAddress, [
      {
        typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
        value: {
          neuron: myAddress,
          links: [
            {
              from: "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
              to: "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
            },
          ],
        },
      },
    ]),
  );

  console.log("--------signAndBroadcastWithAmino offline dapp wallet--------\n");
  console.log(
    client.signAndBroadcastWithAmino(myAddress, [
      {
        type: "cyber/MsgCyberlink",
        value: {
          neuron: myAddress,
          links: [
            {
              from: "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
              to: "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
            },
          ],
        },
      },
    ]),
  );

  console.log("--------Motifs #1--------\n");
  try {
    var response = await client.motif(myAddress, [
      {
        from: "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
        to: "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
      },
      {
        from: "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
        to: "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe3",
      },
    ]);
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Linkchain #1--------\n");
  try {
    var response = await client.linkchain(myAddress, [
      "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe3",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe2",
    ]);
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Investmint Resources - Volt--------\n");
  var response = await client.investmint(
    myAddress,
    {
      denom: "boot",
      amount: "1000000000",
    },
    "millivolt",
    86400,
  );

  console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
  console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
  console.log(JSON.stringify(response, null, 4));

  console.log("--------Investmint Resources - Amper--------\n");
  var response = await client.investmint(
    myAddress,
    {
      denom: "boot",
      amount: "1000000000",
    },
    "milliampere",
    86400,
  );
  console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
  console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
  console.log(JSON.stringify(response, null, 4));

  console.log("--------Cyberlink #2--------\n");
  try {
    var response = await client.cyberlink(
      myAddress,
      "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe5",
    );
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Create Route--------");
  try {
    var response = await client.createEnergyRoute(
      myAddress,
      "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq",
      "synapse",
    );
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Edit Route - Volt--------\n");
  try {
    var response = await client.editEnergyRoute(myAddress, "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq", {
      denom: "millivolt",
      amount: "42",
    });
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Edit Route - Amper--------\n");
  try {
    var response = await client.editEnergyRoute(myAddress, "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq", {
      denom: "milliampere",
      amount: "42",
    });
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Edit Route Name--------\n");
  try {
    var response = await client.editEnergyRouteName(
      myAddress,
      "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq",
      "synapse1",
    );
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Send Tokens - Nick--------\n");
  try {
    var response = await client.sendTokens(myAddress, "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq", [
      {
        denom: "boot",
        amount: "42",
      },
    ]);
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("--------Send Tokens - Volt----------------\n");
  try {
    var response = await client.sendTokens(myAddress, "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq", [
      {
        denom: "millivolt",
        amount: "42",
      },
    ]);
    console.log(JSON.parse(Buffer.from(fromBase64(response[0]))));
    console.log("https://rebyc.cyber.page/wallet?sign=" + response[0]);
    console.log(JSON.stringify(response, null, 4));
  } catch (error) {
    console.log(error);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
