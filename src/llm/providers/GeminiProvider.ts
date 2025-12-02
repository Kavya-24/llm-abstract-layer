import { GoogleGenAI } from "@google/genai";
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

export class GeminiProvider extends AbstractLLMProvider {
  private client: GoogleGenAI;

  constructor(apiKey: string, model: SupportedModel, config: Record<string, any> = {}) {
    super(apiKey, model, LLMProvider.GEMINI, config);
    this.client = new GoogleGenAI({
      apiKey: this.apiKey,
      ...config.clientOptions,
    });
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    this.logRequest(request);
    const messages = this.formatMessages(request.messages);
    
    try {
        const response = await this.client.models.generateContent({
            model: this.model,
            contents: messages[0]!!,
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
     * Sample Error: {\"error\":{\"code\":429,\"message\":\"Resource exhausted. Please try again later. Please refer to https://cloud.google.com/vertex-ai/generative-ai/docs/error-code-429 for more details.\",\"status\":\"RESOURCE_EXHAUSTED\"}
     */
    const err = error;
    const message = (JSON.parse(err.message) || {}).error?.message ?? "Unknown provider error";

    return {
      id: `error_${Date.now()}`,
      content: message,
      statusCode: err.status,
      statusReason: err.name,
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

  protected formatMessages(messages: Message[]): string[] {
    this.validateRequestMessageExistence(messages);
    const formatted = messages.map((msg) => msg.content ?? "")
                              .filter((content) => content.length > 0) // remove empty roles
                              .join("\n\n");
    return [formatted];
  }

  /** Translate GeminiProvider response to unified CompletionResponse */
  protected translateResponse(providerResponse: any): CompletionResponse {
    const response =  {
      id: providerResponse.responseId ?? "unknown",
      content: providerResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
      usage: this.extractUsageMetrics(providerResponse),
      finishReason: (providerResponse.candidates?.[0]?.finishReason ?? "stop") as "stop" | "tool_calls" | "length" | "error",
      statusCode: 200,
      toolCalls: []
    };
    this.logResponse(response);
    return response;
  }

  protected extractUsageMetrics(providerResponse: any): UsageData {
    return { 
      promptTokens: providerResponse.usageMetadata?.promptTokenCount ?? 0, 
      completionTokens: providerResponse.usageMetadata?.candidatesTokenCount ?? 0, 
      totalTokens: providerResponse.usageMetadata?.totalTokenCount ?? 0, 
      model: this.model 
    };
  }
}
