import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const ENV_KEYS = {
  ZYTRON_PRIVATE_KEY: 'ZYTRON_PRIVATE_KEY'
} as const;

export const envSchema = z.object({
  [ENV_KEYS.ZYTRON_PRIVATE_KEY]: z.string().min(1, "Zytron private key is required"),
});

export type EnvConfig = z.infer<typeof envSchema>;

export async function validateEnvConfig(
  runtime: IAgentRuntime
): Promise<EnvConfig> {
  try {
    const config = {
      [ENV_KEYS.ZYTRON_PRIVATE_KEY]:
        runtime.getSetting(ENV_KEYS.ZYTRON_PRIVATE_KEY) ||
        process.env[ENV_KEYS.ZYTRON_PRIVATE_KEY],
    };

    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(errorMessages);
    }
    throw error;
  }
}
