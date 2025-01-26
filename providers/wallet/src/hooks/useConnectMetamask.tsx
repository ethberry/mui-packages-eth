import { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { OptionsObject, enqueueSnackbar } from "notistack";
import { Button } from "@mui/material";
import { NoMetaMaskError } from "@web3-react/metamask";

import type { INetwork } from "@ethberry/types-blockchain";
import { useAppDispatch, useAppSelector } from "@ethberry/redux";

import { useWallet } from "../provider";
import { metaMask } from "../connectors/meta-mask";
import { TConnectors, walletActions, walletSelectors } from "../reducer";

export interface IUseConnectMetamask {
  onClick: () => Promise<void>;
}

export const useConnectMetamask = (props: IUseConnectMetamask) => {
  const { onClick } = props;

  const { formatMessage } = useIntl();
  const network = useAppSelector<INetwork>(walletSelectors.networkSelector);
  const activeConnector = useAppSelector(walletSelectors.activeConnectorSelector);
  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();
  const { connectCallback } = useWallet();

  const notDetectedWeb3MessageConfig: OptionsObject = {
    variant: "warning",
    action: () => (
      <Button
        onClick={() => {
          window.open("https://metamask.io/download.html", "_blank");
        }}
      >
        <FormattedMessage id="buttons.download-metamask" />
      </Button>
    ),
  };

  return useCallback(() => {
    return connectCallback(async () => {
      if (!(window as any).ethereum) {
        enqueueSnackbar(formatMessage({ id: "snackbar.web3NotDetected" }), notDetectedWeb3MessageConfig);
      }

      return metaMask
        .activate(network)
        .then(() => {
          dispatch(setActiveConnector(TConnectors.METAMASK));
          return onClick();
        })
        .catch(async e => {
          console.error(e);
          await metaMask.resetState();
          dispatch(setActiveConnector(null));
          if (e.message === "User rejected the request.") {
            enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
          } else if (e instanceof NoMetaMaskError) {
            enqueueSnackbar(formatMessage({ id: "snackbar.web3NotDetected" }), notDetectedWeb3MessageConfig);
          } else {
            enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
          }
        });
    });
  }, [activeConnector, network]);
};
