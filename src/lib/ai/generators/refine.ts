/**
 * Content Refinement Generator
 * Refines/rewrites existing content based on user instructions
 */

import type { LLMMessage } from '../types';
import type { GeneratedContentItem } from '../prompts/output-schema';
import { assembleClientContext } from '../context/assemble';
import { createProvider, getDefaultConfig } from '../providers';
import { formatClientContext } from '../prompts/context-formatter';
import { getSinglePostOutputSchema } from '../prompts/output-schema';

interface ExistingContent {
  title: string;
  content: string;
  platform: string;
  type: string;
}

export async function refineContent(
  clientId: string,
  existingContent: ExistingContent,
  instruction: string
): Promise<GeneratedContentItem> {
  const context = await assembleClientContext(clientId);
  const config = getDefaultConfig();
  const provider = createProvider(config.provider);

  const contextBlock = formatClientContext(context);
  const outputSchema = getSinglePostOutputSchema();

  const systemPrompt = `You are an expert social media content editor. You refine and improve existing social media content while maintaining brand consistency. You follow instructions precisely.`;

  const userPrompt = `${contextBlock}

## Existing Content to Refine
- **Title**: ${existingContent.title}
- **Platform**: ${existingContent.platform}
- **Type**: ${existingContent.type}
- **Current Caption**:
${existingContent.content}

## Refinement Instruction
${instruction}

## Important
- Maintain the brand voice and tone from the client profile
- Keep the same platform and content type
- Apply the refinement instruction while preserving what already works
- Return the COMPLETE refined post (not just the changes)

## Output Format
${outputSchema}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const result = await provider.generateJSON<GeneratedContentItem>(messages, config);
  return result;
}
