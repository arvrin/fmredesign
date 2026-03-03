/**
 * Calendar Content Generator
 * Generates monthly or weekly content calendars via LLM
 */

import type { Platform } from '@/lib/admin/project-types';
import type { LLMMessage } from '../types';
import type { GeneratedCalendar } from '../prompts/output-schema';
import { assembleClientContext } from '../context/assemble';
import { createProvider, getDefaultConfig } from '../providers';
import { buildSystemPrompt } from '../prompts/system-prompt';
import { formatClientContext } from '../prompts/context-formatter';
import { getPlatformGuidelines } from '../prompts/platform-guidelines';
import { getCalendarOutputSchema } from '../prompts/output-schema';
import { getEventsForDateRange } from '../data/holidays';

interface CalendarOptions {
  mode: 'monthly' | 'weekly';
  startDate: string;
  endDate?: string;
  platforms?: Platform[];
  postsPerWeek?: number;
}

export async function generateCalendar(
  clientId: string,
  options: CalendarOptions
): Promise<GeneratedCalendar> {
  const context = await assembleClientContext(clientId);
  const config = getDefaultConfig();
  const provider = createProvider(config.provider);

  // Resolve date range
  const start = options.startDate;
  const endDefault = new Date(start);
  endDefault.setDate(endDefault.getDate() + (options.mode === 'monthly' ? 30 : 7));
  const end = options.endDate || endDefault.toISOString().split('T')[0];

  // Determine platforms and posting frequency
  const platforms =
    options.platforms ||
    (context.contentPreferences?.defaultPlatforms as Platform[]) ||
    ['instagram'];
  const postsPerWeek =
    options.postsPerWeek || context.contentPreferences?.postsPerWeek || 5;

  // Calculate target post count
  const daysDiff = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeks = Math.max(1, daysDiff / 7);
  const targetPosts = Math.round(postsPerWeek * weeks);

  // Get events in range
  const eventsInRange = getEventsForDateRange(
    start,
    end,
    context.industry,
    context.contentEvents
  );

  const systemPrompt = buildSystemPrompt(options.mode);
  const contextBlock = formatClientContext(context);
  const platformGuide = getPlatformGuidelines(platforms);
  const outputSchema = getCalendarOutputSchema();

  const eventsBlock =
    eventsInRange.length > 0
      ? eventsInRange
          .map(
            (e) =>
              `- ${e.date}: ${e.name} (${e.type})${e.notes ? ` — ${e.notes}` : ''}`
          )
          .join('\n')
      : 'None';

  const userPrompt = `${contextBlock}

${platformGuide}

## Generation Parameters
- **Date Range**: ${start} to ${end} (${daysDiff} days)
- **Target Posts**: ${targetPosts} posts across ${platforms.join(', ')}
- **Posts Per Week**: ${postsPerWeek}

## Events in This Period
${eventsBlock}

## Output Format
${outputSchema}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const result = await provider.generateJSON<GeneratedCalendar>(messages, config);
  return result;
}
