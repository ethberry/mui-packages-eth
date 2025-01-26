import { FC, PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { CloseButton } from "../../buttons/close";
import { StyledLoginWrapper } from "./styled";

interface IConnectWalletProps {
  open: boolean;
  onClose: () => void;
}

export const ConnectWallet: FC<PropsWithChildren<IConnectWalletProps>> = props => {
  const { open, onClose, children } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage id="components.header.wallet.connect" />
        <CloseButton onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <StyledLoginWrapper>{children}</StyledLoginWrapper>
      </DialogContent>
    </Dialog>
  );
};
