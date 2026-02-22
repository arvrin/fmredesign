# n8n Content Generation Workflows

Two n8n workflows that auto-generate draft social media content for FreakingMinds clients using Google Gemini AI.

## Workflows

### 1. Monthly Content Calendar Auto-Fill
**File:** `monthly-content-autofill.json`

Generates 16 posts per month per active client with a balanced content mix:
- 4 educational posts (tips, how-tos, industry insights)
- 4 promotional posts (services, offers, case studies)
- 2 behind-the-scenes reels
- 2 testimonial/social-proof carousels
- 2 trend/news posts
- 2 engagement stories

**Triggers:**
- **Scheduled:** 1st of every month at 9:00 AM
- **Webhook:** `POST /webhook/generate-monthly-content` with optional `{ "client_id": "..." }`

### 2. Holiday & Event Post Generator
**File:** `holiday-post-generator.json`

Checks for Indian holidays and global events in the next 14 days. Creates one tailored post per client per holiday.

Covers 35+ holidays/events: Republic Day, Independence Day, Diwali, Holi, Navratri, Dussehra, Women's Day, Earth Day, Valentine's Day, Black Friday, and more.

**Triggers:**
- **Scheduled:** Every Monday at 10:00 AM
- **Webhook:** `POST /webhook/generate-holiday-content`

## Setup Instructions

### Prerequisites
- [n8n Cloud account](https://n8n.io) (or self-hosted n8n)
- [Google AI Studio](https://aistudio.google.com/) API key (free tier — Gemini 2.0 Flash)
- Supabase project URL and service role key

### Step 1: Get a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key — free tier gives 15 requests/minute

### Step 2: Import Workflows into n8n
1. Open your n8n instance
2. Go to **Workflows** > **Import from File**
3. Import `monthly-content-autofill.json`
4. Import `holiday-post-generator.json`

### Step 3: Set Environment Variables in n8n
Go to **Settings** > **Variables** and add:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `GEMINI_API_KEY` | Your Google AI Studio API key |

### Step 4: Configure HTTP Header Auth Credential
1. Go to **Credentials** > **New**
2. Select **Header Auth**
3. Name: `Supabase API Key`
4. Header Name: `apikey`
5. Header Value: Your `SUPABASE_SERVICE_ROLE_KEY`
6. Save and assign to all Supabase HTTP Request nodes

### Step 5: Activate Workflows
1. Open each workflow
2. Click **Active** toggle (top right)
3. Note the webhook URLs displayed on the Webhook Trigger nodes

### Step 6: Add Webhook URLs to FreakingMinds
Add these to your `.env.local`:
```
N8N_WEBHOOK_MONTHLY_CONTENT=https://your-n8n-instance.app.n8n.cloud/webhook/generate-monthly-content
N8N_WEBHOOK_HOLIDAY_CONTENT=https://your-n8n-instance.app.n8n.cloud/webhook/generate-holiday-content
```

## How It Works

1. **Trigger** — Cron schedule or admin dashboard button fires the webhook
2. **Fetch clients** — Gets all active clients from Supabase
3. **Fetch context** — Reads each client's discovery session (brand voice, audience, services)
4. **Check duplicates** — Skips dates that already have content
5. **Generate** — Calls Gemini 2.0 Flash with structured prompts + JSON response mode
6. **Rate limit** — 4-second wait between API calls (stays within 15 RPM free tier)
7. **Insert** — Writes drafts to `content_calendar` with `status: 'draft'` and `ai_generated: true`

All generated content appears in the admin dashboard as drafts for human review and editing.

## Rate Limits

- **Gemini free tier:** 15 requests/minute, 1500/day
- **Workflow rate limiting:** 4-second wait between Gemini calls
- **Estimated usage per run:** ~1 call per client (monthly) or ~1 call per client-holiday combo

## Troubleshooting

**Workflow fails at Gemini API call:**
- Check that `GEMINI_API_KEY` is set correctly in n8n variables
- Verify you haven't exceeded the free tier daily limit (1500 requests)

**No content appears in dashboard:**
- Check Supabase `content_calendar` table directly
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check n8n execution logs for errors

**Content duplicates:**
- Both workflows check for existing content on the same date before inserting
- The `ai_generation_batch_id` column tracks which batch generated each post
