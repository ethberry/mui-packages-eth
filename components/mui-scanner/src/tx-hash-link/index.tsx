import { FC } from "react";
import { Link, SxProps, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import type { INetwork } from "@ethberry/types-blockchain";
import { useAppSelector } from "../../../../../mui-packages/other/redux/src";
import { walletSelectors } from "@ethberry/provider-wallet";

export interface ITxHashLinkProps {
  hash: string;
  length?: number;
  sx?: SxProps<Theme>;
}

export const TxHashLink: FC<ITxHashLinkProps> = props => {
  const { hash, length = 16, sx = [] } = props;

  const { chainId = 1 } = useWeb3React();
  const networks = useAppSelector<Record<number, INetwork>>(walletSelectors.networksSelector);

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  if (!hash) {
    return null;
  }

  const formattedHash = isSmallScreen
    ? `${hash.slice(0, 5)}...${hash.slice(-4)}`
    : hash.substring(0, length).concat("...");

  if (!networks[chainId]?.blockExplorerUrls?.length) {
    return formattedHash;
  }

  return (
    <Tooltip title={hash}>
      <Link target={"_blank"} href={`${networks[chainId].blockExplorerUrls[0]}/tx/${hash}`} sx={sx}>
        {formattedHash}
      </Link>
    </Tooltip>
  );
};
