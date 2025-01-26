import { useCallback } from "react";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import type { INetwork } from "@ethberry/types-blockchain";
import { useAppDispatch, useAppSelector } from "@ethberry/redux";

import { useWallet } from "../provider";
import { TConnectors, walletActions, walletSelectors } from "../reducer";

export interface IUseConnectWalletConnect {
  onClick: () => Promise<void>;
}

/* javascript-obfuscator:disable */
const WALLET_CONNECT_DEFAULT_CHAIN_ID = process.env.WALLET_CONNECT_DEFAULT_CHAIN_ID;
/* javascript-obfuscator:enable */

export const useConnectWalletConnect = (props: IUseConnectWalletConnect) => {
  const { onClick } = props;

  const { formatMessage } = useIntl();

  const network = useAppSelector<INetwork>(walletSelectors.networkSelector);
  const {
    walletConnector: [walletConnect],
  } = useWallet();
  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();
  const { connectCallback } = useWallet();

  return useCallback(() => {
    return connectCallback(async () => {
      return walletConnect
        .activate(network ? network.chainId : Number(WALLET_CONNECT_DEFAULT_CHAIN_ID))
        .then(() => {
          dispatch(setActiveConnector(TConnectors.WALLETCONNECT));
          return onClick();
        })
        .catch(async (e: any) => {
          console.error(e);
          await walletConnect.deactivate?.();
          dispatch(setActiveConnector(null));
          if (e.message === "isNotActive") {
            enqueueSnackbar(formatMessage({ id: "snackbar.walletIsNotConnected" }), { variant: "error" });
          } else if (e.message === "User rejected") {
            // Cancel button in Binance app
            enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
          } else if (e.message === "User rejected methods.") {
            // Cancel button in Metamask app
            enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
          } else if (e.message === "Connection request reset. Please try again.") {
            // X button on popup
            enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
          } else if (e.message === "User signature failure") {
            enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "error" });
          } else {
            enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
          }
        });
    });
  }, [network, walletConnect]);
};
