/**
 * Structured output types for schema-validated LLM responses
 */

import type { CompletionResponse } from "./completion.js";

export interface StructuredOutputSchema {
  type: "json_schema" | "typescript";
  schema: Record<string, any> | string;
  strict?: boolean;
}

export interface StructuredOutputResponse extends CompletionResponse {
  parsedOutput: Record<string, any>;
}
