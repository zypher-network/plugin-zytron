import { type Plugin } from "@elizaos/core";
import { checkWalletAction } from "./actions/checkWallet";
import { sendTokenAction } from "./actions/sendToken";

export const zytronPlugin: Plugin = {
  name: "zytron",
  description: "Zytron Plugin for Eliza",
  providers: [],
  actions: [checkWalletAction, sendTokenAction],
  evaluators: [],
};

export default zytronPlugin;
