import type { Plugin } from "@elizaos/core";
import { zytronProvider } from "./providers/wallet";

export const zytronPlugin: Plugin = {
  name: "zytron",
  description: "Zytron Plugin for Eliza",
  providers: [zytronProvider],
  actions: [],
  evaluators: [],
};

export default zytronPlugin;
