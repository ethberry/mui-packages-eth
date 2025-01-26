import { useLayoutEffect } from "react";

import { LOCAL_STORAGE_KEYS } from "@ethberry/constants";

import { walletActions } from "../reducer";

export const useReferrer = (dispatch: any) => {
  const searchParams = new URLSearchParams(window.location.search);

  useLayoutEffect(() => {
    const referrer = searchParams.get(LOCAL_STORAGE_KEYS.REFERRER);
    if (referrer) {
      dispatch(walletActions.setReferrer(referrer));
      searchParams.delete(LOCAL_STORAGE_KEYS.REFERRER);

      window.history.pushState({}, "", window.location.pathname);
    }
  }, [searchParams]);
};
