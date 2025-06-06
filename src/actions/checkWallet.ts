import { Action, composePromptFromState, elizaLogger, HandlerCallback, IAgentRuntime, Memory, ModelType, parseKeyValueXml, State } from '@elizaos/core';
import { checkWalletTemplate } from '../templates';
import { initWalletProvider } from '../providers/wallet';
import { isAddress } from 'viem';

export const checkWalletAction: Action = {
  name: 'CHECK_WALLET',
  description: 'Retrieve and display the wallet balance for your wallet or the specified address on Zytron Mainnet.',
  similes: [
    'CHECK_BALANCE',
    'CHECK_WALLET_BALANCE',
    'CHECK_WALLET_BALANCE_ON_ZYTRON',
    'GET_BALANCE',
    'GET_WALLET_BALANCE',
    'GET_WALLET_BALANCE_ON_ZYTRON',
  ],
  validate: async (_runtime: IAgentRuntime) => true,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback?: HandlerCallback,
  ) => {
    elizaLogger.log("Checking wallet balance...");

    state = await runtime.composeState(message);

    const checkWalletContext = composePromptFromState({
      state,
      template: checkWalletTemplate,
    });

    const xmlResponse = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt: checkWalletContext,
    });

    const content = parseKeyValueXml(xmlResponse);

    const walletProvider = initWalletProvider(runtime);

    let balance = '0';
    let text = '';
    const symbol = walletProvider.network.nativeCurrency.symbol;
    const address = (content?.address || '').trim() || walletProvider.getWalletAddress();

    try {
      if (!isAddress(address)) throw new Error(`Invalid address: ${address}`);
      balance = await walletProvider.getBalance(address);
      text = `Balance of ${address} on Zytron Mainnet: - ${balance} ${symbol}`;
    } catch (error) {
      elizaLogger.error("Error during check wallet balance:", error.message);
      text = `Check wallet balance failed: ${error.message}`;
    }

    elizaLogger.info(`[check wallet]: ${text}`);

    if (callback) {
      callback({
        text,
        content: { balance, text, symbol },
      });
    }

    return true;
  },
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Check my wallet",
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "Balance of 0x2d15D52Cc138FFB322b732239CD3630735AbaC88 on Zytron Mainnet:\n- 1.5 ETH",
          actions: ['CHECK_WALLET'],
        }
      },
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Check my balance",
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "Balance of 0x2d15D52Cc138FFB322b732239CD3630735AbaC88 on Zytron Mainnet:\n- 1.5 ETH",
          actions: ['CHECK_WALLET'],
        }
      },
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Check 0x2d15D52Cc138FFB322b732239CD3630735AbaC88",
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "Balance of 0x2d15D52Cc138FFB322b732239CD3630735AbaC88 on Zytron Mainnet:\n- 1.5 ETH",
          actions: ['CHECK_WALLET'],
        }
      },
    ],
  ],
};
