import { FC } from "react";
import { Link, SxProps, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { useChains, useChainId } from "wagmi";

export interface IAddressLinkProps {
  address?: string;
  length?: number;
  sx?: SxProps<Theme>;
}

const addressLength = 42;

export const AddressLink: FC<IAddressLinkProps> = props => {
  const { address = "", length = addressLength, sx = [] } = props;
  const chains = useChains();
  const chainId = useChainId();

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  const currentChain = chains.find(chain => chain.id === chainId);

  if (!address) {
    return null;
  }

  const formattedAddress = isSmallScreen
    ? `${address.slice(0, 5)}...${address.slice(-4)}`
    : address.substring(0, length).concat(length < addressLength ? "..." : "");

  if (!currentChain?.blockExplorers) {
    return formattedAddress;
  }

  return (
    <Tooltip title={address}>
      <Link target={"_blank"} href={`${currentChain.blockExplorers.default.url}/address/${address}`} sx={sx}>
        {formattedAddress}
      </Link>
    </Tooltip>
  );
};
