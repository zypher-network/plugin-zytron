import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkWalletAction } from '../src/actions/checkWallet';
import { initWalletProvider } from '../src/providers/wallet';

describe('checkWalletAction', () => {
  const mockRuntime = {
    composeState: vi.fn(),
    updateRecentMessageState: vi.fn(),
    useModel: vi.fn(),
  };
  const mockMessage = {};
  const mockState = {};
  const mockCallback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should check balance for default wallet address', async () => {
    await checkWalletAction.handler(
      mockRuntime as any,
      mockMessage as any,
      mockState as any,
      {},
      mockCallback
    );

    expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('1.5 ETH'),
        content: expect.objectContaining({
          balance: '1.5',
          symbol: 'ETH'
        })
      })
    );
  });

  // it('should check balance for specified address', async () => {
  //   const specifiedAddress = '0x9876543210987654321098765432109876543210';
    
  //   vi.mocked(mockRuntime.composeState).mockResolvedValueOnce({});

  //   await checkWalletAction.handler(
  //     mockRuntime as any,
  //     mockMessage as any,
  //     undefined,
  //     {},
  //     mockCallback
  //   );

  //   expect(initWalletProvider).toHaveBeenCalledWith(mockRuntime);
  //   expect(mockCallback).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       text: expect.stringContaining(specifiedAddress),
  //       content: expect.objectContaining({
  //         balance: '1.5',
  //         symbol: 'ETH'
  //       })
  //     })
  //   );
  // });

  // it('should handle invalid address error', async () => {
  //   vi.mocked(mockRuntime.composeState).mockResolvedValueOnce({});

  //   await checkWalletAction.handler(
  //     mockRuntime as any,
  //     mockMessage as any,
  //     undefined,
  //     {},
  //     mockCallback
  //   );

  //   expect(mockCallback).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       text: expect.stringContaining('Invalid address'),
  //     })
  //   );
  // });
});
