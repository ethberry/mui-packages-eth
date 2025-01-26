import {
  LoginOptions,
  type Config,
  ParticleNetwork,
  type ParticleNetwork as TParticleNetwork,
} from "@particle-network/auth";
import { chains } from "@particle-network/chains";
import { ParticleProvider } from "@particle-network/provider";
import { initializeConnector } from "@web3-react/core";
import { Connector, type Actions, type ProviderRpcError } from "@web3-react/types";

export interface IParticleConnectConstructorArgs {
  actions: Actions;
  options: Config;
  onError?: (error: Error) => void;
}

/* javascript-obfuscator:disable */
const PARTICLE_PROJECT_ID = process.env.PARTICLE_PROJECT_ID;
const PARTICLE_CLIENT_KEY = process.env.PARTICLE_CLIENT_KEY;
const PARTICLE_APP_ID = process.env.PARTICLE_APP_ID;
/* javascript-obfuscator:enable */

export class ParticleAuth extends Connector {
  public provider: any;
  private particle: TParticleNetwork | undefined;
  private readonly options: Config;
  private eagerConnection?: Promise<any>;

  constructor({ actions, options, onError }: IParticleConnectConstructorArgs) {
    super(actions, onError);
    this.options = options;
  }

  private onDisconnect = (error?: ProviderRpcError): void => {
    this.actions.resetState();
    if (error) this.onError?.(error);
  };

  private onChainChanged = (chainId: number | string): void => {
    this.actions.update({ chainId: Number(chainId) });
  };

  private onAccountsChanged = (accounts: string[]): void => {
    if (accounts.length === 0) {
      this.actions.resetState();
    } else {
      this.actions.update({ accounts });
    }
  };

  private setupEventListeners(): void {
    if (this.provider) {
      this.provider.on("disconnect", this.onDisconnect);
      this.provider.on("onChainChanged", this.onChainChanged);
      this.provider.on("accountsChanged", this.onAccountsChanged);
    }
  }

  private removeEventListeners(): void {
    if (this.provider) {
      this.provider.off("disconnect", this.onDisconnect);
      this.provider.off("onChainChanged", this.onChainChanged);
      this.provider.off("accountsChanged", this.onAccountsChanged);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async isomorphicInitialize() {
    if (this.eagerConnection) {
      return;
    }
    if (typeof window !== "undefined") {
      this.particle = new ParticleNetwork(this.options);
      this.provider = new ParticleProvider(this.particle.auth);
      this.setupEventListeners();
    }
  }

  private get connected(): boolean {
    return this.particle?.auth?.isLogin() ?? false;
  }

  async activate(params: LoginOptions): Promise<void> {
    const cancelActivation = this.actions.startActivation();

    await this.isomorphicInitialize();
    if (this.particle) {
      try {
        if (!this.connected) {
          await this.particle.auth.login(params);
        }
        const account = (await this.particle.evm.getAddress())!;
        this.actions.update({ chainId: this.particle.auth.getChainId(), accounts: [account] });
      } catch (e) {
        void e;
        cancelActivation();
      }
    } else {
      cancelActivation();
    }
  }

  async connectEagerly(): Promise<void> {
    const cancelActivation = this.actions.startActivation();

    try {
      await this.isomorphicInitialize();

      if (!this.provider || !this.connected) {
        throw new Error("No existing connection");
      }
      const accounts = await this.provider.request({ method: "eth_accounts" });
      const chainId = await this.provider.request({ method: "eth_chainId" });
      this.actions.update({ chainId: Number(chainId), accounts });
    } catch (error) {
      cancelActivation();
      throw error;
    }
  }

  async switchChain(chainId: number): Promise<void> {
    const allChains = chains.getAllChainInfos();
    const chain = allChains.find(chain => chain.id === chainId);
    if (chain) {
      await this.particle?.auth?.switchChain(chain);
      this.onChainChanged(chainId);
    } else {
      await this.deactivate();
    }
  }

  async deactivate(): Promise<void> {
    await this.particle?.auth?.logout();
    this.removeEventListeners();
    this.actions.resetState();
  }

  isValidChain(chainId: number | undefined): boolean {
    if (chainId) {
      const allChains = chains.getAllChainInfos();
      return !!allChains.find(chain => chain.id === chainId);
    }
    return false;
  }
}

export const [particleAuth, hooks] = initializeConnector<ParticleAuth>(
  actions =>
    new ParticleAuth({
      actions,
      options: {
        projectId: PARTICLE_PROJECT_ID,
        clientKey: PARTICLE_CLIENT_KEY,
        appId: PARTICLE_APP_ID,
        wallet: {
          displayWalletEntry: false,
        },
      },
    }),
);
