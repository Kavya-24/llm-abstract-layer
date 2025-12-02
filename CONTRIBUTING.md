# Contributing to LLM Abstraction Layer

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Adding a New Provider](#adding-a-new-provider)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/llm-abstract-layer.git
   cd llm-abstract-layer
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/Kavya-24/llm-abstract-layer.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## Development Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- TypeScript knowledge
- Git

### Environment Setup

Create a `.env` file for testing (never commit this):

```bash
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
```

### Build and Run

```bash
# Build the project
npm run build

# Run the example
npm run dev

# Watch mode (if configured)
npm run watch
```

## Project Structure

```
src/
├── llm/
│   ├── base/              # Abstract base classes
│   ├── builder/           # Builder pattern
│   ├── client/            # Main client
│   ├── errors/            # Error handling
│   ├── factory/           # Provider factory
│   ├── providers/         # Provider implementations
│   └── types/             # Type definitions
├── resources/
│   └── strings/           # i18n translations
└── utils/
    └── i18Lib.ts          # Utilities
```

## Coding Standards

### TypeScript Guidelines

1. **Use strict typing** - No `any` types unless absolutely necessary
2. **Null safety** - Use optional chaining and nullish coalescing
3. **Explicit return types** - Always specify function return types
4. **Interface over type** - Prefer interfaces for object shapes
5. **Const assertions** - Use `as const` for literal types

### Code Style

```typescript
// ✅ Good
async function complete(request: CompletionRequest): Promise<CompletionResponse> {
  const messages = this.formatMessages(request.messages);
  
  try {
    const response = await this.client.complete(messages);
    return this.translateResponse(response);
  } catch (error) {
    const llmError = this.handleError(error);
    this.logError(llmError);
    throw llmError;
  }
}

// ❌ Bad
async function complete(request: any): Promise<any> {
  try {
    return await this.client.complete(request.messages);
  } catch (e) {
    throw e;
  }
}
```

### Naming Conventions

- **Classes**: PascalCase (`LLMClient`, `OpenAIProvider`)
- **Interfaces**: PascalCase (`CompletionRequest`, `Message`)
- **Functions/Methods**: camelCase (`complete`, `formatMessages`)
- **Constants**: UPPER_SNAKE_CASE (`LLM_ERROR_MISSING_API_KEY`)
- **Private members**: prefix with underscore if needed (`_internalState`)

### Documentation

- Add JSDoc comments for all public APIs
- Include parameter descriptions
- Document return types
- Add usage examples for complex functions

```typescript
/**
 * Sends a completion request to the LLM provider
 * @param request - The completion request with messages and options
 * @returns A promise resolving to the completion response
 * @throws {ValidationError} If request validation fails
 * @throws {AuthenticationError} If API key is invalid
 * 
 * @example
 * ```typescript
 * const response = await client.complete({
 *   messages: [{ role: "user", content: "Hello" }]
 * });
 * ```
 */
async complete(request: CompletionRequest): Promise<CompletionResponse> {
  // Implementation
}
```

## Adding a New Provider

### Step 1: Create Provider Class

Create a new file in `src/llm/providers/`:

```typescript
// src/llm/providers/AnthropicProvider.ts
import { AbstractLLMProvider } from "../base/AbstractLLMProvider.js";
import { LLMProvider, type SupportedModel } from "../types/provider.js";
import type { CompletionRequest, CompletionResponse } from "../types/completion.js";

export class AnthropicProvider extends AbstractLLMProvider {
  private client: any; // Replace with actual client type

  constructor(apiKey: string, model: SupportedModel, config: Record<string, any> = {}) {
    super(apiKey, model, LLMProvider.ANTHROPIC, config);
    // Initialize client
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    this.logRequest(request);
    const messages = this.formatMessages(request.messages);
    
    try {
      const response = await this.client.complete(messages);
      return this.translateResponse(response);
    } catch (e: any) {
      const error = this.handleError(e);
      this.logError(error);
      throw error;
    }
  }

  // Implement other abstract methods
  async stream(request: CompletionRequest): Promise<StreamResponse> {
    throw new LLMError("Not implemented", this.provider);
  }

  async completeWithStructuredOutput(request: CompletionRequest): Promise<StructuredOutputResponse> {
    throw new LLMError("Not implemented", this.provider);
  }

  async completeWithToolInvocation(request: CompletionRequest): Promise<CompletionResponse> {
    throw new LLMError("Not implemented", this.provider);
  }

  protected formatMessages(messages: Message[]): any[] {
    this.validateRequestMessageExistence(messages);
    // Format messages for provider
    return messages;
  }

  protected translateResponse(providerResponse: any): CompletionResponse {
    return {
      id: providerResponse.id ?? "unknown",
      content: providerResponse.content ?? "",
      usage: this.extractUsageMetrics(providerResponse),
      finishReason: "stop",
      toolCalls: []
    };
  }

  protected extractUsageMetrics(providerResponse: any): UsageData {
    return {
      promptTokens: providerResponse.usage?.input_tokens ?? 0,
      completionTokens: providerResponse.usage?.output_tokens ?? 0,
      totalTokens: (providerResponse.usage?.input_tokens ?? 0) + (providerResponse.usage?.output_tokens ?? 0),
      model: this.model
    };
  }
}
```

### Step 2: Update Provider Enum

Add to `src/llm/types/provider.ts`:

```typescript
export enum LLMProvider {
  OPENAI = "openai",
  GEMINI = "gemini",
  ANTHROPIC = "anthropic", // Add new provider
}

export enum AnthropicModel {
  CLAUDE_3_OPUS = "claude-3-opus-20240229",
  CLAUDE_3_SONNET = "claude-3-sonnet-20240229",
  CLAUDE_3_HAIKU = "claude-3-haiku-20240307",
}

export type SupportedModel = OpenAIModel | GeminiModel | AnthropicModel | string;
```

### Step 3: Update Factory

Add to `src/llm/factory/LLMClientFactory.ts`:

```typescript
import { AnthropicProvider } from "../providers/AnthropicProvider.js";

// In createProvider method:
case LLMProvider.ANTHROPIC:
  return new AnthropicProvider(apiKey, model, config);
```

### Step 4: Export Provider

Add to `src/llm/providers/index.ts`:

```typescript
export { AnthropicProvider } from "./AnthropicProvider.js";
```

### Step 5: Add i18n Strings

Update `src/resources/strings/en.ts` and `es.ts` with provider-specific error messages if needed.

### Step 6: Test Your Provider

Create a test file or update `src/app.ts`:

```typescript
const client = LLMClient.builder()
  .setProvider(LLMProvider.ANTHROPIC)
  .setModel(AnthropicModel.CLAUDE_3_SONNET)
  .setApiKey(process.env.ANTHROPIC_API_KEY)
  .build();

const response = await client.complete({
  messages: [{ role: "user", content: "Hello!" }]
});
```

## Testing

### Manual Testing

1. Set environment variables
2. Run the example:
   ```bash
   npm run dev
   ```

### Unit Tests (Future)

When adding tests:
- Place test files next to source files with `.test.ts` extension
- Use descriptive test names
- Test both success and error cases
- Mock external API calls

```typescript
// Example test structure
describe('OpenAIProvider', () => {
  it('should complete a request successfully', async () => {
    // Test implementation
  });

  it('should handle authentication errors', async () => {
    // Test implementation
  });
});
```

## Submitting Changes

### Commit Messages

Follow conventional commits:

```
feat: add Anthropic provider support
fix: correct null handling in GeminiProvider
docs: update README with streaming examples
refactor: simplify error translation logic
test: add unit tests for LLMClientBuilder
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Pull Request Process

1. **Create a branch**:
   ```bash
   git checkout -b feat/add-anthropic-provider
   ```

2. **Make your changes**:
   - Write clean, documented code
   - Follow coding standards
   - Update documentation

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add Anthropic provider support"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feat/add-anthropic-provider
   ```

5. **Create Pull Request**:
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link related issues
   - Request review

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All TypeScript errors resolved
- [ ] Documentation updated
- [ ] i18n strings added if needed
- [ ] Examples updated if needed
- [ ] Commit messages follow convention
- [ ] PR description is clear and complete

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (Node version, OS, etc.)
- Error messages and stack traces
- Code samples if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use cases and benefits
- Proposed API or implementation approach
- Examples of how it would be used

### Security Issues

For security vulnerabilities:
- **Do not** open a public issue
- Email the maintainers directly
- Provide detailed information
- Allow time for a fix before disclosure

## Code Review Guidelines

### For Contributors

- Be open to feedback
- Respond to review comments promptly
- Make requested changes or discuss alternatives
- Keep PRs focused and reasonably sized

### For Reviewers

- Be constructive and respectful
- Explain the reasoning behind suggestions
- Approve when standards are met
- Help contributors improve

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Questions?

- Open a discussion on GitHub
- Check existing issues and PRs
- Review the README and documentation

Thank you for contributing! 🎉
