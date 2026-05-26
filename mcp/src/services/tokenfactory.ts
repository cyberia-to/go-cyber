import {
  getWalletAddress,
  signAndBroadcast,
  formatTxResult,
} from "../clients/signing.js";
import { lcdGet } from "../clients/lcd.js";

/** Create a new TokenFactory denom. Costs ~10,000 BOOT. */
export async function createDenom(subdenom: string) {
  const sender = await getWalletAddress();
  const msg = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom",
    value: { sender, subdenom },
  };
  const result = await signAndBroadcast([msg]);
  const fullDenom = `factory/${sender}/${subdenom}`;
  return { ...formatTxResult(result), denom: fullDenom, sender };
}

/** Set metadata (name, symbol, description, exponent) for a denom */
export async function setDenomMetadata(
  denom: string,
  name: string,
  symbol: string,
  description: string,
  exponent: number = 0,
) {
  const sender = await getWalletAddress();
  const msg = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata",
    value: {
      sender,
      metadata: {
        description,
        denomUnits: [
          { denom, exponent: 0, aliases: [] },
          ...(exponent > 0
            ? [{ denom: symbol.toLowerCase(), exponent, aliases: [] }]
            : []),
        ],
        base: denom,
        display: exponent > 0 ? symbol.toLowerCase() : denom,
        name,
        symbol,
      },
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), denom, name, symbol };
}

/** Mint tokens to a specific address (must be denom admin) */
export async function mintTokens(
  denom: string,
  amount: string,
  mintTo: string,
) {
  const sender = await getWalletAddress();
  const msg = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMint",
    value: {
      sender,
      amount: { denom, amount },
      mintToAddress: mintTo,
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), denom, amount, mintTo };
}

/** Burn tokens from the sender's balance (must be denom admin) */
export async function burnTokens(
  denom: string,
  amount: string,
  burnFrom: string,
) {
  const sender = await getWalletAddress();
  const msg = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurn",
    value: {
      sender,
      amount: { denom, amount },
      burnFromAddress: burnFrom,
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), denom, amount, burnFrom };
}

/** Change admin of a denom */
export async function changeAdmin(denom: string, newAdmin: string) {
  const sender = await getWalletAddress();
  const msg = {
    typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin",
    value: { sender, denom, newAdmin },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), denom, newAdmin };
}

/** List denoms created by the wallet address */
export async function listCreatedDenoms() {
  const creator = await getWalletAddress();
  const data = await lcdGet<{
    denoms: string[];
  }>(`/osmosis/tokenfactory/v1beta1/denoms_from_creator/${creator}`);
  return { creator, denoms: data.denoms };
}
