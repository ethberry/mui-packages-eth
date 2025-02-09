import { useEffect, useRef } from "react";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { getAuth, signInWithCustomToken, User } from "firebase/auth";
import { v4 } from "uuid";
import { useNavigate } from "react-router";

import { phrase } from "@ethberry/constants";
import firebase from "@ethberry/firebase";
import { useUser } from "@ethberry/provider-user";
import { useApiCall } from "@ethberry/react-hooks";
import { useAppSelector, useAppDispatch } from "@ethberry/redux";
import type { IMetamaskDto, IWalletConnectDto } from "@ethberry/types-jwt";
import { collectionActions } from "@ethberry/provider-collection";
import { useApi } from "@ethberry/provider-api";

import { TConnectors, walletSelectors } from "../reducer";
import { useWalletInit } from "./useWalletInit";
import { useConnectMetamask } from "./useConnectMetamask";
import { useWallet } from "../provider";
import { useConnectWalletConnect } from "./useConnectWalletConnect";

const fetchUrlByActiveConnector: {
  [Key in Exclude<TConnectors, "PARTICLE">]: string;
} = {
  [TConnectors.METAMASK]: "/metamask/login",
  [TConnectors.WALLETCONNECT]: "/wallet-connect/login",
};

export const useSwitchAccount = () => {
  const authFb = getAuth(firebase);
  const user = useUser<any>();
  const navigate = useNavigate();
  const api = useApi();
  const { account = "", isActive, provider, connector } = useWeb3React();

  const currentWallet = useRef<string>("");
  const disconnectedAccounts = useRef<Map<string, boolean>>(new Map());
  const {
    walletConnector: [walletConnect],
  } = useWallet();

  const activeConnector = useAppSelector<TConnectors>(walletSelectors.activeConnectorSelector);
  const dispatch = useAppDispatch();

  const { setNeedRefresh } = collectionActions;
  const isUserAuthenticated = user.isAuthenticated();

  const isLoginPage = window.location.pathname.includes("/login");

  const handleDisconnect = async () => {
    await user.logOut();
  };

  const _handleDisconnect = async () => {
    await user.logOut();
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector?.resetState();
    }
  };

  const logIn = async (user: User) => {
    const accessToken = await user.getIdToken(true);
    const now = Date.now();
    api.setToken({
      accessToken,
      accessTokenExpiresAt: now + 1000 * 60 * 60,
      refreshToken: "",
      refreshTokenExpiresAt: now + 1000 * 60 * 60,
    });
    if (isLoginPage) {
      void navigate(window.location.pathname);
    }
  };

  const handleTokenVerified = async (token: string) => {
    if (!token) {
      return;
    }
    await signInWithCustomToken(authFb, token);
    const userCredentials = await signInWithCustomToken(authFb, token);
    await logIn(userCredentials.user).catch(e => {
      console.error("login error", e);
      void handleDisconnect();
    });
    dispatch(setNeedRefresh(true));
  };

  const { fn: getVerifiedToken } = useApiCall(
    (api, values: IMetamaskDto | IWalletConnectDto) => {
      return api
        .fetchJson({
          url: fetchUrlByActiveConnector[activeConnector as keyof typeof fetchUrlByActiveConnector],
          method: "POST",
          data: values,
        })
        .catch((error: any) => {
          void handleDisconnect();
          throw error;
        }) as Promise<{ token: string }>;
    },
    { success: false },
  );

  const onLoginMetamask = useWalletInit(async (web3Context: Web3ContextType) => {
    try {
      const provider = web3Context.provider!;
      const nonce = v4();
      const signature = await provider.getSigner().signMessage(`${phrase}${nonce}`);
      const token = await getVerifiedToken(void 0, { wallet: currentWallet.current || account, nonce, signature });
      await handleTokenVerified(token?.token || "");
    } catch (error) {
      console.error(error);
      await handleDisconnect();
    }
  });

  const onLoginWalletConnect = useWalletInit(async (web3Context: Web3ContextType) => {
    try {
      const wallet = web3Context.account!;
      const provider = web3Context.provider!;
      const nonce = v4();
      const signature = await provider.getSigner(currentWallet.current || undefined).signMessage(`${phrase}${nonce}`);
      const token = await getVerifiedToken(void 0, { wallet: currentWallet.current || wallet, nonce, signature });
      await handleTokenVerified(token?.token || "");
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  const handleMetamaskLogin = useConnectMetamask({ onClick: onLoginMetamask });
  const handleWalletConnectLogin = useConnectWalletConnect({ onClick: onLoginWalletConnect });

  /** for handling accounts in wallet connect **/
  useEffect(() => {
    if (!activeConnector && disconnectedAccounts.current.size > 0) {
      void handleWalletConnectLogin();
      disconnectedAccounts.current.delete(account);
      return;
    }

    const accountsChangedObserver = (accounts: Array<string>) => {
      if (accounts.length > 1) {
        /** active wallet will be first array element during switch in mobile app**/
        currentWallet.current = accounts[0];
        void handleWalletConnectLogin();
      } else {
        if (isUserAuthenticated) {
          disconnectedAccounts.current.set(account, true);
          void _handleDisconnect();
        }
      }
    };

    walletConnect.provider?.on("accountsChanged", accountsChangedObserver);

    return () => {
      walletConnect.provider?.off("accountsChanged", accountsChangedObserver);
    };
  }, [walletConnect, account, isActive, isUserAuthenticated, activeConnector]);

  /** for handling accounts in metamask plugin **/
  useEffect(() => {
    if (!activeConnector || currentWallet.current === account) {
      if (disconnectedAccounts.current.has(account)) {
        void handleMetamaskLogin();
        disconnectedAccounts.current.delete(account);
      }
      return;
    }

    if (activeConnector === TConnectors.METAMASK) {
      provider!
        .listAccounts()
        .then(accountList => {
          if (!isActive) {
            return;
          }

          if (currentWallet.current && !accountList.includes(currentWallet.current)) {
            if (isUserAuthenticated) {
              void user.logOut();
              disconnectedAccounts.current.set(currentWallet.current, true);
            }
            return;
          }

          if (!currentWallet.current) {
            currentWallet.current = account;
          } else if (currentWallet.current !== account) {
            if (isUserAuthenticated) {
              void user.logOut();
            } else {
              void handleMetamaskLogin();
              currentWallet.current = account;
            }
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    }
  }, [account, isActive, isUserAuthenticated, activeConnector]);
};
