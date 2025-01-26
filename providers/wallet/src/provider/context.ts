import { createContext } from "react";
import { Web3ContextType } from "@web3-react/core";
import { TWalletConnectorTuple } from "../reducer";

export interface IWalletContext {
  openConnectWalletDialog: () => Promise<Web3ContextType>;
  connectCallback: (fn: () => Promise<any>) => Promise<void>;
  closeConnectWalletDialog: () => void;
  walletConnector: TWalletConnectorTuple;
  customErrors: Record<string, string>;
}

export const WalletContext = createContext<IWalletContext>(undefined!);
