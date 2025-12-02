import { getString } from "../../utils/i18Lib.js";
import { LLMProvider } from "../types/provider.js";
import type { SupportedModel } from "../types/provider.js";
import type { CompletionRequest, CompletionResponse } from "../types/completion.js";
import type { Message } from "../types/message.js";
import type { StreamResponse } from "../types/streaming.js";
import type { StructuredOutputResponse } from "../types/structured.js";
import { LLMError, ValidationError } from "../errors/LLMError.js";
import { logLLMError, translateProviderError } from "../errors/errorUtils.js";


export abstract class AbstractLLMProvider {
  protected apiKey: string;
  protected model: SupportedModel;
  protected provider: LLMProvider;
  protected config: Record<string, any>;

  constructor(
    apiKey: string,
    model: SupportedModel,
    provider: LLMProvider,
    config: Record<string, any> = {}
  ) {
    this.validateApiKey(apiKey);
    this.apiKey = apiKey;
    this.model = model;
    this.provider = provider;
    this.config = config;
  }

  abstract complete(request: CompletionRequest): Promise<CompletionResponse>;
  abstract stream(request: CompletionRequest): Promise<StreamResponse>;
  abstract completeWithStructuredOutput(request: CompletionRequest): Promise<StructuredOutputResponse>;
  abstract completeWithToolInvocation(request: CompletionRequest): Promise<CompletionResponse>;
  abstract parseProviderError(error: any) : CompletionResponse;

  protected validateApiKey(apiKey?: string) {
    if (!apiKey?.trim()) {
      throw new ValidationError(getString("LLM_ERROR_MISSING_API_KEY"), this.provider);
    }
  }

  protected validateRequestMessageExistence(messages: Message[]) {
    if(messages.length === 0) {
      throw new ValidationError(getString("LLM_MISSING_REQUEST_MESSAGES"), this.provider);
    }
  }

  protected formatMessages(messages: Message[]): any[] {
    return messages; // override in subclasses if needed
  }

  protected translateResponse(providerResponse: any): CompletionResponse {
    throw new Error("translateResponse must be implemented by subclass");
  }

  protected extractUsageMetrics(providerResponse: any): Record<string, any> {
    throw new Error("extractUsageMetrics must be implemented by subclass");
  }


  protected handleError(error: any): LLMError {
    const parsedErrorCompletionResponse = this.parseProviderError(error);
    return translateProviderError(parsedErrorCompletionResponse, this.provider);
  }

  protected logRequest(request: CompletionRequest) {
    console.debug(
      `[LLM Request] ${this.provider}`,
      JSON.stringify({
        provider: this.provider,
        model: this.model,
        messageCount: request.messages.length,
        hasTools: !!request.tools?.length,
        hasStructuredOutput: !!request.structuredOutput,
        stream: request.stream ?? false,
      })
    );
  }

  protected logResponse(response: CompletionResponse) {
    console.debug(
      `[LLM Response] ${this.provider}`,
      JSON.stringify({
        provider: this.provider,
        model: this.model,
        finishReason: response.finishReason,
        usage: response.usage,
        hasToolCalls: !!response.toolCalls?.length,
      })
    );
  }

  protected logError(error: LLMError, context?: Record<string, any>) {
    logLLMError(error, { model: this.model, ...context });
  }
}
