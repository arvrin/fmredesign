/**
 * LLM Provider Factory
 * Creates provider adapters and reads default config from env vars
 */

import type { LLMProvider, LLMProviderAdapter, LLMConfig } from '../types';
import { AnthropicProvider } from './anthropic';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  gemini: 'gemini-2.0-flash',
  openai: 'gpt-4o',
};

const providers: Record<LLMProvider, LLMProviderAdapter> = {
  anthropic: new AnthropicProvider(),
  gemini: new GeminiProvider(),
  openai: new OpenAIProvider(),
};

export function createProvider(provider: LLMProvider): LLMProviderAdapter {
  const adapter = providers[provider];
  if (!adapter) {
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }
  return adapter;
}

export function getDefaultConfig(): LLMConfig {
  const provider = (process.env.AI_PROVIDER || 'anthropic') as LLMProvider;

  const providerKeyMap: Record<LLMProvider, string> = {
    anthropic: 'ANTHROPIC_API_KEY',
    gemini: 'GEMINI_API_KEY',
    openai: 'OPENAI_API_KEY',
  };

  const apiKey = process.env.AI_API_KEY || process.env[providerKeyMap[provider]] || '';

  if (!apiKey) {
    throw new Error(
      `No API key configured for provider "${provider}". Set AI_API_KEY or ${providerKeyMap[provider]} in your environment.`
    );
  }

  return {
    provider,
    model: process.env.AI_MODEL || DEFAULT_MODELS[provider],
    apiKey,
    temperature: 0.7,
    maxTokens: 8192,
  };
}
