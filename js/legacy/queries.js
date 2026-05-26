#!/usr/bin/env node
const { QueryClient } = require("@cosmjs/stargate");
const { Tendermint34Client } = require("@cosmjs/tendermint-rpc");
const { CyberClient } = require("../build/index");

const rpcUrl = "http://localhost:26657";

async function main() {
  const tendermintClient = await Tendermint34Client.connect(rpcUrl);

  const queryClient = new CyberClient(tendermintClient);

  console.log("Get Account");
  var queryResult = await queryClient.getAccount("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g");
  console.log(queryResult);

  console.log("Graph Stats");
  var queryResult = await queryClient.graphStats({});
  console.log(queryResult);

  console.log("Get Balance - Nick");
  var queryResult = await queryClient.getBalance("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g", "nick");
  console.log(queryResult);

  console.log("Get Balance - Amper");
  var queryResult = await queryClient.getBalance("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g", "amper");
  console.log(queryResult);

  console.log("Get Balance - Volt");
  var queryResult = await queryClient.getBalance("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g", "volt");
  console.log(queryResult);

  console.log("Get All Balances");
  var queryResult = await queryClient.getAllBalances("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g");
  console.log(queryResult);

  console.log("Search");
  try {
    var queryResult = await queryClient.search("QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV", 0, 10);
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Backlinks");
  try {
    var queryResult = await queryClient.backlinks("QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4", 0, 10);
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Rank");
  try {
    var queryResult = await queryClient.rank("QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4");
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Is Link Exist");
  try {
    var queryResult = await queryClient.isLinkExist(
      "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
      "cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g",
    );
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Is Any Link Exist - True");
  try {
    var queryResult = await queryClient.isAnyLinkExist(
      "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
    );
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Is Any Link Exist - False");
  try {
    var queryResult = await queryClient.isAnyLinkExist(
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe5",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
    );
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Is Any Link Exist - Error");
  try {
    var queryResult = await queryClient.isAnyLinkExist(
      "QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV",
      "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe2",
    );
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Bandwidth Load");
  try {
    var queryResult = await queryClient.load();
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Bandwidth Price");
  try {
    var queryResult = await queryClient.price();
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Account's Bandwidth");
  try {
    var queryResult = await queryClient.account("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g");
    console.log(queryResult);
  } catch (error) {
    console.log(error);
  }

  console.log("Source Routes");
  try {
    var queryResult = await queryClient.sourceRoutes("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g");
    console.log(JSON.stringify(queryResult, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("Destination Routes");
  try {
    var queryResult = await queryClient.destinationRoutes("cyber1njj4p35u8pggm7nypg3y66rypgvk2atjcy7ngp");
    console.log(JSON.stringify(queryResult, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("Destination Routed Energy");
  try {
    var queryResult = await queryClient.destinationRoutedEnergy(
      "cyber1njj4p35u8pggm7nypg3y66rypgvk2atjcy7ngp",
    );
    console.log(JSON.stringify(queryResult, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("Source Routed Energy");
  try {
    var queryResult = await queryClient.sourceRoutedEnergy("cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g");
    console.log(JSON.stringify(queryResult, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("Routes");
  try {
    var queryResult = await queryClient.routes("");
    console.log(JSON.stringify(queryResult, null, 4));
  } catch (error) {
    console.log(error);
  }

  console.log("Route");
  try {
    var queryResult = await queryClient.route(
      "cyber15vyqaz9fzqn0maywf20z5etw99k6xpp426mm2g",
      "cyber1njj4p35u8pggm7nypg3y66rypgvk2atjcy7ngp",
    );
    console.log(JSON.stringify(queryResult, null, 4));
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
