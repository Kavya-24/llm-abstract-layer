/**
 * Provider enums and configuration types for LLM abstraction system
 */

export enum LLMProvider {
  OPENAI = "openai",
  GEMINI = "gemini",
}

export enum OpenAIModel {
  GPT_4o_mini = "gpt-4o-mini-2024-07-18",
  GPT_4 = "gpt-4",
  GPT_4_TURBO = "gpt-4-turbo-preview",
  GPT_35_TURBO = "gpt-3.5-turbo"
}

export enum GeminiModel {
  GEMINI_PRO = "gemini-pro",
  GEMINI_PRO_VISION = "gemini-pro-vision",
  GEMINI_2_FLASH = "gemini-2.0-flash",
  GEMINI_2_FLASH_LITE = "gemini-2.0-flash-lite"
}

export enum APIKeyConfig {
  ENVIRONMENT = "environment",
  PARAMETER = "parameter",
  HEADER = "header"
}

export type SupportedModel = OpenAIModel | GeminiModel | string;

export interface ProviderConfig {
  provider: LLMProvider;
  model: SupportedModel;
  apiKey: string;
  apiKeyConfig?: APIKeyConfig;
}
