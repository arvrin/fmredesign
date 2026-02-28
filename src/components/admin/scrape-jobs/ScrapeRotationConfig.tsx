'use client';

import { useState } from 'react';
import { Plus, Trash2, RotateCw, Lightbulb, X } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { SOURCE_PLATFORM_OPTIONS } from '@/lib/admin/scrape-job-types';
import type { ScrapeRotationConfig as RotationConfig, ScrapeSourcePlatform } from '@/lib/admin/scrape-job-types';
import type { UseScrapeJobsReturn } from '@/hooks/admin/useScrapeJobs';

interface ScrapeRotationConfigProps {
  hook: UseScrapeJobsReturn;
}

export function ScrapeRotationConfig({ hook }: ScrapeRotationConfigProps) {
  const {
    rotationConfigs,
    suggestions,
    updateRotationConfig,
    deleteRotationConfig,
  } = hook;

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState<ScrapeSourcePlatform>('bni');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const handleCreateRotation = async () => {
    if (!newName.trim()) return;
    await updateRotationConfig(null, {
      name: newName,
      sourcePlatform: newPlatform,
      countries: [],
      industries: [],
    });
    setNewName('');
    setShowCreate(false);
  };

  const visibleSuggestions = suggestions.filter(
    (s) => !dismissedSuggestions.has(`${s.type}:${s.value}`)
  );

  return (
    <div className="space-y-6">
      {/* Suggestions Panel */}
      {visibleSuggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-fm-neutral-500">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span>Suggestions based on your scraped data</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSuggestions.slice(0, 6).map((suggestion) => (
              <div
                key={`${suggestion.type}:${suggestion.value}`}
                className="rounded-lg border border-fm-neutral-200 bg-white p-3 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      suggestion.type === 'country'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {suggestion.type}
                    </span>
                    <span className="text-sm text-fm-neutral-900 font-medium">{suggestion.value}</span>
                  </div>
                  <p className="text-xs text-fm-neutral-400">{suggestion.reason}</p>
                </div>
                <button
                  onClick={() =>
                    setDismissedSuggestions((prev) => new Set([...prev, `${suggestion.type}:${suggestion.value}`]))
                  }
                  className="p-1 text-fm-neutral-300 hover:text-fm-neutral-600 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Config List */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-fm-neutral-500">{rotationConfigs.length} rotation config(s)</p>
        <DashboardButton variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          New Rotation
        </DashboardButton>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="rounded-xl border border-fm-neutral-200 bg-white p-4 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Rotation name, e.g., BNI Global Rotation"
              className="flex-1 px-3 py-2 rounded-lg bg-white border border-fm-neutral-200 text-fm-neutral-900 placeholder-fm-neutral-400 text-sm focus:outline-none focus:border-fm-magenta-600"
            />
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value as ScrapeSourcePlatform)}
              className="px-3 py-2 rounded-lg bg-white border border-fm-neutral-200 text-fm-neutral-900 text-sm focus:outline-none focus:border-fm-magenta-600"
            >
              {SOURCE_PLATFORM_OPTIONS.filter((o) => o.value !== 'other').map((o) => (
                <option key={o.value} value={o.value} className="bg-white">{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <DashboardButton variant="secondary" size="sm" onClick={() => setShowCreate(false)}>
              Cancel
            </DashboardButton>
            <DashboardButton variant="primary" size="sm" onClick={handleCreateRotation} disabled={!newName.trim()}>
              Create
            </DashboardButton>
          </div>
        </div>
      )}

      {/* Rotation Cards */}
      {rotationConfigs.length === 0 && !showCreate ? (
        <div className="rounded-xl border border-fm-neutral-200 bg-white p-12" style={{ textAlign: 'center' }}>
          <RotateCw className="w-10 h-10 text-fm-neutral-300 mx-auto mb-3" />
          <p className="text-fm-neutral-500 mb-4">No rotation configs. Create one to auto-rotate through countries and industries.</p>
          <DashboardButton variant="primary" size="sm" onClick={() => setShowCreate(true)}>
            Create Rotation
          </DashboardButton>
        </div>
      ) : (
        <div className="space-y-4">
          {rotationConfigs.map((config) => (
            <RotationCard
              key={config.id}
              config={config}
              onUpdate={(data) => updateRotationConfig(config.id, data)}
              onDelete={() => {
                if (confirm(`Delete rotation "${config.name}"?`)) {
                  deleteRotationConfig(config.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RotationCard({
  config,
  onUpdate,
  onDelete,
}: {
  config: RotationConfig;
  onUpdate: (data: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [countries, setCountries] = useState(config.countries.join(', '));
  const [industries, setIndustries] = useState(config.industries.join(', '));
  const [runsPerDay, setRunsPerDay] = useState(String(config.runsPerDay));

  const handleSave = () => {
    const parsedCountries = countries.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedIndustries = industries.split(',').map((s) => {
      const trimmed = s.trim();
      const num = parseInt(trimmed, 10);
      return isNaN(num) ? trimmed : num;
    }).filter((v) => v !== '' && v !== 0);

    onUpdate({
      countries: parsedCountries,
      industries: parsedIndustries,
      runsPerDay: parseInt(runsPerDay, 10) || 3,
    });
    setEditing(false);
  };

  const platform = SOURCE_PLATFORM_OPTIONS.find((o) => o.value === config.sourcePlatform)?.label || config.sourcePlatform;

  return (
    <div className="rounded-xl border border-fm-neutral-200 bg-white p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-fm-neutral-900">{config.name}</h3>
            <span className="text-xs text-fm-neutral-400 bg-fm-neutral-100 px-2 py-0.5 rounded-full">{platform}</span>
            {!config.isActive && (
              <span className="text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">Paused</span>
            )}
          </div>
          <p className="text-xs text-fm-neutral-400 mt-1">
            {config.countries.length} countries, {config.industries.length} industries | {config.runsPerDay} runs/day
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <DashboardButton variant="secondary" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </DashboardButton>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-fm-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Position */}
      <div className="flex items-center gap-4 text-xs text-fm-neutral-500">
        <span>
          Current: {config.countries[config.currentCountryIndex] || 'N/A'} / {String(config.industries[config.currentIndustryIndex] ?? 'N/A')}
        </span>
        <span>
          Index: [{config.currentCountryIndex}, {config.currentIndustryIndex}]
        </span>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="space-y-3 pt-2 border-t border-fm-neutral-200">
          <div>
            <label className="block text-xs font-medium text-fm-neutral-500 mb-1">
              Countries <span className="text-fm-neutral-400">(comma-separated)</span>
            </label>
            <textarea
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-fm-neutral-200 text-fm-neutral-900 text-sm resize-none focus:outline-none focus:border-fm-magenta-600"
              rows={2}
              placeholder="India, Philippines, Australia, Italy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-fm-neutral-500 mb-1">
              Industries <span className="text-fm-neutral-400">(comma-separated; use IDs for BNI, search terms for Google Maps)</span>
            </label>
            <textarea
              value={industries}
              onChange={(e) => setIndustries(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-fm-neutral-200 text-fm-neutral-900 text-sm resize-none focus:outline-none focus:border-fm-magenta-600"
              rows={2}
              placeholder="56, 57, 58 (BNI category IDs) or restaurants, hotels (search terms)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-fm-neutral-500 mb-1">Runs per day</label>
            <input
              type="number"
              value={runsPerDay}
              onChange={(e) => setRunsPerDay(e.target.value)}
              className="w-24 px-3 py-2 rounded-lg bg-white border border-fm-neutral-200 text-fm-neutral-900 text-sm focus:outline-none focus:border-fm-magenta-600"
              min={1}
              max={20}
            />
          </div>
          <div className="flex justify-end">
            <DashboardButton variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </DashboardButton>
          </div>
        </div>
      )}
    </div>
  );
}
