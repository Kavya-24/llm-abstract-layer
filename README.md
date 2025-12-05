# LLM Abstraction Layer

A TypeScript-based abstraction layer for Large Language Model (LLM) providers, providing a unified interface for interacting with multiple LLM services like OpenAI and Google Gemini.


Published ▶️ [https://www.npmjs.com/package/llm-abstract-layer](https://www.npmjs.com/package/llm-abstraction-layer)

## Features

- **Unified API**: Single interface for multiple LLM providers
- **Type-Safe**: Full TypeScript support with strict type checking
- **Builder Pattern**: Fluent API for easy client configuration
- **Error Handling**: Comprehensive error types and translation
- **Internationalization**: Built-in i18n support (English, Spanish)
- **Extensible**: Easy to add new providers
- **Streaming Support**: Ready for streaming responses (implementation in progress)
- **Tool Calling**: Support for function calling (implementation in progress)
- **Structured Output**: Schema-validated responses (implementation in progress)

## Installation

```bash
npm install llm-abstract-layer
```

Or with yarn:

```bash
yarn add llm-abstract-layer
```

### Peer Dependencies

This package requires the following peer dependencies:

- `openai`: ^6.9.1 (for OpenAI provider)
- `@google/genai`: ^1.30.0 (for Gemini provider)

Install them based on which providers you plan to use:

```bash
# For OpenAI
npm install openai

# For Gemini
npm install @google/genai

# For both
npm install openai @google/genai
```

## Quick Start

```typescript
import { LLMClient, LLMProvider, GeminiModel } from "llm-abstract-layer";

// Set your API key as environment variable
const apiKey = process.env.GEMINI_API_KEY;

// Build the client
const llmClient = LLMClient.builder()
  .setProvider(LLMProvider.GEMINI)
  .setModel(GeminiModel.GEMINI_2_FLASH_LITE)
  .setApiKey(apiKey)
  .build();

// Make a completion request
const response = await llmClient.complete({
  messages: [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "What is TypeScript?" }
  ],
  temperature: 0.7,
  max_tokens: 1024
});

console.log(response.content);
```

## Core Components

### 1. LLMClient

The main entry point for interacting with LLM providers.

**Methods:**
- `complete(request)`: Send a completion request
- `stream(request)`: Send a streaming request (coming soon)
- `structuredOutput(request)`: Get schema-validated output (coming soon)
- `callTools(request)`: Invoke tools/functions (coming soon)
- `builder()`: Create a new client builder

### 2. LLMClientBuilder

Fluent builder for configuring LLM clients.

```typescript
const client = LLMClient.builder()
  .setProvider(LLMProvider.OPENAI)
  .setModel(OpenAIModel.GPT_4o_mini)
  .setApiKey(process.env.OPENAI_API_KEY)
  .setConfig({ /* provider-specific options */ })
  .build();
```

### 3. AbstractLLMProvider

Base class for all provider implementations. Handles:
- Request validation
- Message formatting
- Response translation
- Error handling
- Logging

### 4. Provider Implementations

#### OpenAIProvider
Implements OpenAI API integration.

**Supported Models:**
- `GPT_4o_mini`
- `GPT_4`
- `GPT_4_TURBO`
- `GPT_35_TURBO`

#### GeminiProvider
Implements Google Gemini API integration.

**Supported Models:**
- `GEMINI_PRO`
- `GEMINI_PRO_VISION`
- `GEMINI_2_FLASH`
- `GEMINI_2_FLASH_LITE`

### 5. Type System

#### CompletionRequest
```typescript
interface CompletionRequest {
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  tools?: Tool[];
  structuredOutput?: StructuredOutputSchema;
  stream?: boolean;
  providerConfig?: Record<string, any>;
}
```

#### CompletionResponse
```typescript
interface CompletionResponse {
  id: string;
  content: string;
  toolCalls?: ToolCall[];
  usage: UsageData;
  finishReason: "stop" | "tool_calls" | "length" | "error";
}
```

#### Message
```typescript
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}
```

### 6. Error Handling

The library provides specialized error types:

- `LLMError`: Base error class
- `AuthenticationError`: API key or auth failures
- `RateLimitError`: Rate limiting with retry information
- `ValidationError`: Request validation failures
- `StreamingError`: Streaming-related errors
- `StructuredOutputError`: Schema validation errors

```typescript
try {
  const response = await llmClient.complete(request);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter}s`);
  }
}
```

### 7. Internationalization

Built-in support for multiple languages using the i18n system.

**Supported Languages:**
- English (en)
- Spanish (es)

## Architecture

```
src/
├── llm/
│   ├── base/              # Abstract base classes
│   │   └── AbstractLLMProvider.ts
│   ├── builder/           # Builder pattern implementation
│   │   └── LLMClientBuilder.ts
│   ├── client/            # Main client interface
│   │   └── LLMClient.ts
│   ├── errors/            # Error types and utilities
│   │   ├── LLMError.ts
│   │   └── errorUtils.ts
│   ├── factory/           # Provider factory
│   │   └── LLMClientFactory.ts
│   ├── providers/         # Provider implementations
│   │   ├── OpenAIProvider.ts
│   │   └── GeminiProvider.ts
│   └── types/             # TypeScript type definitions
│       ├── completion.ts
│       ├── message.ts
│       ├── provider.ts
│       ├── streaming.ts
│       ├── structured.ts
│       └── tools.ts
├── resources/
│   └── strings/           # i18n translations
│       ├── en.ts
│       └── es.ts
└── utils/
    └── i18Lib.ts          # i18n utilities
```

## Examples

### Basic Completion

```typescript
const response = await llmClient.complete({
  messages: [
    { role: "user", content: "Explain quantum computing" }
  ],
  temperature: 0.7,
  max_tokens: 500
});
```

### With System Prompt

```typescript
const response = await llmClient.complete({
  messages: [
    { role: "system", content: "You are a Python expert" },
    { role: "user", content: "How do I use list comprehensions?" }
  ]
});
```

### Multiple Providers

```typescript
import { LLMClient, LLMProvider, OpenAIModel, GeminiModel } from "llm-abstract-layer";

// OpenAI
const openaiClient = LLMClient.builder()
  .setProvider(LLMProvider.OPENAI)
  .setModel(OpenAIModel.GPT_4o_mini)
  .setApiKey(process.env.OPENAI_API_KEY)
  .build();

// Gemini
const geminiClient = LLMClient.builder()
  .setProvider(LLMProvider.GEMINI)
  .setModel(GeminiModel.GEMINI_2_FLASH)
  .setApiKey(process.env.GEMINI_API_KEY)
  .build();
```

### Error Handling

```typescript
import { LLMError, AuthenticationError, RateLimitError } from "llm-abstract-layer";

try {
  const response = await llmClient.complete(request);
  console.log(response.content);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter}s`);
  } else if (error instanceof LLMError) {
    console.error(`Provider: ${error.provider}`);
    console.error(`Retryable: ${error.retryable}`);
    console.error(`Message: ${error.message}`);
  }
}
```

## Configuration

### Environment Variables

Set API keys as environment variables for security:

```bash
export OPENAI_API_KEY="your-openai-key"
export GEMINI_API_KEY="your-gemini-key"
```

### Provider-Specific Configuration

```typescript
const client = LLMClient.builder()
  .setProvider(LLMProvider.OPENAI)
  .setModel(OpenAIModel.GPT_4)
  .setApiKey(apiKey)
  .setConfig({
    clientOptions: {
      timeout: 30000,
      maxRetries: 3
    }
  })
  .build();
```

## Security Best Practices

1. **Never hardcode API keys** - Use environment variables
2. **Validate input** - All requests are validated before sending
3. **Handle errors properly** - Use typed error handling
4. **Use TypeScript strict mode** - Enabled by default
5. **Sanitize user input** - Validate message content before sending

## Development

### Build

```bash
npm run build
```

### Run

```bash
npm run dev
```

### Type Checking

The project uses strict TypeScript configuration:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

## Roadmap

- [ ] Streaming support implementation
- [ ] Tool/function calling implementation
- [ ] Structured output with schema validation
- [ ] Additional providers (Anthropic, Cohere, etc.)
- [ ] Retry logic with exponential backoff
- [ ] Request/response caching
- [ ] Token counting utilities
- [ ] Conversation history management
- [ ] Rate limiting helpers

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

ISC

## Support

For issues and questions:
- GitHub Issues: https://github.com/Kavya-24/llm-abstract-layer/issues
- Documentation: This README

## Acknowledgments

Built with TypeScript and designed for production use in LLM-powered applications.
