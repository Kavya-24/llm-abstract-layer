// Main exports
export { LLMClient } from "./llm/client/LLMClient.js";
export { LLMClientBuilder } from "./llm/builder/LLMClientBuilder.js";

// Type exports
export type { CompletionRequest, CompletionResponse } from "./llm/types/completion.js";
export type { Message, ToolCall, ToolResult } from "./llm/types/message.js";
export type { StreamResponse, StreamChunk } from "./llm/types/streaming.js";
export type { StructuredOutputResponse } from "./llm/types/structured.js";
export type { Tool, ParameterSchema } from "./llm/types/tools.js";
export { LLMProvider, OpenAIModel, GeminiModel } from "./llm/types/provider.js";
export type { SupportedModel } from "./llm/types/provider.js";

// Error exports
export { 
  LLMError, 
  ValidationError, 
  AuthenticationError, 
  RateLimitError,
  StreamingError,
  StructuredOutputError
} from "./llm/errors/LLMError.js";
