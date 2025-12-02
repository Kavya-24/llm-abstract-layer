import { getString } from "../../utils/i18Lib.js";
import { LLMProvider, type SupportedModel } from "../types/provider.js";
import { AbstractLLMProvider } from "../base/AbstractLLMProvider.js";
import { OpenAIProvider } from "../providers/OpenAIProvider.js";
import { GeminiProvider } from "../providers/GeminiProvider.js";
import { ValidationError } from "../errors/LLMError.js";

/**
 * Factory for creating LLM provider instances
 * Handles provider instantiation and validation
 */
export class LLMClientFactory {
  /**
   * Creates a provider instance based on the specified provider type
   * @param provider - The LLM provider type (OpenAI, Gemini, etc.)
   * @param apiKey - The API key for authentication
   * @param model - The model identifier for the provider
   * @param config - Optional provider-specific configuration
   * @returns An instance of the appropriate provider
   * @throws ValidationError if parameters are invalid
   */
  static createProvider(
    provider: LLMProvider,
    apiKey: string,
    model: SupportedModel,
    config?: Record<string, any>
  ): AbstractLLMProvider {
    // Validate required parameters
    this.validateParameters(provider, apiKey, model);

    // Instantiate the appropriate provider
    switch (provider) {
      case LLMProvider.OPENAI:
        return new OpenAIProvider(apiKey, model, config);

      case LLMProvider.GEMINI:
        return new GeminiProvider(apiKey, model, config);

      default:
        // This should never happen if LLMProvider enum is properly used
        throw new ValidationError(
          getString("LLM_ERROR_VALIDATION_FAILED", {
            args: {
              provider: String(provider),
              details: "Unsupported provider type",
            },
          }),
          provider
        );
    }
  }

  /**
   * Validates that all required parameters are provided and valid
   * @param provider - The provider type
   * @param apiKey - The API key
   * @param model - The model identifier
   * @throws ValidationError if any parameter is invalid
   */
  private static validateParameters(
    provider: LLMProvider | undefined,
    apiKey: string | undefined,
    model: SupportedModel | undefined
  ): void {
    // Validate provider
    if (!provider) {
      throw new ValidationError(
        getString("LLM_ERROR_VALIDATION_FAILED", {
          args: {
            provider: "unknown",
            details: "Provider is required",
          },
        }),
        LLMProvider.OPENAI // Use a default for error context
      );
    }

    // Validate that provider is a valid enum value
    if (!Object.values(LLMProvider).includes(provider)) {
      throw new ValidationError(
        getString("LLM_ERROR_VALIDATION_FAILED", {
          args: {
            provider: String(provider),
            details: "Invalid provider type",
          },
        }),
        provider
      );
    }

    // Validate API key
    if (!apiKey || !apiKey.trim()) {
      throw new ValidationError(
        getString("LLM_ERROR_MISSING_API_KEY"),
        provider
      );
    }

    // Validate model
    if (!model || (typeof model === "string" && !model.trim())) {
      throw new ValidationError(
        getString("LLM_ERROR_VALIDATION_FAILED", {
          args: {
            provider: String(provider),
            details: "Model is required",
          },
        }),
        provider
      );
    }
  }
}
