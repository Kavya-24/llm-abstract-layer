/**
 * Tool calling types for LLM function invocation
 */

export interface ParameterSchema {
  type: string;
  description: string;
  enum?: string[];
  items?: ParameterSchema;
  properties?: Record<string, ParameterSchema>;
  required?: string[];
}

export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, ParameterSchema>;
    required: string[];
  };
}
