import { constants } from "ethers";

import type { IWalletState } from "./interfaces";

export const emptyWalletState: IWalletState = {
  isDialogOpen: false,
  activeConnector: null,
  network: void 0,
  networks: {},
  referrer: constants.AddressZero,
};
