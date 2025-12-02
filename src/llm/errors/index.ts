export {
  LLMError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  StreamingError,
  StructuredOutputError,
} from "./LLMError.js";

export {
  translateProviderError,
  logLLMError,
  validateApiKey,
} from "./errorUtils.js";
