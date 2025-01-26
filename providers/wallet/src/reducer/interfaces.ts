import { Web3ReactHooks } from "@web3-react/core";
import { Web3ReactStore } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect-v2";

import type { INetwork } from "@ethberry/types-blockchain";

export type TWalletConnectorTuple = [WalletConnect, Web3ReactHooks, Web3ReactStore];

export interface IWalletState {
  isDialogOpen: boolean;
  activeConnector: TConnectors | null;
  network: INetwork | undefined;
  networks: Record<number, INetwork>;
  referrer: string;
}

export enum TConnectors {
  METAMASK = "METAMASK",
  PARTICLE = "PARTICLE",
  WALLETCONNECT = "WALLETCONNECT",
}
