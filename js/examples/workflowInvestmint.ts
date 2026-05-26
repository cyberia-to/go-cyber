import { rpcUrl, validatorMnemonic } from "./consts";
import { CyberClient } from "../build/index";
import { createSigner } from "./utils";

const BASE_VESTING_TIME = 86401;

async function main() {
  const queryClient = await CyberClient.connect(rpcUrl);
  const { address, signerClient } = await createSigner(validatorMnemonic);
  console.log(address);
  console.log("Balance:");
  var balanceResult = await queryClient.getAllBalances(address);
  console.log(balanceResult);

  const vCoin = { denom: "hydrogen", amount: "1000000000" };
  const aCoin = { denom: "hydrogen", amount: "1000000000" };
  const vestingLength = BASE_VESTING_TIME * 100;

  const vResult = await signerClient.investmint(address, vCoin, "millivolt", vestingLength, "auto");
  console.log("Investmint V - ", vResult);

  const aResult = await signerClient.investmint(address, aCoin, "milliampere", vestingLength, "auto");
  console.log("Investmint A - ", aResult);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
