/**
 * Completion request and response types
 */

import type { Message, ToolCall } from "./message.js";
import type { Tool } from "./tools.js";
import type { StructuredOutputSchema } from "./structured.js";
import type { SupportedModel } from "./provider.js";

export interface CompletionRequest {
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  tools?: Tool[];
  structuredOutput?: StructuredOutputSchema;
  stream?: boolean;
  providerConfig?: Record<string, any>;
}

export interface UsageData {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: SupportedModel;
}

export interface CompletionResponse {
  id: string;
  content: string;
  statusCode: number
  statusReason?: string;
  rawProviderError?: any; /* Kept intentionally untyped */
  toolCalls?: ToolCall[];
  usage: UsageData;
  finishReason: "stop" | "tool_calls" | "length" | "error";
}
