import {
  getWalletAddress,
  signAndBroadcast,
  formatTxResult,
} from "../clients/signing.js";
import { lcdGet } from "../clients/lcd.js";

/** Create an energy route to allocate VOLT/AMPERE to another address */
export async function createRoute(
  destination: string,
  name: string,
) {
  const source = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
    value: {
      source,
      destination,
      name,
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), source, destination, name };
}

/** Edit an existing energy route's allocated value */
export async function editRoute(
  destination: string,
  amount: string,
  denom: string,
) {
  const source = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
    value: {
      source,
      destination,
      value: { denom, amount },
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), source, destination, amount, denom };
}

/** Delete an energy route */
export async function deleteRoute(destination: string) {
  const source = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
    value: {
      source,
      destination,
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), source, destination };
}

/** List all energy routes from the wallet address */
export async function listRoutes(address?: string) {
  const source = address ?? await getWalletAddress();
  const data = await lcdGet<{
    routes: Array<{
      source: string;
      destination: string;
      name: string;
      value: Array<{ denom: string; amount: string }>;
    }>;
  }>(`/cyber/grid/v1beta1/grid/source_routes?source=${source}`);
  return { source, routes: data.routes };
}
