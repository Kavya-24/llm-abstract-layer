import { getString } from "../../utils/i18Lib.js";
import { LLMProvider, type SupportedModel } from "../types/provider.js";
import { ValidationError } from "../errors/LLMError.js";
import { LLMClientFactory } from "../factory/LLMClientFactory.js";
import { AbstractLLMProvider } from "../base/AbstractLLMProvider.js";
import { LLMClient } from "../client/LLMClient.js";

/**
 * Builder for creating and configuring LLM client instances
 * Provides a fluent interface for setting provider, model, API key, and configuration
 */
export class LLMClientBuilder {
  private provider?: LLMProvider;
  private model?: SupportedModel;
  private apiKey?: string;
  private config?: Record<string, any>;

  /**
   * Sets the LLM provider type
   * @param provider - The provider to use (OpenAI, Gemini, etc.)
   * @returns This builder instance for method chaining
   */
  setProvider(provider: LLMProvider): LLMClientBuilder {
    this.provider = provider;
    return this;
  }

  /**
   * Sets the model identifier for the provider
   * @param model - The model to use (e.g., gpt-4, gemini-pro)
   * @returns This builder instance for method chaining
   */
  setModel(model: SupportedModel): LLMClientBuilder {
    this.model = model;
    return this;
  }

  /**
   * Sets the API key for authentication with the provider
   * @param apiKey - The API key for the provider
   * @returns This builder instance for method chaining
   */
  setApiKey(apiKey: string): LLMClientBuilder {
    this.apiKey = apiKey;
    return this;
  }

  /**
   * Sets provider-specific configuration options
   * @param config - Configuration object with provider-specific options
   * @returns This builder instance for method chaining
   */
  setConfig(config: Record<string, any>): LLMClientBuilder {
    this.config = config;
    return this;
  }

  /**
   * Builds and returns a configured LLMClient instance
   * Validates that all required fields are set before building
   * @returns A configured LLMClient instance
   * @throws ValidationError if required fields are missing
   */
  build(): LLMClient {
    this.validateRequiredFields();

    // Create the provider using the factory
    const provider: AbstractLLMProvider = LLMClientFactory.createProvider(
      this.provider!,
      this.apiKey!,
      this.model!,
      this.config
    );

    // Return the configured LLM client
    return new LLMClient(provider);
  }

  /**
   * Validates that all required fields have been set
   * @throws ValidationError if any required field is missing
   */
  private validateRequiredFields(): void {
    const missingFields: string[] = [];

    if (!this.provider) {
      missingFields.push("provider");
    }

    if (!this.model) {
      missingFields.push("model");
    }

    if (!this.apiKey) {
      missingFields.push("apiKey");
    }

    if (missingFields.length > 0) {
      throw new ValidationError(
        getString("LLM_ERROR_VALIDATION_FAILED", {
          args: {
            provider: this.provider || "unknown",
            details: `Missing required fields: ${missingFields.join(", ")}`,
          },
        }),
        this.provider || LLMProvider.OPENAI
      );
    }
  }
}
