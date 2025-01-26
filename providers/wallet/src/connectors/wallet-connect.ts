import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { Web3ReactStore } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect-v2";

import type { INetwork } from "@ethberry/types-blockchain";

/* javascript-obfuscator:disable */
const WALLET_CONNECT_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID;
const WALLET_CONNECT_DEFAULT_CHAIN_ID = process.env.WALLET_CONNECT_DEFAULT_CHAIN_ID;
/* javascript-obfuscator:enable */

export const initializeWalletConnector = (
  networks: Record<number, INetwork>,
): [WalletConnect, Web3ReactHooks, Web3ReactStore] =>
  initializeConnector<WalletConnect>(
    (actions): WalletConnect =>
      new WalletConnect({
        actions,
        options: {
          projectId: WALLET_CONNECT_PROJECT_ID,
          chains: [Number(WALLET_CONNECT_DEFAULT_CHAIN_ID)], // only 1 item
          optionalChains: Object.keys(networks).map(Number),
          showQrModal: true,
          qrModalOptions: {
            themeVariables: {
              "--wcm-z-index": "1500",
            },
          },
        },
      }),
  );
