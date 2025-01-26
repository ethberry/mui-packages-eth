import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect-v2";
import type { Connector } from "@web3-react/types";

import { useAppSelector } from "@ethberry/redux";

import { metaMask } from "./meta-mask";
import { particleAuth, ParticleAuth } from "./particle";
import { TConnectors, walletSelectors } from "../reducer";
import { useWallet } from "../provider";

export { ParticleAuth } from "./particle";

export const getConnectorName = (connector: Connector) => {
  switch (true) {
    case connector instanceof MetaMask:
      return TConnectors.METAMASK;
    case connector instanceof ParticleAuth:
      return TConnectors.PARTICLE;
    case connector instanceof WalletConnect:
      return TConnectors.WALLETCONNECT;
    default:
      return null;
  }
};

export type ConnectorsTypes = MetaMask | ParticleAuth | WalletConnect;

export const useGetConnectorByName = () => {
  const activeConnector = useAppSelector<TConnectors>(walletSelectors.activeConnectorSelector);
  const {
    walletConnector: [walletConnect],
  } = useWallet();

  const setConnectorByName = {
    [TConnectors.METAMASK]: metaMask,
    [TConnectors.PARTICLE]: particleAuth,
    [TConnectors.WALLETCONNECT]: walletConnect,
  };

  return {
    connectorByName: setConnectorByName[activeConnector] || null,
  };
};
