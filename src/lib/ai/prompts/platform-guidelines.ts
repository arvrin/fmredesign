/**
 * Platform-Specific Guidelines
 * Character limits, best practices, and format rules per platform
 */

const PLATFORM_GUIDELINES: Record<string, string> = {
  instagram: `### Instagram
- Caption: max 2,200 characters (first 125 visible without "more")
- Hashtags: up to 30 (recommended 15-20, mix of sizes)
- Carousel: up to 10 slides (1080x1080 or 1080x1350)
- Reel: up to 90 seconds (1080x1920 vertical)
- Story: 1080x1920, 15-second segments
- Best times: 11am-1pm, 7pm-9pm IST
- Peak days: Tuesday, Wednesday, Thursday
- Use line breaks for readability
- First line must hook — treat it like a headline`,

  facebook: `### Facebook
- Post: max 63,206 characters (recommended under 250 for engagement)
- Link posts get lower reach — use native media when possible
- Video: native upload gets 10x reach vs YouTube links
- Best times: 1pm-4pm IST
- Peak days: Wednesday, Thursday, Friday
- Questions and polls drive highest engagement
- Tag relevant pages when appropriate`,

  linkedin: `### LinkedIn
- Post: max 3,000 characters
- Article: up to 120,000 characters
- Professional tone required — avoid casual slang
- Best times: 8am-10am, 12pm IST (business hours)
- Peak days: Tuesday, Wednesday, Thursday
- Document/carousel posts get highest engagement
- Use 3-5 relevant hashtags max
- Start with a provocative hook or statistic`,

  twitter: `### Twitter/X
- Tweet: 280 characters
- Thread: multiple tweets for longer content
- Images: up to 4 per tweet
- Best times: 9am-12pm IST
- Use 1-3 hashtags max (more reduces engagement)
- Conversational, punchy tone
- Threads perform well for educational content`,

  youtube: `### YouTube
- Title: max 100 characters (recommended 60-70)
- Description: max 5,000 characters
- Tags: up to 500 characters total
- Thumbnail: 1280x720
- Include timestamps for longer videos
- First 2 lines of description appear in search
- Include CTA in description and end screen`,

  tiktok: `### TikTok
- Video: up to 10 minutes (15-60s performs best)
- Caption: max 2,200 characters
- Hashtags: 3-5 trending + niche mix
- Vertical format only (1080x1920)
- Hook in first 1-3 seconds is critical
- Trending audio boosts discoverability
- Behind-the-scenes and educational content performs well`,

  website: `### Website/Blog
- Title: 50-60 characters for SEO
- Meta description: 150-160 characters
- Content: 1,000-2,500 words for SEO value
- Include internal and external links
- Use headers (H2, H3) for structure
- Include a clear CTA
- Optimize for target keywords`,

  email: `### Email
- Subject line: 30-50 characters (under 40 for mobile)
- Preview text: 40-130 characters
- Body: concise, scannable format
- Single clear CTA
- Personalization improves open rates
- Best send times: 10am, 2pm IST (Tue-Thu)`,
};

export function getPlatformGuidelines(platforms: string[]): string {
  const guides = platforms
    .map((p) => PLATFORM_GUIDELINES[p.toLowerCase()])
    .filter(Boolean);

  if (guides.length === 0) {
    return '## Platform Guidelines\nFollow general social media best practices.';
  }

  return `## Platform Guidelines\n\n${guides.join('\n\n')}`;
}
