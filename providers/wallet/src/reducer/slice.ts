import { PayloadAction, createSlice, isAnyOf, Slice } from "@reduxjs/toolkit";

import type { INetwork } from "@ethberry/types-blockchain";
import { WALLET_SLICE_NAME } from "@ethberry/constants";

import { emptyWalletState } from "./empty";
import type { IWalletState, TConnectors } from "./interfaces";
import { initializeActiveConnector } from "./async-actions";

const initialState: IWalletState = emptyWalletState;

export const walletSlice: Slice<IWalletState> = createSlice({
  name: WALLET_SLICE_NAME,
  initialState,
  selectors: {
    isDialogOpenSelector: state => state.isDialogOpen,
    activeConnectorSelector: state => state.activeConnector,
    networkSelector: state => state.network,
    networksSelector: state => state.networks,
    referrerSelector: state => state.referrer,
  },
  reducers: {
    setIsDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDialogOpen = action.payload;
    },
    setActiveConnector: (state, action: PayloadAction<TConnectors | null>) => {
      state.activeConnector = action.payload;
    },
    setNetwork: (state, action: PayloadAction<INetwork | undefined>) => {
      state.network = action.payload;
    },
    setNetworks: (state, action: PayloadAction<Record<number, INetwork>>) => {
      state.networks = action.payload;
    },
    setReferrer: (state, action: PayloadAction<string>) => {
      state.referrer = action.payload;
    },
  },
  extraReducers: builder =>
    builder.addMatcher(isAnyOf(initializeActiveConnector.fulfilled), (state, action) => {
      state.activeConnector = action.payload;
    }),
});

export const walletActions = walletSlice.actions;

export const walletSelectors = walletSlice.selectors as any;
