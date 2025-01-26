import { Children, cloneElement, FC, PropsWithChildren, useCallback, useMemo } from "react";
import { Box, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";

import { usePopup } from "@ethberry/provider-popup";
import { useUser } from "@ethberry/provider-user";
import { useAppDispatch, useAppSelector } from "@ethberry/redux";

import { WalletMenuDialog } from "../../dialogs/wallet";
import { ConnectWallet } from "../../dialogs/connect";
import { StyledButton, StyledTooltipContent } from "./styled";
import { useWallet, WALLET_MENU_POPUP_TYPE } from "../../provider";
import { walletActions, walletSelectors } from "../../reducer";
import { WalletIcon } from "../../icons";
import { StyledBadge, StyledCircle } from "../network/styled";

export const WalletButton: FC<PropsWithChildren> = props => {
  const { children } = props;

  const { isOpenPopup, openPopup, closePopup } = usePopup();
  const { chainId, isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { profile } = useUser<any>();
  const { closeConnectWalletDialog } = useWallet();
  const isDialogOpen = useAppSelector<boolean>(walletSelectors.isDialogOpenSelector);
  const dispatch = useAppDispatch();
  const { setIsDialogOpen } = walletActions;

  const handleOpenDialog = useCallback(() => {
    return isActive ? openPopup(WALLET_MENU_POPUP_TYPE) : dispatch(setIsDialogOpen(true));
  }, [isActive]);

  const handleCloseWalletDialog = () => {
    closePopup();
  };

  const isChainValid = !chainId || profile?.chainId === chainId;

  const tooltipTitle = useMemo(() => {
    switch (true) {
      case !isChainValid:
        return (
          <StyledTooltipContent>{formatMessage({ id: "components.header.wallet.notValid" })}</StyledTooltipContent>
        );
      case isChainValid:
        return (
          <StyledTooltipContent>
            {isActive ? account! : formatMessage({ id: "components.header.wallet.connect" })}
          </StyledTooltipContent>
        );
      default:
        return null;
    }
  }, [account, isActive, isChainValid, profile]);

  return (
    <Box>
      <Tooltip title={tooltipTitle} enterDelay={300}>
        <StyledBadge color="primary" badgeContent={<StyledCircle />} invisible={isChainValid}>
          <StyledButton color="inherit" onClick={handleOpenDialog} data-testid="OpenWalletOptionsDialog">
            <WalletIcon />
            <Box sx={{ ml: 1 }}>
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : formatMessage({ id: "components.header.wallet.connect" })}
            </Box>
          </StyledButton>
        </StyledBadge>
      </Tooltip>
      <ConnectWallet onClose={closeConnectWalletDialog} open={isDialogOpen}>
        {Children.map(children as Array<any>, (button: any) =>
          cloneElement(button, {
            onTokenVerified: closeConnectWalletDialog,
          }),
        )}
      </ConnectWallet>
      <WalletMenuDialog onClose={handleCloseWalletDialog} open={isOpenPopup(WALLET_MENU_POPUP_TYPE)} />
    </Box>
  );
};
