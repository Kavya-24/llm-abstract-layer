/**
 * Streaming response types for real-time LLM communication
 */

import type { ToolCall } from "./message.js";
import type { CompletionResponse, UsageData } from "./completion.js";

export interface StreamChunk {
  type: "content" | "tool_call" | "usage" | "finish";
  data: string | ToolCall | UsageData | FinishData;
  timestamp: number;
}

export interface FinishData {
  finishReason: "stop" | "tool_calls" | "length" | "error";
}

export interface StreamResponse {
  [Symbol.asyncIterator](): AsyncIterator<StreamChunk>;
  getComplete(): Promise<CompletionResponse>;
}
