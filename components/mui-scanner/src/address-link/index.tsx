import { FC } from "react";
import { Link, SxProps, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import type { INetwork } from "@ethberry/types-blockchain";
import { useAppSelector } from "../../../../../mui-packages/other/redux/src";
import { walletSelectors } from "@ethberry/provider-wallet";

export interface IAddressLinkProps {
  address?: string;
  length?: number;
  sx?: SxProps<Theme>;
}

const addressLength = 42;

export const AddressLink: FC<IAddressLinkProps> = props => {
  const { address = "", length = addressLength, sx = [] } = props;

  const { chainId = 1 } = useWeb3React();
  const networks = useAppSelector<Record<number, INetwork>>(walletSelectors.networksSelector);

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  if (!address) {
    return null;
  }

  const formattedAddress = isSmallScreen
    ? `${address.slice(0, 5)}...${address.slice(-4)}`
    : address.substring(0, length).concat(length < addressLength ? "..." : "");

  if (!networks[chainId]?.blockExplorerUrls?.length) {
    return formattedAddress;
  }

  return (
    <Tooltip title={address}>
      <Link target={"_blank"} href={`${networks[chainId].blockExplorerUrls[0]}/address/${address}`} sx={sx}>
        {formattedAddress}
      </Link>
    </Tooltip>
  );
};
