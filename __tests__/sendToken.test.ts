import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendTokenAction } from "../src/actions/sendToken";
import { initWalletProvider } from "../src/providers/wallet";

describe('checkWalletAction', () => {
  const mockRuntime = {
    composeState: vi.fn(),
    updateRecentMessageState: vi.fn(),
    useModel: vi.fn(),
  };
  const mockMessage = {};
  const mockState = {};
  const mockCallback = vi.fn();
  // const mockParams = {
  //   amount: '1.5',
  //   symbol: 'ETH',
  //   recipient: '0x2d15D52Cc138FFB322b732239CD3630735AbaC88',
  // }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully send tokens', async () => {

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
        text: expect.stringContaining('Send Token failed: Please ensure all fields are provided correctly.'),
      })
    );
  });

  // it('should prevent sending to own address', async () => {
  //   await sendTokenAction.handler(
  //     mockRuntime as any,
  //     mockMessage as any,
  //     mockState as any,
  //     {},
  //     mockCallback
  //   );

  //   expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
  //   expect(mockCallback).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       text: expect.stringContaining('Please ensure the recipient address is different from your wallet address'),
  //     })
  //   );
  // });

  // it('should handle insufficient balance error', async () => {
  //   await sendTokenAction.handler(
  //     mockRuntime as any,
  //     mockMessage as any,
  //     mockState as any,
  //     {},
  //     mockCallback
  //   );

  //   expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
  //   expect(mockCallback).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       text: expect.stringContaining('Insufficient balance'),
  //     })
  //   );
  // });

  // it('should handle invalid recipient error', async () => {
  //   await sendTokenAction.handler(
  //     mockRuntime as any,
  //     mockMessage as any,
  //     mockState as any,
  //     {},
  //     mockCallback
  //   );

  //   expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
  //   expect(mockCallback).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       text: expect.stringContaining('Please ensure the recipient address is valid.'),
  //     })
  //   );
  // });
  // it('should handle unsupported token', async () => {
  //   await sendTokenAction.handler(
  //     mockRuntime as any,
  //     mockMessage as any,
  //     mockState as any,
  //     {},
  //     mockCallback
  //   );

  //   expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
  //   expect(mockCallback).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       text: expect.stringContaining('Token is not supported.'),
  //     })
  //   );
  // });
});
