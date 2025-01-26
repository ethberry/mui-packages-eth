declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JSON_RPC_ADDR_ETHEREUM: string;
      JSON_RPC_ADDR_GORLY: string;
      JSON_RPC_ADDR_BINANCE: string;
      JSON_RPC_ADDR_BINANCE_TEST: string;
      JSON_RPC_ADDR_POLYGON: string;
      JSON_RPC_ADDR_MUMBAI: string;
      JSON_RPC_ADDR_BESU: string;
      JSON_RPC_ADDR_GEMUNION: string;
      JSON_RPC_ADDR_SEPOLIA: string;
      JSON_RPC_ADDR_IMMUTABLE: string;
      JSON_RPC_ADDR_IMMUTABLE_TEST: string;
      WALLET_CONNECT_DEFAULT_CHAIN_ID: string;
      WALLET_CONNECT_PROJECT_ID: string;
      PARTICLE_PROJECT_ID: string;
      PARTICLE_CLIENT_KEY: string;
      PARTICLE_APP_ID: string;
    }
  }
}

export {};
