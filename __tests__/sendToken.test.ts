import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { sendTokenAction } from "../src/actions/sendToken";
import { initWalletProvider } from "../src/providers/wallet";
import { generateObjectDeprecated } from "@elizaos/core";

describe('checkWalletAction', () => {
  const mockRuntime = {
    composeState: vi.fn(),
    updateRecentMessageState: vi.fn(),
  };
  const mockMessage = {};
  const mockState = {};
  const mockCallback = vi.fn();
  const mockParams = {
    amount: '1.5',
    symbol: 'ETH',
    recipient: '0x2d15D52Cc138FFB322b732239CD3630735AbaC88',
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully send tokens', async () => {
    vi.mocked(generateObjectDeprecated as Mock)
      .mockImplementationOnce(() => Promise.resolve(mockParams));

    await sendTokenAction.handler(
      mockRuntime as any,
      mockMessage as any,
      mockState as any,
      {},
      mockCallback
    );

    expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Your transaction has been successfully submitted'),
      })
    );
  });

  it('should prevent sending to own address', async () => {
    vi.mocked(generateObjectDeprecated as Mock)
      .mockImplementationOnce(() => Promise.resolve({ ...mockParams, recipient: '0x1234567890123456789012345678901234567890' }));

    await sendTokenAction.handler(
      mockRuntime as any,
      mockMessage as any,
      mockState as any,
      {},
      mockCallback
    );

    expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Please ensure the recipient address is different from your wallet address'),
      })
    );
  });

  it('should handle insufficient balance error', async () => {
    vi.mocked(generateObjectDeprecated as Mock)
      .mockImplementationOnce(() => Promise.resolve({ ...mockParams, amount: '10' }));

    await sendTokenAction.handler(
      mockRuntime as any,
      mockMessage as any,
      mockState as any,
      {},
      mockCallback
    );

    expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Insufficient balance'),
      })
    );
  });

  it('should handle invalid recipient error', async () => {
    vi.mocked(generateObjectDeprecated as Mock)
      .mockImplementationOnce(() => Promise.resolve({ ...mockParams, recipient: 'invalid-address' }));

    await sendTokenAction.handler(
      mockRuntime as any,
      mockMessage as any,
      mockState as any,
      {},
      mockCallback
    );

    expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Please ensure the recipient address is valid.'),
      })
    );
  });
  it('should handle unsupported token', async () => {
    vi.mocked(generateObjectDeprecated as Mock)
      .mockImplementationOnce(() => Promise.resolve({ ...mockParams, symbol: 'BTC' }));

    await sendTokenAction.handler(
      mockRuntime as any,
      mockMessage as any,
      mockState as any,
      {},
      mockCallback
    );

    expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Token is not supported.'),
      })
    );
  });
});
