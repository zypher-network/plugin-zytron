import { vi } from 'vitest';

vi.mock('@elizaos/core', () => ({
  generateObjectDeprecated: vi.fn(),
  composeContext: vi.fn(),
  composePromptFromState: vi.fn(),
  elizaLogger: {
    log: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
  parseKeyValueXml: vi.fn(),
  ModelType: {
    TEXT_LARGE: 'large'
  }
}));


// Mock the wallet provider
vi.mock('../src/providers/wallet', () => ({
  initWalletProvider: vi.fn(() => ({
    network: {
      nativeCurrency: {
        symbol: 'ETH'
      }
    },
    getWalletAddress: vi.fn(() => '0x1234567890123456789012345678901234567890'),
    getBalance: vi.fn(() => '1.5'),
    sendNativeToken: vi.fn(() => '0x180118f05483f7357a211b2fdce7ee6fa73ca65d63e30c27c538d454f3fe1b1c'),
  }))
}));
