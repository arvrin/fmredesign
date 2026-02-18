-- =============================================================
-- FreakingMinds: Admin Audit Log Table
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =============================================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'approve', 'reject')),
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast queries by time (most common: recent entries)
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON admin_audit_log (created_at DESC);

-- Index for filtering by resource type
CREATE INDEX IF NOT EXISTS idx_audit_log_resource_type ON admin_audit_log (resource_type);

-- Index for filtering by action
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON admin_audit_log (action);

-- Index for filtering by user
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON admin_audit_log (user_id);

-- Auto-cleanup: remove entries older than 90 days (optional, run as cron)
-- DELETE FROM admin_audit_log WHERE created_at < NOW() - INTERVAL '90 days';

COMMENT ON TABLE admin_audit_log IS 'Tracks all admin mutations — who changed what and when';
