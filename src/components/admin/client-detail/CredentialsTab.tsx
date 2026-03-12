/**
 * CredentialsTab — Admin view of a client's platform credentials.
 * Self-fetching tab for admin client detail page.
 * Supports add, edit, delete. All credentials are masked.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Key,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Search,
  BarChart3,
  Globe,
  MapPin,
  Instagram,
  Linkedin,
  Music,
  Pin,
  Youtube,
  Server,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { DashboardButton as Button } from '@/design-system';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
  PLATFORM_PRESETS,
  getPlatformName,
  getPlatformColor,
  getPlatformPreset,
  type ClientCredentialMasked,
  type PlatformPreset,
  type PlatformField,
  type CredentialType,
} from '@/lib/admin/credential-types';

// ────────────────────────────────────────────────────────────
// Icon map
// ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  BarChart3,
  Globe,
  MapPin,
  Facebook: Globe,
  Instagram,
  Twitter: X,
  Linkedin,
  Music,
  Pin,
  Youtube,
  Server,
  Key,
};

function PlatformIcon({ preset, className }: { preset: PlatformPreset; className?: string }) {
  const IconComp = ICON_MAP[preset.icon] || Key;
  return <IconComp className={className} />;
}

// ────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────

interface CredentialsTabProps {
  clientId: string;
  clientName?: string;
}

export function CredentialsTab({ clientId, clientName }: CredentialsTabProps) {
  const [credentials, setCredentials] = useState<ClientCredentialMasked[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClientCredentialMasked | null>(null);

  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/client-credentials?clientId=${clientId}`);
      if (res.ok) {
        const json = await res.json();
        setCredentials(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching credentials:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/client-credentials?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCredentials((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Error deleting credential:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 text-fm-neutral-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-fm-neutral-900">Platform Credentials</h3>
            <p className="text-sm text-fm-neutral-500 mt-0.5">
              {credentials.length} credential{credentials.length !== 1 ? 's' : ''} stored
              {credentials.filter((c) => c.added_by === 'client').length > 0 && (
                <span> — {credentials.filter((c) => c.added_by === 'client').length} added by client</span>
              )}
            </p>
          </div>
          <Button size="sm" onClick={() => { setShowAddForm(true); setEditingId(null); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Credential
          </Button>
        </div>

        {/* Security info */}
        <div className="mt-4 flex items-center gap-2 text-xs text-fm-neutral-500">
          <Shield className="w-3.5 h-3.5" />
          <span>All credentials are AES-256 encrypted at rest. Values shown are masked.</span>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <AdminCredentialForm
          clientId={clientId}
          editingId={editingId}
          onClose={() => { setShowAddForm(false); setEditingId(null); }}
          onSaved={() => {
            setShowAddForm(false);
            setEditingId(null);
            fetchCredentials();
          }}
        />
      )}

      {/* Credentials list */}
      {credentials.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200">
          <div className="divide-y divide-fm-neutral-100">
            {credentials.map((cred) => {
              const preset = getPlatformPreset(cred.platform);
              return (
                <div
                  key={cred.id}
                  className="flex items-start justify-between p-4 hover:bg-fm-neutral-50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getPlatformColor(cred.platform)}`}>
                      {preset ? (
                        <PlatformIcon preset={preset} className="w-4 h-4" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-fm-neutral-900 text-sm">
                          {getPlatformName(cred.platform)}
                        </span>
                        {cred.label && (
                          <span className="text-xs text-fm-neutral-500">— {cred.label}</span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            cred.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : cred.status === 'expired'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {cred.status}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-xs bg-fm-neutral-100 text-fm-neutral-600">
                          {cred.added_by === 'client' ? 'Client added' : 'Admin added'}
                        </span>
                      </div>

                      {/* Masked credential fields */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                        {Object.entries(cred.credentials_masked).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="text-fm-neutral-400 capitalize">{key.replace(/_/g, ' ')}: </span>
                            <span className="text-fm-neutral-600 font-mono">{value}</span>
                          </div>
                        ))}
                      </div>

                      {cred.notes && (
                        <p className="text-xs text-fm-neutral-400 mt-1 italic">{cred.notes}</p>
                      )}

                      <span className="text-xs text-fm-neutral-400 mt-1 block">
                        Added {new Date(cred.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {cred.updated_at !== cred.created_at && (
                          <> — updated {new Date(cred.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingId(cred.id); setShowAddForm(true); }}
                      className="p-2 text-fm-neutral-500 hover:text-fm-magenta-600 hover:bg-fm-neutral-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cred)}
                      className="p-2 text-fm-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : !showAddForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-12" style={{ textAlign: 'center' }}>
          <Key className="h-10 w-10 text-fm-neutral-300 mx-auto mb-3" />
          <p className="text-fm-neutral-700 font-medium">No credentials stored</p>
          <p className="text-sm text-fm-neutral-500 mt-1">
            {clientName ? `${clientName} hasn't added any credentials yet` : 'No credentials added yet'}
          </p>
          <Button size="sm" className="mt-4" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Credential
          </Button>
        </div>
      ) : null}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Credential"
        description={`Are you sure you want to delete the ${getPlatformName(deleteTarget?.platform || '')} credential${deleteTarget?.label ? ` "${deleteTarget.label}"` : ''}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Admin Add/Edit Form
// ────────────────────────────────────────────────────────────

function AdminCredentialForm({
  clientId,
  editingId,
  onClose,
  onSaved,
}: {
  clientId: string;
  editingId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedCredType, setSelectedCredType] = useState<CredentialType>('login');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const preset = getPlatformPreset(selectedPlatform);
  const credTypeConfig = preset?.credentialTypes.find((ct) => ct.type === selectedCredType);
  const fields: PlatformField[] = credTypeConfig?.fields || [];

  useEffect(() => {
    if (preset && preset.credentialTypes.length > 0) {
      setSelectedCredType(preset.credentialTypes[0].type);
      setFieldValues({});
    }
  }, [selectedPlatform]);

  const handleSubmit = async () => {
    if (!selectedPlatform) {
      setError('Please select a platform');
      return;
    }
    for (const field of fields) {
      if (field.required && !fieldValues[field.key]?.trim()) {
        setError(`${field.label} is required`);
        return;
      }
    }

    setSaving(true);
    setError('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body: Record<string, unknown> = {
        client_id: clientId,
        platform: selectedPlatform,
        credential_type: selectedCredType,
        label: label || null,
        notes: notes || null,
        credentials: fieldValues,
      };
      if (editingId) body.id = editingId;

      const res = await fetch('/api/admin/client-credentials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSaved();
      } else {
        const json = await res.json();
        setError(json.error || 'Failed to save');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-fm-neutral-900">
          {editingId ? 'Update Credential' : 'Add Credential'}
        </h4>
        <button onClick={onClose} className="text-fm-neutral-400 hover:text-fm-neutral-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Platform picker — compact grid */}
        <div>
          <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Platform</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-sm ${
                  selectedPlatform === p.id
                    ? 'border-fm-magenta-600 bg-fm-magenta-50 font-medium'
                    : 'border-fm-neutral-200 hover:border-fm-neutral-300'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${p.color}`}>
                  <PlatformIcon preset={p} className="w-3 h-3" />
                </div>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Credential type */}
        {preset && preset.credentialTypes.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Type</label>
            <div className="flex gap-2">
              {preset.credentialTypes.map((ct) => (
                <button
                  key={ct.type}
                  onClick={() => { setSelectedCredType(ct.type); setFieldValues({}); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCredType === ct.type
                      ? 'bg-fm-magenta-100 text-fm-magenta-700 font-medium'
                      : 'text-fm-neutral-600 hover:bg-fm-neutral-100'
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic fields */}
        {fields.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <AdminCredentialInput
                  type={field.type}
                  placeholder={field.placeholder}
                  value={fieldValues[field.key] || ''}
                  onChange={(val) => setFieldValues((prev) => ({ ...prev, [field.key]: val }))}
                />
              </div>
            ))}
          </div>
        )}

        {/* Label + Notes */}
        {selectedPlatform && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Main account"
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-600"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!selectedPlatform || saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            {editingId ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdminCredentialInput({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: 'text' | 'password' | 'url';
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const isSecret = type === 'password';

  return (
    <div className="relative">
      <input
        type={isSecret && !visible ? 'password' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-10 border border-fm-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-600"
      />
      {isSecret && (
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-fm-neutral-400 hover:text-fm-neutral-600"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
