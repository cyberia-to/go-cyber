import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCyberClient } from "../build/index";
import { rpcUrl, prefix } from "./consts";

export async function createSigner(mnemonic: string) {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: prefix });
  const signerClient = await SigningCyberClient.connectWithSigner(rpcUrl, signer);

  const address = (await signer.getAccounts())[0].address;
  return { address, signerClient };
}
