/**
 * LLM Provider Abstraction Types
 * Shared types for multi-provider AI content generation
 */

export type LLMProvider = 'anthropic' | 'gemini' | 'openai';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: { inputTokens: number; outputTokens: number };
  model: string;
  provider: LLMProvider;
}

export interface LLMProviderAdapter {
  generate(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse>;
  generateJSON<T>(messages: LLMMessage[], config: LLMConfig): Promise<T>;
}
