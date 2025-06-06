import { Chain, createPublicClient, createWalletClient, http, WalletClient, formatUnits, PublicClient, HttpTransport, Account, Address } from "viem";
import { privateKeyToAccount } from 'viem/accounts';
import {
  elizaLogger,
  type IAgentRuntime,
  type Memory,
  type Provider,
  type State,
  type ProviderResult,
} from "@elizaos/core";
import { ENV_KEYS } from "../environment";
import { zytron } from "../constants";

export class WalletProvider {
  network: Chain = zytron;
  private client: WalletClient;

  constructor(privateKey: `0x${string}`) {
    this.setClient(privateKey);
  }

  setClient(privateKey: `0x${string}`): void {
    this.client = createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: this.network,
      transport: http(),
    });
  }

  getPublicClient(): PublicClient<HttpTransport, Chain, Account | undefined>  {
    const publicClient = createPublicClient({
      chain: this.network,
      transport: http(),
    });
    return publicClient;
  }

  getWalletAddress(): Address {
    return this.client.account.address;
  }

  async getBalance(address?: Address): Promise<string> {
    const publicClient = this.getPublicClient();
    const balance = await publicClient.getBalance({
      address: address || this.client.account.address,
    });
    return formatUnits(balance, 18);
  }

  async sendNativeToken(recipient: string, value: bigint): Promise<string> {
    const hash = await this.client.sendTransaction({
      value,
      account: this.client.account,
      to: recipient,
      kzg: undefined,
      chain: this.network,
    });
    return hash;
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
  name: 'ZytronProvider',
  get: async (runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<ProviderResult> => {
    elizaLogger.info("[zytronProvider]: get - start");
    const walletProvider = initWalletProvider(runtime);
    const balance = await walletProvider.getBalance();
    return {
      text: [
        `Zytron Mainnet (ChainId: ${walletProvider.network.id})`,
        `- Wallet Address: ${walletProvider.getWalletAddress()}`,
        `- Balance       : ${balance} ${walletProvider.network.nativeCurrency.symbol}`,
      ].join('\n\n'),
      data: {
        address: walletProvider.getWalletAddress(),
        balance,
      },
      values: {
        address: walletProvider.getWalletAddress(),
        balance,
      }
    }
  }
};
