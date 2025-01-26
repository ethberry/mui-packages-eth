import { useEffect, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ErrorCode } from "@ethersproject/logger";
// TODO replace with https://github.com/MetaMask/rpc-errors/blob/main/src/error-constants.ts
import { RESERVED_ERROR_CODES, SERVER_ERROR_CODE_RANGE, STANDARD_ERROR_MAP } from "@json-rpc-tools/utils";

import { useWallet } from "@ethberry/provider-wallet";

import { IHandlerOptionsParams } from "./interfaces";
import { BlockchainErrorType, parseBlockchainError, SystemErrorPrefix } from "./error-handler";

export const useMetamaskWallet = <T = any>(
  fn: (...args: Array<any>) => Promise<T>,
  options: IHandlerOptionsParams = {},
) => {
  const web3ContextGlobal = useWeb3React();
  const { account, chainId, connector, isActive } = web3ContextGlobal;
  const web3ContextRef = useRef(web3ContextGlobal);
  const { openConnectWalletDialog, closeConnectWalletDialog, customErrors } = useWallet();

  const { formatMessage } = useIntl();
  const { success = true, error = true } = options;

  useEffect(() => {
    web3ContextRef.current = web3ContextGlobal;
  }, [account, chainId, connector, isActive]);

  return async (...args: Array<any>): Promise<T> => {
    if (!isActive) {
      web3ContextRef.current = await openConnectWalletDialog();
      closeConnectWalletDialog();
    }

    return fn(...args, web3ContextRef.current)
      .then((transaction: any) => {
        if (success && transaction !== null) {
          enqueueSnackbar(formatMessage({ id: "snackbar.transactionSent" }, { txHash: transaction.hash }), {
            variant: "info",
          });
        }
        return transaction as T;
      })
      .catch((e: any) => {
        if (error && e.status !== 400) {
          if (e.code === 4001 || e.code === ErrorCode.ACTION_REJECTED) {
            enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
          } else if ([...SERVER_ERROR_CODE_RANGE, ...RESERVED_ERROR_CODES].includes(e.code)) {
            enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
            const errorType = Object.values(STANDARD_ERROR_MAP).find(({ code }) => code === e.code)?.message;
            console.error(`[blockchain error]${errorType ? ` [${errorType}]` : ""}`, e.message);
          } else {
            if (e.error?.data?.data) {
              const errorData = e.error?.data?.data as SystemErrorPrefix;
              const errorReason = parseBlockchainError(errorData, customErrors);

              enqueueSnackbar(
                errorReason.type === BlockchainErrorType.CUSTOM_ERROR
                  ? formatMessage({
                      id: `enums.blockchainError.${errorReason.reason}`,
                    })
                  : formatMessage(
                      {
                        id: "snackbar.blockchainErrorReason",
                      },
                      {
                        reason:
                          errorReason.reason.includes(":") || errorReason.reason.includes(" ")
                            ? errorReason.reason
                            : "",
                      },
                    ),
                { variant: "error" },
              );
              console.error("[blockchain error]", errorReason);
            } else {
              enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
              console.error("[blockchain error]", e);
            }
          }
          return null;
        }

        throw e;
      }) as Promise<T>;
  };
};
