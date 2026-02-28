'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import {
  SOURCE_PLATFORM_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from '@/lib/admin/scrape-job-types';
import type { ScrapeSourcePlatform, ScrapeScheduleType } from '@/lib/admin/scrape-job-types';

interface ScrapeJobCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    sourcePlatform: ScrapeSourcePlatform;
    params: Record<string, unknown>;
    scheduleType: ScrapeScheduleType;
  }) => Promise<void>;
}

export function ScrapeJobCreateModal({ isOpen, onClose, onCreate }: ScrapeJobCreateModalProps) {
  const [name, setName] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState<ScrapeSourcePlatform>('bni');
  const [scheduleType, setScheduleType] = useState<ScrapeScheduleType>('manual');
  const [submitting, setSubmitting] = useState(false);

  // BNI params
  const [bniCountry, setBniCountry] = useState('India');
  const [bniCategoryId, setBniCategoryId] = useState('');

  // Google Maps params
  const [gmQuery, setGmQuery] = useState('');
  const [gmLocation, setGmLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      let params: Record<string, unknown> = {};
      if (sourcePlatform === 'bni') {
        params = { country: bniCountry };
        if (bniCategoryId) params.category_id = parseInt(bniCategoryId, 10);
      } else if (sourcePlatform === 'google_maps') {
        params = { query: gmQuery, location: gmLocation };
      }

      await onCreate({ name, sourcePlatform, params, scheduleType });
      // Reset form
      setName('');
      setBniCountry('India');
      setBniCategoryId('');
      setGmQuery('');
      setGmLocation('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Create Scrape Job</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Job Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., BNI Philippines Food & Beverage"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-fm-magenta-600"
              required
            />
          </div>

          {/* Source Platform */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Source Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {SOURCE_PLATFORM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSourcePlatform(opt.value)}
                  className={`px-3 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                    sourcePlatform === opt.value
                      ? 'border-fm-magenta-600 bg-fm-magenta-600/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Params */}
          {sourcePlatform === 'bni' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Country</label>
                <input
                  type="text"
                  value={bniCountry}
                  onChange={(e) => setBniCountry(e.target.value)}
                  placeholder="India"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-fm-magenta-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Category ID <span className="text-white/40">(optional)</span>
                </label>
                <input
                  type="text"
                  value={bniCategoryId}
                  onChange={(e) => setBniCategoryId(e.target.value)}
                  placeholder="e.g., 56"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-fm-magenta-600"
                />
              </div>
            </div>
          )}

          {sourcePlatform === 'google_maps' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Search Query</label>
                <input
                  type="text"
                  value={gmQuery}
                  onChange={(e) => setGmQuery(e.target.value)}
                  placeholder="e.g., digital marketing agencies"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-fm-magenta-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  City / Area <span className="text-white/40">(optional — appended to query)</span>
                </label>
                <input
                  type="text"
                  value={gmLocation}
                  onChange={(e) => setGmLocation(e.target.value)}
                  placeholder="e.g., Mumbai, Pune, Delhi"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-fm-magenta-600"
                />
              </div>
            </div>
          )}

          {sourcePlatform === 'linkedin' && (
            <div className="rounded-lg bg-yellow-900/20 border border-yellow-500/20 p-3">
              <p className="text-sm text-yellow-400/80">
                LinkedIn scraping is not yet implemented. You can create the job definition now and it will be ready when support is added.
              </p>
            </div>
          )}

          {/* Schedule Type */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Schedule</label>
            <select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value as ScrapeScheduleType)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-fm-magenta-600"
            >
              {SCHEDULE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <DashboardButton variant="secondary" size="sm" onClick={onClose} type="button">
              Cancel
            </DashboardButton>
            <DashboardButton variant="primary" size="sm" type="submit" disabled={submitting || !name.trim()}>
              {submitting ? 'Creating...' : 'Create Job'}
            </DashboardButton>
          </div>
        </form>
      </div>
    </div>
  );
}
