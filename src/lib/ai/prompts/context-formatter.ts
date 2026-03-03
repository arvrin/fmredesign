/**
 * Context Formatter
 * Converts ClientContext into structured text for LLM prompts.
 * Empty sections are omitted entirely.
 */

import type { ClientContext } from '../context/types';

export function formatClientContext(context: ClientContext): string {
  const sections: string[] = [];

  // Client Profile
  sections.push(
    `## Client Profile\n` +
      `- **Name**: ${context.clientName}\n` +
      `- **Industry**: ${context.industry}\n` +
      (context.description ? `- **Description**: ${context.description}\n` : '') +
      `- **Company Size**: ${context.companySize}\n` +
      (context.tagline ? `- **Tagline**: ${context.tagline}\n` : '') +
      (context.website ? `- **Website**: ${context.website}\n` : '')
  );

  // Brand Identity
  const brandParts: string[] = [];
  if (context.brandColors?.length) brandParts.push(`- **Colors**: ${context.brandColors.join(', ')}`);
  if (context.brandFonts?.length) brandParts.push(`- **Fonts**: ${context.brandFonts.join(', ')}`);
  if (context.brandGuidelinesUrl) brandParts.push(`- **Guidelines**: ${context.brandGuidelinesUrl}`);
  if (brandParts.length) {
    sections.push(`## Brand Identity\n${brandParts.join('\n')}`);
  }

  // Target Audience
  if (context.targetAudience) {
    const ta = context.targetAudience;
    let block = '## Target Audience\n';
    if (ta.primaryAudience.demographics) block += `- **Demographics**: ${ta.primaryAudience.demographics}\n`;
    if (ta.primaryAudience.platforms?.length) block += `- **Preferred Platforms**: ${ta.primaryAudience.platforms.join(', ')}\n`;
    if (ta.primaryAudience.contentPreferences?.length) block += `- **Content Preferences**: ${ta.primaryAudience.contentPreferences.join(', ')}\n`;
    if (ta.personas?.length) {
      block += `- **Personas**:\n`;
      for (const p of ta.personas) {
        block += `  - ${p.name}: ${p.description}\n`;
      }
    }
    if (ta.painPoints?.length) block += `- **Pain Points**: ${ta.painPoints.join('; ')}\n`;
    sections.push(block);
  }

  // Brand Voice
  if (context.brandVoice) {
    const bv = context.brandVoice;
    let block = '## Brand Voice\n';
    if (bv.personality?.length) block += `- **Personality**: ${bv.personality.join(', ')}\n`;
    if (bv.toneOfVoice.primary) block += `- **Primary Tone**: ${bv.toneOfVoice.primary}\n`;
    if (bv.toneOfVoice.characteristics?.length) block += `- **Characteristics**: ${bv.toneOfVoice.characteristics.join(', ')}\n`;
    if (bv.toneOfVoice.avoidList?.length) block += `- **AVOID**: ${bv.toneOfVoice.avoidList.join(', ')}\n`;
    if (bv.visualStyle.imageStyle?.length) block += `- **Image Style**: ${bv.visualStyle.imageStyle.join(', ')}\n`;
    sections.push(block);
  }

  // Content Pillars
  if (context.contentPillars?.length) {
    let block = '## Content Pillars\n';
    for (const pillar of context.contentPillars) {
      block += `- **${pillar.name}** (${pillar.percentage}%): ${pillar.description}`;
      if (pillar.hashtags?.length) block += ` [Hashtags: ${pillar.hashtags.join(', ')}]`;
      block += '\n';
    }
    sections.push(block);
  }

  // Content Preferences
  if (context.contentPreferences) {
    const cp = context.contentPreferences;
    sections.push(
      `## Content Preferences\n` +
        `- **Platforms**: ${cp.defaultPlatforms.join(', ')}\n` +
        `- **Posts/Week**: ${cp.postsPerWeek}\n` +
        `- **Content Types**: ${cp.preferredContentTypes.join(', ')}\n` +
        `- **Hashtag Strategy**: ${cp.hashtagStrategy}\n` +
        `- **Emojis**: ${cp.includeEmojis ? 'Yes' : 'No'}\n` +
        `- **Caption Length**: ${cp.captionLength}\n` +
        (cp.ctaStyle ? `- **CTA Style**: ${cp.ctaStyle}\n` : '')
    );
  }

  // Social Presence
  if (context.socialAccounts?.length) {
    let block = '## Social Presence\n';
    for (const acc of context.socialAccounts) {
      block += `- ${acc.platform}: @${acc.handle}`;
      if (acc.followers) block += ` (${acc.followers.toLocaleString()} followers)`;
      block += '\n';
    }
    sections.push(block);
  }

  // Recent Content (last 10 for prompt brevity)
  if (context.recentContent?.length) {
    const recent = context.recentContent.slice(0, 10);
    let block = '## Recent Content (for continuity — do NOT repeat these topics)\n';
    for (const item of recent) {
      block += `- [${item.platform}/${item.type}] "${item.title}" (${item.scheduledDate})`;
      if (item.hashtags?.length) block += ` #${item.hashtags.slice(0, 3).join(' #')}`;
      block += '\n';
    }
    sections.push(block);
  }

  // Goals & KPIs
  if (context.goalsAndKPIs) {
    const gk = context.goalsAndKPIs;
    let block = '## Goals & KPIs\n';
    if (gk.businessGoals?.length) block += `- **Business Goals**: ${gk.businessGoals.join('; ')}\n`;
    if (gk.marketingGoals?.length) block += `- **Marketing Goals**: ${gk.marketingGoals.join('; ')}\n`;
    if (gk.kpis?.length) {
      block += '- **KPIs**:\n';
      for (const kpi of gk.kpis) {
        block += `  - ${kpi.metric}: target ${kpi.target}\n`;
      }
    }
    sections.push(block);
  }

  // Active Projects
  if (context.activeProjects?.length) {
    let block = '## Active Projects (align content with these where relevant)\n';
    for (const p of context.activeProjects) {
      block += `- **${p.name}** [${p.status}]: ${p.description}\n`;
    }
    sections.push(block);
  }

  // Competitors
  if (context.competitors?.length) {
    let block = '## Competitors\n';
    for (const c of context.competitors) {
      block += `- ${c.name}`;
      if (c.website) block += ` (${c.website})`;
      if (c.differentiators?.length) block += `: ${c.differentiators.join(', ')}`;
      block += '\n';
    }
    sections.push(block);
  }

  return sections.join('\n');
}
