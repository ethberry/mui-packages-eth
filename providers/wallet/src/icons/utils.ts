import { FC } from "react";
import { SvgIconProps } from "@mui/material";

import { Arbitrum, Besu, Binance, Ethereum, Optimism, Polygon, ImmutableZkEVM, Telos } from "@ethberry/mui-icons";

export const getIconByChainId = (chainId: number): FC<SvgIconProps> | null => {
  switch (chainId) {
    case 1:
    case 11155111:
      return Ethereum;
    case 10:
    case 11155420:
      return Optimism;
    case 56:
    case 97:
      return Binance;
    case 137:
    case 80002:
      return Polygon;
    case 42161:
    case 421614:
      return Arbitrum;
    case 10000:
    case 11111:
      return Besu;
    case 13371:
    case 13473:
      return ImmutableZkEVM;
    case 40:
    case 41:
      return Telos;
    default:
      return null;
  }
};
