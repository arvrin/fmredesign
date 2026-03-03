/**
 * Anthropic (Claude) LLM Provider
 * Raw fetch against https://api.anthropic.com/v1/messages
 */

import type { LLMProviderAdapter, LLMMessage, LLMConfig, LLMResponse } from '../types';

export class AnthropicProvider implements LLMProviderAdapter {
  async generate(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
    // Anthropic requires system message separate from conversation
    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const body: Record<string, unknown> = {
      model: config.model,
      max_tokens: config.maxTokens ?? 8192,
      messages: conversationMessages,
    };

    if (systemMessage) {
      body.system = systemMessage.content;
    }
    if (config.temperature !== undefined) {
      body.temperature = config.temperature;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');

    return {
      content: textBlock?.text || '',
      usage: data.usage
        ? { inputTokens: data.usage.input_tokens, outputTokens: data.usage.output_tokens }
        : undefined,
      model: data.model || config.model,
      provider: 'anthropic',
    };
  }

  async generateJSON<T>(messages: LLMMessage[], config: LLMConfig): Promise<T> {
    // Append JSON instruction to the last user message
    const augmentedMessages = messages.map((m, i) => {
      if (i === messages.length - 1 && m.role === 'user') {
        return {
          ...m,
          content: m.content + '\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no code fences, no explanation text.',
        };
      }
      return m;
    });

    const response = await this.generate(augmentedMessages, config);
    return parseJSONResponse<T>(response.content);
  }
}

function parseJSONResponse<T>(content: string): T {
  // Strip markdown code fences if present
  let cleaned = content.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  return JSON.parse(cleaned) as T;
}
