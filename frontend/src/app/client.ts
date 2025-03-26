import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

// Define a custom Ganache chain
export const ganacheChain = {
  id: 1337,
  name: "Ganache Local",
  rpc: ["http://127.0.0.1:7545"],
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  shortName: "ganache",
  slug: "ganache-local",
  chain: "ETH",
  testnet: true,
};

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
