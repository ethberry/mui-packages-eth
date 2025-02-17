import { FC } from "react";
import { Link, SxProps, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { useChains, useChainId } from "wagmi";

export interface ITxHashLinkProps {
  hash: string;
  length?: number;
  sx?: SxProps<Theme>;
}

export const TxHashLink: FC<ITxHashLinkProps> = props => {
  const { hash, length = 16, sx = [] } = props;
  const chains = useChains();
  const chainId = useChainId();

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  const currentChain = chains.find(chain => chain.id === chainId);

  if (!hash) {
    return null;
  }

  const formattedHash = isSmallScreen
    ? `${hash.slice(0, 5)}...${hash.slice(-4)}`
    : hash.substring(0, length).concat("...");

  if (!currentChain?.blockExplorers) {
    return formattedHash;
  }

  return (
    <Tooltip title={hash}>
      <Link target={"_blank"} href={`${currentChain.blockExplorers.default.url}/tx/${hash}`} sx={sx}>
        {formattedHash}
      </Link>
    </Tooltip>
  );
};
