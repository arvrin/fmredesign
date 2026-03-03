/**
 * Single Post Generator
 * Generates one high-quality post via LLM
 */

import type { ContentType, Platform } from '@/lib/admin/project-types';
import type { LLMMessage } from '../types';
import type { GeneratedContentItem } from '../prompts/output-schema';
import { assembleClientContext } from '../context/assemble';
import { createProvider, getDefaultConfig } from '../providers';
import { buildSystemPrompt } from '../prompts/system-prompt';
import { formatClientContext } from '../prompts/context-formatter';
import { getPlatformGuidelines } from '../prompts/platform-guidelines';
import { getSinglePostOutputSchema } from '../prompts/output-schema';

interface SinglePostOptions {
  platform: Platform;
  type: ContentType;
  topic?: string;
  pillar?: string;
  scheduledDate?: string;
}

export async function generateSinglePost(
  clientId: string,
  options: SinglePostOptions
): Promise<GeneratedContentItem> {
  const context = await assembleClientContext(clientId);
  const config = getDefaultConfig();
  const provider = createProvider(config.provider);

  const systemPrompt = buildSystemPrompt('single');
  const contextBlock = formatClientContext(context);
  const platformGuide = getPlatformGuidelines([options.platform]);
  const outputSchema = getSinglePostOutputSchema();

  const scheduledDate =
    options.scheduledDate || new Date().toISOString().split('T')[0];

  let topicInstruction = '';
  if (options.topic) {
    topicInstruction = `\n## Topic/Brief\n${options.topic}`;
  }

  let pillarInstruction = '';
  if (options.pillar) {
    pillarInstruction = `\n## Content Pillar\nAlign this post with the "${options.pillar}" content pillar.`;
  }

  const userPrompt = `${contextBlock}

${platformGuide}
${topicInstruction}
${pillarInstruction}

## Generation Parameters
- **Platform**: ${options.platform}
- **Content Type**: ${options.type}
- **Scheduled Date**: ${scheduledDate}

## Output Format
${outputSchema}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const result = await provider.generateJSON<GeneratedContentItem>(messages, config);
  return result;
}
