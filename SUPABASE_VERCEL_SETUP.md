# Supabase + Vercel Integration Setup Guide
## Deploy Supabase Directly from Vercel Dashboard

---

## Option 1: Vercel Marketplace Integration (EASIEST - Recommended)

This is the fastest way to get started. Vercel and Supabase have a native integration.

### Step 1: Create Supabase Project via Vercel

1. **Go to your Vercel project dashboard**:
   ```
   https://vercel.com/aaryavars-projects/fmredesign
   ```

2. **Click on "Storage" tab** (or "Integrations")

3. **Find "Supabase" in the marketplace**
   - Click "Add Integration"
   - Or visit: https://vercel.com/integrations/supabase

4. **Click "Add Integration"**
   - Select your project: `fmredesign`
   - Click "Continue"

5. **Supabase will automatically**:
   - Create a new Supabase project for you
   - Generate database credentials
   - Add environment variables to Vercel automatically
   - Set up connection pooling

6. **Environment variables are added automatically**:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   DATABASE_URL (PostgreSQL connection string)
   ```

### Step 2: Access Your Supabase Dashboard

After integration:
1. You'll get a link to your Supabase project dashboard
2. Or go to: https://supabase.com/dashboard
3. Sign in with the account you used during integration

### Step 3: Set Up Database Schema

1. **In Supabase Dashboard**, go to "SQL Editor"

2. **Create a new query** and paste the SQL from our migration plan:

```sql
-- Create clients table
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'India',
  gst_number TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'enterprise')),
  website TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused', 'churned')),
  health TEXT DEFAULT 'good' CHECK (health IN ('excellent', 'good', 'warning', 'critical')),
  account_manager TEXT,
  contract_type TEXT CHECK (contract_type IN ('retainer', 'project', 'performance', 'hybrid')),
  contract_value DECIMAL(12, 2),
  contract_start_date DATE,
  contract_end_date DATE,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'quarterly', 'annually', 'one_time')),
  services TEXT[],
  tags TEXT[],
  total_value DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- Create invoices table
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  line_items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(date DESC);

-- Create authorized_users table
CREATE TABLE authorized_users (
  id TEXT PRIMARY KEY,
  mobile_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'team_member')),
  permissions TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  notes TEXT
);

CREATE INDEX idx_authorized_users_mobile ON authorized_users(mobile_number);
CREATE INDEX idx_authorized_users_role ON authorized_users(role);

-- Create campaigns table
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('social_media', 'paid_ads', 'seo', 'content_marketing', 'email', 'web_development', 'branding', 'consulting')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  spent DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Create leads table
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  website TEXT,
  job_title TEXT,
  company_size TEXT,
  industry TEXT,
  project_type TEXT,
  project_description TEXT,
  budget_range TEXT,
  timeline TEXT,
  primary_challenge TEXT,
  additional_challenges TEXT,
  specific_requirements TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'nurturing')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  source TEXT,
  lead_score INTEGER DEFAULT 0,
  assigned_to TEXT,
  next_action TEXT,
  follow_up_date DATE,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

3. **Click "Run"** to execute the SQL

4. **Verify tables created**: Go to "Table Editor" and you should see all 5 tables

---

## Option 2: Manual Supabase Setup (If you prefer)

### Step 1: Create Supabase Project Manually

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: `freakingminds-db`
   - **Database Password**: (generate strong password - save it!)
   - **Region**: Choose closest to your users (e.g., Mumbai for India)
   - **Plan**: Start with Free tier
6. Wait 2-3 minutes for project to be created

### Step 2: Get Your Credentials

In Supabase Dashboard:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (another long string)

### Step 3: Add to Vercel Environment Variables

Using Vercel CLI:
```bash
# Add Supabase URL
echo "https://your-project.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Add Supabase Anon Key
echo "your-anon-key-here" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Add Supabase Service Role Key (NEVER expose this!)
echo "your-service-role-key-here" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Or via Vercel Dashboard:
1. Go to https://vercel.com/aaryavars-projects/fmredesign/settings/environment-variables
2. Click "Add New"
3. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environments: Production, Preview, Development
4. Repeat for other variables

### Step 4: Set Up Database Schema

Same as Option 1, Step 3 above.

---

## Next Steps After Setup

### 1. Install Supabase Client in Your Project

```bash
npm install @supabase/supabase-js
```

### 2. Add DATABASE_PROVIDER Environment Variable

```bash
# For now, keep using Google Sheets
echo "google-sheets" | vercel env add DATABASE_PROVIDER production

# Also add to local .env.local
echo "DATABASE_PROVIDER=google-sheets" >> .env.local
```

### 3. Verify Connection Works

Create a test file to verify Supabase connection:

**File: `scripts/test-supabase-connection.js`**
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');

  // Test 1: Check if we can query clients table
  const { data, error } = await supabase
    .from('clients')
    .select('count');

  if (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }

  console.log('✅ Connected to Supabase successfully!');
  console.log(`📊 Clients table exists (${data.length} rows)`);

  return true;
}

testConnection()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
```

Run it locally:
```bash
node scripts/test-supabase-connection.js
```

---

## Recommended Setup Flow

Here's the exact order I recommend:

### Phase 1: Setup (Today)
1. ✅ Use **Option 1** (Vercel Marketplace) - it's the easiest
2. ✅ Create database schema via SQL Editor
3. ✅ Install `@supabase/supabase-js` package
4. ✅ Test connection locally
5. ✅ Keep `DATABASE_PROVIDER=google-sheets` (no changes yet)

### Phase 2: Code Implementation (Next 1-2 days)
1. Create abstraction layer (from migration plan)
2. Implement Supabase adapter
3. Test locally with `DATABASE_PROVIDER=supabase`
4. Verify all CRUD operations work

### Phase 3: Data Migration (1 day)
1. Run migration script to copy Google Sheets → Supabase
2. Verify data integrity
3. Test with real production data in Supabase

### Phase 4: Dual-Write Mode (1 week)
1. Deploy with `DATABASE_PROVIDER=dual-write`
2. Monitor both databases stay in sync
3. Verify no errors in production

### Phase 5: Switch to Supabase (Final)
1. Change to `DATABASE_PROVIDER=supabase`
2. Monitor performance and errors
3. After 1 week of stability, remove Google Sheets code

---

## Cost Breakdown

### Supabase Free Tier (Sufficient to Start)
- ✅ 500MB database storage
- ✅ 2GB bandwidth per month
- ✅ 50,000 monthly active users
- ✅ 500MB file storage
- ✅ Automatic backups (7 days)

Your current data size estimate:
- 8 authorized users
- 7 clients
- ~20 invoices
- Total: **< 5MB** (well within free tier!)

### When to Upgrade to Pro ($25/month)
- 8GB database storage
- 250GB bandwidth
- 100GB file storage
- Point-in-time recovery
- Daily backups (30 days)

You won't need Pro for several months at your current scale.

---

## Monitoring & Safety

### Vercel Integration Benefits
1. **Automatic environment variables**: No manual copying
2. **Connection pooling**: Better performance
3. **Edge Functions ready**: For future features
4. **Monitoring integration**: See database metrics in Vercel

### Safety Features
- **Automatic backups**: Supabase backs up daily
- **Point-in-time recovery**: Can restore to any moment (Pro plan)
- **Google Sheets stays as backup**: During dual-write phase
- **Instant rollback**: Change one env var to switch back

---

## Quick Command Reference

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Test connection
node scripts/test-supabase-connection.js

# Add environment variables (if doing manual setup)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Switch database provider
vercel env add DATABASE_PROVIDER production
# Options: google-sheets, dual-write, supabase

# Deploy changes
vercel --prod

# Rollback if needed
vercel rollback
```

---

## What Happens Next?

After you complete the setup:

1. I'll help you implement the abstraction layer
2. We'll create the Supabase adapter
3. Test locally first
4. Deploy to production with dual-write
5. Gradually switch to full Supabase

**Total time commitment**:
- Setup: 30 minutes (today)
- Implementation: 2-3 hours (over a few days)
- Testing & Migration: 1-2 weeks (gradual, safe rollout)

---

**Ready to start?** Let me know which option you want to use (I recommend Option 1 - Vercel Marketplace), and I'll guide you through each step!

---

**Last Updated**: 2025-10-14
**Status**: Ready to Execute
