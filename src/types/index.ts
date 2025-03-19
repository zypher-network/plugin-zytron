export const enum SupportedToken {
  ETH = 'ETH',
}

export interface SendTokenContentResult {
  amount: string;
  symbol: string;
  recipient: string;
}
