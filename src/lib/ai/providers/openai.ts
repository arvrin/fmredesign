/**
 * OpenAI LLM Provider
 * Raw fetch against https://api.openai.com/v1/chat/completions
 */

import type { LLMProviderAdapter, LLMMessage, LLMConfig, LLMResponse } from '../types';

export class OpenAIProvider implements LLMProviderAdapter {
  async generate(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
    const body: Record<string, unknown> = {
      model: config.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: config.maxTokens ?? 8192,
    };

    if (config.temperature !== undefined) {
      body.temperature = config.temperature;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      content: choice?.message?.content || '',
      usage: data.usage
        ? { inputTokens: data.usage.prompt_tokens, outputTokens: data.usage.completion_tokens }
        : undefined,
      model: data.model || config.model,
      provider: 'openai',
    };
  }

  async generateJSON<T>(messages: LLMMessage[], config: LLMConfig): Promise<T> {
    const body: Record<string, unknown> = {
      model: config.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: config.maxTokens ?? 8192,
      response_format: { type: 'json_object' },
    };

    if (config.temperature !== undefined) {
      body.temperature = config.temperature;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  }
}
