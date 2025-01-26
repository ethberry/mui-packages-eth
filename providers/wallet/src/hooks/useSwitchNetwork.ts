import { useCallback, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";

import { collectionActions } from "@ethberry/provider-collection";
import { useAppDispatch, useAppSelector } from "@ethberry/redux";
import { useUser } from "@ethberry/provider-user";
import { INetwork } from "@ethberry/types-blockchain";

import { TConnectors, walletActions, walletSelectors } from "../reducer";
import { particleAuth } from "../connectors/particle";

export const useSwitchNetwork = (network: INetwork) => {
  const { chainId: metamaskChainId, isActive, connector } = useWeb3React();
  const user = useUser<any>();
  const isUserAuthenticated = user.isAuthenticated();

  const networks = useAppSelector<Record<number, INetwork>>(walletSelectors.networksSelector);
  const activeConnector = useAppSelector(walletSelectors.activeConnectorSelector);
  const dispatch = useAppDispatch();

  const { setNeedRefresh } = collectionActions;
  const { setActiveConnector, setNetwork } = walletActions;

  const currentMetamaskChainId = useRef<number | null>(null);

  const handleDisconnect = () => {
    dispatch(setActiveConnector(null));
  };

  const checkChainId = useCallback(async () => {
    if (!network) {
      return;
    }

    if (activeConnector === TConnectors.PARTICLE) {
      return particleAuth.switchChain(network.chainId);
    }

    try {
      await connector?.provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
      dispatch(setNeedRefresh(true));
      currentMetamaskChainId.current = network.chainId;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await connector?.provider?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.chainName,
                blockExplorerUrls: network.blockExplorerUrls,
                rpcUrls: network.rpcUrls,
                nativeCurrency: network.nativeCurrency,
              },
            ],
          });
          await connector?.provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${network.chainId.toString(16)}` }],
          });
          dispatch(setNeedRefresh(true));
          currentMetamaskChainId.current = network.chainId;
        } catch (addError: any) {
          handleDisconnect();
          currentMetamaskChainId.current = null;
          console.error(addError);
        }
      } else if (error.code === 4001) {
        handleDisconnect();
        currentMetamaskChainId.current = null;
        console.error(error);
      }
    }
  }, [activeConnector, connector, network]);

  const switchNetwork = (metamaskChainId: number) => {
    if (network?.chainId !== metamaskChainId) {
      dispatch(setNetwork(networks[metamaskChainId]));
      void user.setProfile({ chainId: metamaskChainId }).then(() => {
        dispatch(setNeedRefresh(true));
      });
    }
  };

  useEffect(() => {
    if (connector && isActive) {
      void checkChainId();
    }
  }, [connector, isActive, network]);

  useEffect(() => {
    if (network && !isUserAuthenticated) {
      handleDisconnect();
    } else if (
      network &&
      metamaskChainId &&
      currentMetamaskChainId.current === network.chainId &&
      currentMetamaskChainId.current !== metamaskChainId
    ) {
      switchNetwork(metamaskChainId);
    }
  }, [network, metamaskChainId, isUserAuthenticated]);
};
