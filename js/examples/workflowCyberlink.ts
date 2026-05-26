import { rpcUrl, validatorMnemonic } from "./consts";
import { CyberClient } from "../build/index";
import { createSigner } from "./utils";

async function main() {
  const queryClient = await CyberClient.connect(rpcUrl);
  const { address, signerClient } = await createSigner(validatorMnemonic);
  console.log(address);

  const link1 = "QmWQixYeubM54RFHunos6K6aYYb1EE4XY6pBVDJtTNGr9D";
  const link2 = "QmQSbpPKGQgGMfgeFeQz9ATNrFJvi4oZ4KxtAJcnKuBwr5";
  const linkResult = await signerClient.cyberlink(address, link1, link2, "auto");
  console.log("Link: ", linkResult);

  const rankResult = await queryClient.search(link1);
  console.log("Rank1:\r\n ", rankResult);

  const searchResult = await queryClient.search(link1);
  console.log("Search:\r\n ", searchResult);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
