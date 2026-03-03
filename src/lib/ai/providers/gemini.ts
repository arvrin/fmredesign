/**
 * Google Gemini LLM Provider
 * Raw fetch against generativelanguage.googleapis.com
 */

import type { LLMProviderAdapter, LLMMessage, LLMConfig, LLMResponse } from '../types';

export class GeminiProvider implements LLMProviderAdapter {
  async generate(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
    const { contents, systemInstruction } = toGeminiFormat(messages);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: config.maxTokens ?? 8192,
        temperature: config.temperature ?? 0.7,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || '';

    return {
      content: text,
      usage: data.usageMetadata
        ? {
            inputTokens: data.usageMetadata.promptTokenCount || 0,
            outputTokens: data.usageMetadata.candidatesTokenCount || 0,
          }
        : undefined,
      model: config.model,
      provider: 'gemini',
    };
  }

  async generateJSON<T>(messages: LLMMessage[], config: LLMConfig): Promise<T> {
    const { contents, systemInstruction } = toGeminiFormat(messages);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: config.maxTokens ?? 8192,
        temperature: config.temperature ?? 0.7,
        responseMimeType: 'application/json',
      },
    };

    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(text) as T;
  }
}

function toGeminiFormat(messages: LLMMessage[]) {
  let systemInstruction: string | undefined;
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemInstruction = msg.content;
      continue;
    }
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  return { contents, systemInstruction };
}
