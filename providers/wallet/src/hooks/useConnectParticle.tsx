import { useCallback } from "react";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";
import { AuthType } from "@particle-network/auth";

import { useAppDispatch, useAppSelector } from "@ethberry/redux";

import { useWallet } from "../provider";
import { particleAuth } from "../connectors/particle";
import { TConnectors, walletActions, walletSelectors } from "../reducer";

export interface IUseConnectParticle {
  onClick: () => Promise<void>;
}

export const useConnectParticle = (props: IUseConnectParticle) => {
  const { onClick } = props;

  const { formatMessage } = useIntl();
  const network = useAppSelector(walletSelectors.networkSelector);
  const activeConnector = useAppSelector(walletSelectors.activeConnectorSelector);
  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();
  const { connectCallback } = useWallet();

  return useCallback(
    (type: AuthType) => {
      return connectCallback(async () => {
        return particleAuth
          .activate({ preferredAuthType: type })
          .then(() => {
            dispatch(setActiveConnector(TConnectors.PARTICLE));
            return onClick();
          })
          .catch(async e => {
            console.error("error", e);
            await particleAuth.deactivate?.();
            dispatch(setActiveConnector(null));
            if (e.message === "isNotActive") {
              enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
            } else if (e.message === "The user rejected the request") {
              enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
            } else if (e.message === "The user cancel the operation") {
              enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
            } else {
              enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
            }
          });
      });
    },
    [activeConnector, network],
  );
};
