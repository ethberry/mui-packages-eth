import { createAsyncThunk } from "@reduxjs/toolkit";

import { WALLET_SLICE_NAME, LOCAL_STORAGE_KEYS } from "@ethberry/constants";
import { readFromLS } from "@ethberry/utils";

import { TConnectors } from "./interfaces";

export const initializeActiveConnector = createAsyncThunk<TConnectors, void, any>(
  `${WALLET_SLICE_NAME}/initializeActiveConnector`,
  (_, thunkAPI) => {
    try {
      const activeConnector: TConnectors | null = readFromLS(LOCAL_STORAGE_KEYS.STORE_CONNECTOR, null);
      if (!activeConnector) {
        return thunkAPI.rejectWithValue(null);
      }
      return activeConnector;
    } catch (e) {
      void e;
      return thunkAPI.rejectWithValue(null);
    }
  },
);
