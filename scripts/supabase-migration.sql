-- =============================================================
-- FreakingMinds: Full Google Sheets → Supabase Migration
-- Run in Supabase SQL Editor
-- Existing tables (clients, projects, client_sessions, content_calendar) are UNTOUCHED
-- =============================================================

-- Auto-update trigger function (shared by all tables)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- 1. LEADS
-- =============================================================
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  website TEXT,
  job_title TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small_business', 'medium_business', 'enterprise', 'agency', 'nonprofit', 'individual')),
  industry TEXT,
  project_type TEXT CHECK (project_type IN ('website_design', 'ecommerce', 'mobile_app', 'web_app', 'branding', 'digital_marketing', 'full_service', 'consultation', 'maintenance', 'other')),
  project_description TEXT NOT NULL,
  budget_range TEXT CHECK (budget_range IN ('under_10k', '10k_25k', '25k_50k', '50k_100k', '100k_250k', 'over_250k', 'not_disclosed')),
  timeline TEXT CHECK (timeline IN ('asap', '1_month', '2_3_months', '3_6_months', '6_months_plus', 'flexible')),
  primary_challenge TEXT NOT NULL,
  additional_challenges JSONB DEFAULT '[]',
  specific_requirements TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'discovery_scheduled', 'discovery_completed', 'proposal_sent', 'negotiating', 'won', 'lost', 'archived')),
  priority TEXT DEFAULT 'cool' CHECK (priority IN ('hot', 'warm', 'cool', 'cold')),
  source TEXT DEFAULT 'website_form' CHECK (source IN ('website_form', 'referral', 'social_media', 'google_ads', 'cold_outreach', 'event', 'partner', 'other')),
  lead_score INTEGER DEFAULT 0,
  assigned_to TEXT,
  next_action TEXT,
  follow_up_date TIMESTAMPTZ,
  last_contact_date TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  discovery_scheduled BOOLEAN DEFAULT FALSE,
  discovery_completed_at TIMESTAMPTZ,
  proposal_sent_at TIMESTAMPTZ,
  converted_to_client_at TIMESTAMPTZ,
  client_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- 2. INVOICES
-- =============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partial')),
  line_items JSONB DEFAULT '[]',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- 3. AUTHORIZED_USERS
-- =============================================================
CREATE TABLE IF NOT EXISTS authorized_users (
  id TEXT PRIMARY KEY,
  mobile_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'editor', 'viewer')),
  permissions TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_by TEXT DEFAULT 'system',
  last_login TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_authorized_users_mobile ON authorized_users(mobile_number);
CREATE INDEX IF NOT EXISTS idx_authorized_users_status ON authorized_users(status);

CREATE TRIGGER authorized_users_updated_at
  BEFORE UPDATE ON authorized_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- 4. TALENT_APPLICATIONS
-- =============================================================
CREATE TABLE IF NOT EXISTS talent_applications (
  id TEXT PRIMARY KEY,
  application_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'waitlisted')),
  review_notes TEXT DEFAULT '',
  reviewed_by TEXT DEFAULT '',
  reviewed_at TIMESTAMPTZ,
  personal_info JSONB NOT NULL DEFAULT '{}',
  professional_details JSONB NOT NULL DEFAULT '{}',
  portfolio_links JSONB DEFAULT '{}',
  social_media JSONB DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  pricing JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_talent_applications_status ON talent_applications(status);

CREATE TRIGGER talent_applications_updated_at
  BEFORE UPDATE ON talent_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- 5. TALENT_PROFILES
-- =============================================================
CREATE TABLE IF NOT EXISTS talent_profiles (
  id TEXT PRIMARY KEY,
  application_id TEXT REFERENCES talent_applications(id),
  personal_info JSONB NOT NULL DEFAULT '{}',
  professional_details JSONB NOT NULL DEFAULT '{}',
  portfolio_links JSONB DEFAULT '{}',
  social_media JSONB DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  pricing JSONB DEFAULT '{}',
  ratings JSONB DEFAULT '{"overallRating": 0, "totalReviews": 0, "qualityOfWork": 0, "communication": 0, "timeliness": 0, "professionalism": 0}',
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_talent_profiles_status ON talent_profiles(status);
CREATE INDEX IF NOT EXISTS idx_talent_profiles_application_id ON talent_profiles(application_id);

CREATE TRIGGER talent_profiles_updated_at
  BEFORE UPDATE ON talent_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- 6. DISCOVERY_SESSIONS
-- =============================================================
CREATE TABLE IF NOT EXISTS discovery_sessions (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  lead_id TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled', 'on_hold')),
  current_section INTEGER DEFAULT 1,
  completed_sections JSONB DEFAULT '[]',
  assigned_to TEXT,
  completed_at TIMESTAMPTZ,
  company_fundamentals JSONB DEFAULT '{}',
  project_overview JSONB DEFAULT '{}',
  target_audience JSONB DEFAULT '{}',
  current_state JSONB DEFAULT '{}',
  goals_kpis JSONB DEFAULT '{}',
  competition_market JSONB DEFAULT '{}',
  budget_resources JSONB DEFAULT '{}',
  technical_requirements JSONB DEFAULT '{}',
  content_creative JSONB DEFAULT '{}',
  next_steps JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discovery_sessions_client_id ON discovery_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_discovery_sessions_lead_id ON discovery_sessions(lead_id);
CREATE INDEX IF NOT EXISTS idx_discovery_sessions_status ON discovery_sessions(status);

CREATE TRIGGER discovery_sessions_updated_at
  BEFORE UPDATE ON discovery_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- 7. CAMPAIGNS
-- =============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  budget DECIMAL(12, 2) DEFAULT 0,
  spent DECIMAL(12, 2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
