import { Action, composePromptFromState, elizaLogger, HandlerCallback, IAgentRuntime, Memory, ModelType, parseKeyValueXml, State } from '@elizaos/core';
import { isAddress, parseUnits } from 'viem';
import { sendTokenTemplate } from '../templates';
import { initWalletProvider } from '../providers/wallet';
import { SendTokenContentResult, SupportedToken } from '../types';

export const sendTokenAction: Action = {
  name: 'SEND_TOKEN',
  description: 'Send token to the specified address on Zytron Mainnet.',
  similes: [
    'SEND_TOKEN',
    'SEND_TOKEN_ON_ZYTRON',
    'TRANSFER_TOKEN',
    'TRANSFER_TOKEN_ON_ZYTRON',
  ],
  validate: async (_runtime: IAgentRuntime) => true,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback?: HandlerCallback
  ) => {
    elizaLogger.info("Sending token...");
    
    state = await runtime.composeState(message);

    const sendTokenContext = composePromptFromState({
      state,
      template: sendTokenTemplate,
    });

    const xmlResponse = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt: sendTokenContext,
    });

    const content = parseKeyValueXml(xmlResponse);

    const walletProvider = initWalletProvider(runtime);
    const { amount, symbol, recipient } = content as SendTokenContentResult ?? {};

    let text = '';
    let transactionHash = '';
    try {
      if (![amount, symbol, recipient].every(Boolean)) throw new Error('Please ensure all fields are provided correctly.');
      if (recipient.toLowerCase() === walletProvider.getWalletAddress().toLowerCase()) throw new Error('Please ensure the recipient address is different from your wallet address.');
      if (!isAddress(recipient)) throw new Error('Please ensure the recipient address is valid.');
      if (symbol.toUpperCase() !== SupportedToken.ETH) throw new Error('Token is not supported.');
      const balance = await walletProvider.getBalance();
      if (balance < amount) throw new Error('Insufficient balance.');
      const value = parseUnits(amount.toString(), walletProvider.network.nativeCurrency.decimals);
      transactionHash = await walletProvider.sendNativeToken(recipient, value);
      text = [
        'Success! Your transaction has been successfully submitted.',
        `Amount: ${amount} ${symbol}`,
        `Recipient: ${recipient}\n`,
        `Transaction Hash: ${transactionHash}`
      ].join('\n');
    } catch (error) {
      elizaLogger.error("Error during send token:", error.message);
      text = `Send Token failed: ${error.message}`;
    }
    elizaLogger.info(`[send token]: ${text}`);

    if (callback) {
      callback({
        text,
        content: { transactionHash, amount, symbol, recipient }
      });
    }
    return true;
  },
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Send 0.0001 ETH to 0x2d15D52Cc138FFB322b732239CD3630735AbaC88"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll help you send 0.0001 ETH to 0x2d15D52Cc138FFB322b732239CD3630735AbaC88",
          actions: ['SEND_TOKEN']
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Transfer 0.0001 ETH to 0x2d15D52Cc138FFB322b732239CD3630735AbaC88"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll help you transfer 0.0001 ETH to 0x2d15D52Cc138FFB322b732239CD3630735AbaC88",
          actions: ['SEND_TOKEN']
        }
      }
    ],
  ],
};
