import { useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";

export const useWalletInit = <T = any>(fn: (...args: Array<any>) => Promise<T>) => {
  const web3ContextGlobal = useWeb3React();
  const { account, isActive } = web3ContextGlobal;
  const web3ContextRef = useRef(web3ContextGlobal);

  useEffect(() => {
    web3ContextRef.current = web3ContextGlobal;
  }, [account, isActive]);

  return async (...args: Array<any>): Promise<T> => {
    if (!web3ContextRef.current.isActive) {
      return Promise.reject(new Error("isNotActive"));
    }

    return fn(...args, web3ContextRef.current);
  };
};
