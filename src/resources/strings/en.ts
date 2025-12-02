const en = {
    // LLM Provider Errors
    LLM_ERROR_MISSING_API_KEY: "API key is required to initialize LLM provider",
    LLM_ERROR_AUTHENTICATION_FAILED: "Authentication failed with ${provider} provider",
    LLM_ERROR_RATE_LIMIT: "Rate limit exceeded for ${provider} provider",
    LLM_ERROR_RETRY_AFTER: "Please retry after ${seconds} seconds",
    LLM_ERROR_VALIDATION_FAILED: "Request validation failed for ${provider}: ${details}",
    LLM_ERROR_CONNECTION_FAILED: "Connection failed to ${provider} provider",
    LLM_ERROR_PROVIDER_ERROR: "Provider error from ${provider} (status: ${status})",
    LLM_ERROR_UNKNOWN: "Unknown error occurred with ${provider} provider. ${message}",
    LLM_ERROR_STREAMING_FAILED: "Streaming failed for ${provider} provider",
    LLM_ERROR_STRUCTURED_OUTPUT_FAILED: "Structured output validation failed for ${provider} provider",
    LLM_MISSING_REQUEST_MESSAGES: "Missinng the input messages",

    // LLM Provider Logging
    LOG_LLM_AUTHENTICATION_ERROR: "LLM Authentication Error",
    LOG_LLM_RATE_LIMIT_ERROR: "LLM Rate Limit Error",
    LOG_LLM_VALIDATION_ERROR: "LLM Validation Error",
    LOG_LLM_STREAMING_ERROR: "LLM Streaming Error",
    LOG_LLM_STRUCTURED_OUTPUT_ERROR: "LLM Structured Output Error",
    LOG_LLM_ERROR: "LLM Error",
} as const;

export default en;