import { executeContract } from "./contract-exec.js";
import {
  LITIUM_CORE,
  LITIUM_MINE,
  LITIUM_STAKE,
  LITIUM_REFER,
} from "./lithium.js";

/** Submit a lithium proof */
export async function submitProof(
  hash: string,
  nonce: number,
  miner_address: string,
  challenge: string,
  difficulty: number,
  timestamp: number,
  referrer?: string,
  contract: string = LITIUM_MINE,
) {
  return executeContract(contract, {
    submit_proof: {
      hash,
      nonce,
      miner_address,
      challenge,
      difficulty,
      timestamp,
      ...(referrer && { referrer }),
    },
  });
}

/** Stake LI tokens via CW-20 Send to the litium-stake contract */
export async function stakeLi(
  amount: string,
  stakeContract: string = LITIUM_STAKE,
  coreContract: string = LITIUM_CORE,
) {
  // Staking works via CW-20 Send: call Send on litium-core which triggers Receive on litium-stake
  return executeContract(coreContract, {
    send: {
      contract: stakeContract,
      amount,
      msg: Buffer.from("{}").toString("base64"),
    },
  });
}

/** Unstake LI tokens from the litium-stake contract */
export async function unstakeLi(
  amount: string,
  contract: string = LITIUM_STAKE,
) {
  return executeContract(contract, {
    unstake: { amount },
  });
}

/** Claim staking rewards from the litium-stake contract */
export async function claimLiRewards(
  contract: string = LITIUM_STAKE,
) {
  return executeContract(contract, { claim_staking_rewards: {} });
}

/** Claim matured unbonding from the litium-stake contract */
export async function claimUnbonding(
  contract: string = LITIUM_STAKE,
) {
  return executeContract(contract, { claim_unbonding: {} });
}

/** Claim accumulated referral rewards from the litium-refer contract */
export async function claimReferralRewards(
  contract: string = LITIUM_REFER,
) {
  return executeContract(contract, { claim_rewards: {} });
}
