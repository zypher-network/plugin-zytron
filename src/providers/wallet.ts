import { Chain, createPublicClient, createWalletClient, http, WalletClient, formatUnits } from "viem";
import { privateKeyToAccount } from 'viem/accounts';
import {
  elizaLogger,
  type IAgentRuntime,
  type Memory,
  type Provider,
  type State,
} from "@elizaos/core";
import { ENV_KEYS } from "../environment";
import { zytron } from "../constants";

export class WalletProvider {
  network: Chain = zytron;
  private client: WalletClient;

  constructor(privateKey: `0x${string}`) {
    this.setClient(privateKey);
  }

  setClient(privateKey: `0x${string}`) {
    this.client = createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: this.network,
      transport: http(),
    });
  }

  getPublicClient() {
    return createPublicClient({
      chain: this.network,
      transport: http(),
    });
  }

  getWalletAddress() {
    return this.client.account.address;
  }

  async getBalance() {
    const publicClient = this.getPublicClient();
    const balance = await publicClient.getBalance({
      address: this.client.account.address,
    });
    return formatUnits(balance, 18);
  }
}

export const initWalletProvider = (runtime: IAgentRuntime) => {
  const privateKey = runtime.getSetting(ENV_KEYS.ZYTRON_PRIVATE_KEY);
  if (!privateKey) {
      throw new Error(`${ENV_KEYS.ZYTRON_PRIVATE_KEY} is missing`);
  }

  return new WalletProvider((privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`) as `0x${string}`);
};

export const zytronProvider: Provider = {
  get: async (runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<string> => {
    elizaLogger.debug("[zytronProvider]: get - start");
    const walletProvider = initWalletProvider(runtime);
    const balance = await walletProvider.getBalance();
    return [
      `Zytron Mainnet (ChainId: ${walletProvider.network.id})`,
      `- Wallet Address: ${walletProvider.getWalletAddress()}`,
      `- Balance       : ${balance} ${walletProvider.network.nativeCurrency.symbol}`,
    ].join('\n\n');
  }
};
