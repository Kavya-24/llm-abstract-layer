import OpenAI from "openai";

import type {
  CompletionRequest,
  CompletionResponse,
  StreamResponse,
  StructuredOutputResponse,
  Message,
  UsageData,
} from "../types/index.js";
import { LLMProvider, type SupportedModel } from "../types/provider.js";
import { LLMError } from "../errors/LLMError.js";
import { AbstractLLMProvider } from "../base/AbstractLLMProvider.js";


export class OpenAIProvider extends AbstractLLMProvider {
  private client: OpenAI;

  constructor(apiKey: string, model: SupportedModel, config: Record<string, any> = {}) {
    super(apiKey, model, LLMProvider.OPENAI, config);

    this.client = new OpenAI({
      apiKey: this.apiKey,
      ...config.clientOptions,
    });
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    this.logRequest(request);
    const messages = this.formatMessages(request.messages);

    try {
          const response = await this.client.chat.completions.create({
            model: this.model,
            messages: messages,
            temperature: request.temperature ?? 0.0,
            max_tokens: request.maxTokens ?? null,
            top_p: request.topP ?? null
          });

        return this.translateResponse(response);
    } catch (e: any) {
        const error = this.handleError(e);
        this.logError(error);
        throw error;
    }
  }

  /** Streaming */
  async stream(request: CompletionRequest): Promise<StreamResponse> {
    throw new LLMError("Not implemented", this.provider);
  }

  /** Structured output */
  async completeWithStructuredOutput(request: CompletionRequest): Promise<StructuredOutputResponse> {
    throw new LLMError("Not implemented", this.provider);
  }

  /** Tool calls */
  async completeWithToolInvocation(request: CompletionRequest): Promise<CompletionResponse> {
    throw new LLMError("Not implemented", this.provider);
  }
  
  /** Parse Error */
  parseProviderError(error: any): CompletionResponse {
    /**
     * Sample Error: 
     * AuthenticationError: 401 Incorrect API key provided: s. You can find your API key at https://platform.openai.com/account/api-keys.
          at APIError.generate ...
          {
            status: 401,
            headers: Headers {
              date: 'Tue, 02 Dec 2025 18:57:07 GMT',
              'content-type': 'application/json; charset=utf-8',
              'content-length': '251',
              connection: 'keep-alive',
              vary: 'Origin',
            },
            requestID: 'req_x',
            error: {
              message: 'Incorrect API key provided: s. You can find your API key at https://platform.openai.com/account/api-keys.',
              type: 'invalid_request_error',
              param: null,
              code: 'invalid_api_key'
            },
            code: 'invalid_api_key',
            param: null,
            type: 'invalid_request_error'
          }
     */
    const err = error?.error || {};

    const statusCode = error.status ?? 500;
    const statusReason = err.code ?? "UNKNOWN_ERROR";
    const message = err.message ?? "Unknown provider error";

    return {
      id: `error_${Date.now()}`,
      content: message,
      statusCode,
      statusReason,
      finishReason: "error",
      toolCalls: [],
      rawProviderError: error,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        model: this.model
      },
    };
  }


  /** Format unified messages for OpenAI */
  protected formatMessages(messages: Message[]): any[] {
    this.validateRequestMessageExistence(messages);
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /** Translate OpenAI response to unified CompletionResponse */
  protected translateResponse(providerResponse: any): CompletionResponse {
    const response = {
      id: providerResponse.id ?? "unknown",
      content: providerResponse.choices?.[0]?.message?.content ?? "",
      usage: this.extractUsageMetrics(providerResponse),
      statusCode: 200,
      finishReason: (providerResponse.choices?.[0]?.finish_reason ?? "stop") as "stop" | "tool_calls" | "length" | "error",
      toolCalls: providerResponse.choices?.[0]?.message?.tool_calls
    };
    this.logResponse(response);
    return response;
  }

  protected extractUsageMetrics(providerResponse: any): UsageData {
    return { 
      promptTokens: providerResponse.usage?.prompt_tokens ?? 0, 
      completionTokens: providerResponse.usage?.completion_tokens ?? 0, 
      totalTokens: providerResponse.usage?.total_tokens ?? 0, 
      model: this.model 
    };
  }
}
