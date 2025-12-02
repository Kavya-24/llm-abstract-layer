import { AbstractLLMProvider } from "../base/AbstractLLMProvider.js";
import { LLMClientBuilder } from "../builder/LLMClientBuilder.js";
import type { CompletionRequest, CompletionResponse } from "../types/completion.js";
import type { StreamResponse } from "../types/streaming.js";
import type { StructuredOutputResponse } from "../types/structured.js";

/**
 * Main LLM client interface that delegates to provider implementations
 * Provides a unified API for interacting with different LLM providers
 */
export class LLMClient {
  private provider: AbstractLLMProvider;

  /**
   * Creates an LLMClient instance with the specified provider
   * @param provider - The provider instance to use for LLM operations
   */
  constructor(provider: AbstractLLMProvider) {
    this.provider = provider;
  }

  /**
   * Sends a completion request to the LLM provider
   * @param request - The completion request with messages and options
   * @returns A promise resolving to the completion response
   */
  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    return this.provider.complete(request);
  }

  /**
   * Sends a streaming completion request to the LLM provider
   * @param request - The completion request with messages and options
   * @returns A promise resolving to a stream response with async iterator
   */
  async stream(request: CompletionRequest): Promise<StreamResponse> {
    return this.provider.stream(request);
  }

  /**
   * Sends a structured output request to the LLM provider
   * @param request - The completion request with schema definition
   * @returns A promise resolving to a structured output response
   */
  async structuredOutput(request: CompletionRequest): Promise<StructuredOutputResponse> {
    return this.provider.completeWithStructuredOutput(request);
  }

  /**
   * Sends a tool calling request to the LLM provider
   * @param request - The completion request with tool definitions
   * @returns A promise resolving to a completion response with tool calls
   */
  async callTools(request: CompletionRequest): Promise<CompletionResponse> {
    return this.provider.completeWithToolInvocation(request);
  }

  /**
   * Creates a new builder for configuring and building LLM clients
   * @returns A new LLMClientBuilder instance
   */
  static builder(): LLMClientBuilder {
    return new LLMClientBuilder();
  }
}
