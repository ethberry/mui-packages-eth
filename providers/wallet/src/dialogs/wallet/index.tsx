import { FC } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { useUser } from "@ethberry/provider-user";
import { useAppDispatch } from "@ethberry/redux";

import { CloseButton } from "../../buttons/close";
import { walletActions } from "../../reducer";

export interface IWalletDialogProps {
  open: boolean;
  onClose: () => void;
}

export const WalletMenuDialog: FC<IWalletDialogProps> = props => {
  const { onClose, open } = props;

  const user = useUser<any>();
  const { connector } = useWeb3React();
  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }

    void user.logOut("/");
    localStorage.clear();
    void dispatch(setActiveConnector(null));
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage id="components.header.wallet.menu" />
        <CloseButton onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <Button onClick={handleDisconnect}>
          <FormattedMessage id="form.buttons.disconnect" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};
