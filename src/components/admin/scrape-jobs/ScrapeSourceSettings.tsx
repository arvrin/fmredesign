'use client';

import { useState } from 'react';
import { Key, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { SOURCE_PLATFORM_OPTIONS } from '@/lib/admin/scrape-job-types';
import type { ScrapeSourceConfig } from '@/lib/admin/scrape-job-types';
import type { UseScrapeJobsReturn } from '@/hooks/admin/useScrapeJobs';

interface ScrapeSourceSettingsProps {
  hook: UseScrapeJobsReturn;
}

export function ScrapeSourceSettings({ hook }: ScrapeSourceSettingsProps) {
  const { sourceConfigs, updateSourceConfig } = hook;

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60">
        Configure credentials for each scraping source. Credentials are stored securely and used by the orchestrator at runtime.
      </p>

      <div className="space-y-4">
        {sourceConfigs.map((config) => (
          <SourceConfigCard
            key={config.id}
            config={config}
            onUpdate={(newConfig) => updateSourceConfig(config.id, newConfig)}
          />
        ))}
      </div>

      {sourceConfigs.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12" style={{ textAlign: 'center' }}>
          <Key className="w-10 h-10 text-white/30 mx-auto mb-3" />
          <p className="text-white/60">No source configs found. They should be seeded automatically.</p>
        </div>
      )}
    </div>
  );
}

function SourceConfigCard({
  config,
  onUpdate,
}: {
  config: ScrapeSourceConfig;
  onUpdate: (config: Record<string, unknown>) => void;
}) {
  const platform = SOURCE_PLATFORM_OPTIONS.find((o) => o.value === config.sourcePlatform);
  const configData = config.config as Record<string, string>;

  // Determine which field to show based on platform
  const isBNI = config.sourcePlatform === 'bni';
  const isGoogleMaps = config.sourcePlatform === 'google_maps';

  const [fieldValue, setFieldValue] = useState('');
  const [saving, setSaving] = useState(false);

  const fieldKey = isBNI ? 'bearer_token' : isGoogleMaps ? 'serpapi_key' : '';
  const fieldLabel = isBNI ? 'Bearer Token' : isGoogleMaps ? 'SerpAPI Key' : '';
  const fieldPlaceholder = isBNI
    ? 'eyJhbGciOi...'
    : isGoogleMaps
    ? 'your-serpapi-key'
    : '';

  const currentValue = configData[fieldKey] || '';
  const hasValue = currentValue.length > 0;

  const handleSave = async () => {
    if (!fieldValue.trim()) return;
    setSaving(true);
    try {
      const updated = { ...configData, [fieldKey]: fieldValue.trim() };
      onUpdate(updated);
      setFieldValue('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10">
            <Shield className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {platform?.label || config.sourcePlatform}
            </h3>
            <p className="text-xs text-white/40">{platform?.description}</p>
          </div>
        </div>
        <div>
          {config.isValid ? (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Valid
            </span>
          ) : config.validationError ? (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              Invalid
            </span>
          ) : (
            <span className="text-xs text-white/40">Not validated</span>
          )}
        </div>
      </div>

      {/* Current status */}
      <div className="flex items-center gap-3 text-xs text-white/50">
        <span>
          {fieldLabel}: {hasValue ? `${currentValue.slice(0, 10)}...${currentValue.slice(-4)}` : 'Not set'}
        </span>
        {config.lastValidatedAt && (
          <span>
            Last validated: {new Date(config.lastValidatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {config.validationError && (
        <div className="flex items-start gap-1.5 text-xs text-red-400/80 bg-red-500/10 rounded-lg p-2">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{config.validationError}</span>
        </div>
      )}

      {/* Update field */}
      {fieldKey && (
        <div className="flex gap-2">
          <input
            type="password"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            placeholder={`Enter new ${fieldLabel.toLowerCase()}...`}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-fm-magenta-600"
          />
          <DashboardButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!fieldValue.trim() || saving}
          >
            {saving ? 'Saving...' : 'Update'}
          </DashboardButton>
        </div>
      )}

      {config.sourcePlatform === 'linkedin' && (
        <div className="rounded-lg bg-yellow-900/20 border border-yellow-500/20 p-2.5">
          <p className="text-xs text-yellow-400/80">
            LinkedIn integration is not yet implemented. Configuration will be available when support is added.
          </p>
        </div>
      )}
    </div>
  );
}
