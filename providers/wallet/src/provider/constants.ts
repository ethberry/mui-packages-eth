import type { Networkish } from "@ethersproject/networks";

import type { INetwork } from "@ethberry/types-blockchain";

export const SANDBOX_CHAINS = [97, 80002, 10001, 10000, 11155111, 13473];

export const WALLET_CONNECT_POPUP_TYPE = Symbol("WALLET_CONNECT_POPUP_TYPE");
export const WALLET_MENU_POPUP_TYPE = Symbol("WALLET_MENU_POPUP_TYPE");

export const getNetworkForWeb3Provider = (chainId: number, networks: Record<number, INetwork>): Networkish => {
  const network = networks[chainId];

  if (!network) {
    return {
      name: "Ethereum",
      chainId: 1,
    };
  }

  return {
    name: network.chainName,
    chainId: network.chainId,
  };
};
