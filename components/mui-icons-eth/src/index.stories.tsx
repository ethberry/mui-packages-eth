import { IconButton } from "@mui/material";
import { StoryObj } from "@storybook/react";

import { Besu, Arbitrum, Binance, Ethereum, ImmutableZkEVM, Optimism, Polygon, Sepolia, Telos } from "./chains";
import { MetaMaskIcon, ParticleIcon, WalletConnectIcon, ZealIcon } from "./wallets";

export default {
  title: "Icons",
  component: null,
};

type Story = StoryObj<any>;

const SimpleTemplate: Story = {
  render: () => (
    <div>
      <IconButton>
        <Besu />
      </IconButton>
      <IconButton>
        <Arbitrum />
      </IconButton>
      <IconButton>
        <Binance />
      </IconButton>
      <IconButton>
        <Ethereum />
      </IconButton>
      <IconButton>
        <ImmutableZkEVM />
      </IconButton>
      <IconButton>
        <Optimism />
      </IconButton>
      <IconButton>
        <Polygon />
      </IconButton>
      <IconButton>
        <Sepolia />
      </IconButton>
      <IconButton>
        <Telos />
      </IconButton>
    </div>
  ),
};

export const Simple = SimpleTemplate;

const CryptoiconsTemplate: Story = {
  render: () => (
    <div>
      <IconButton>
        <MetaMaskIcon />
      </IconButton>
      <IconButton>
        <ParticleIcon />
      </IconButton>
      <IconButton>
        <WalletConnectIcon />
      </IconButton>
      <IconButton>
        <ZealIcon />
      </IconButton>
    </div>
  ),
};

export const Cryptoicons = CryptoiconsTemplate;
