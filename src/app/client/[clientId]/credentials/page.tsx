'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DashboardCard as Card,
  CardContent,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
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
import { useClientPortal } from '@/lib/client-portal/context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
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
// Icon map (lucide icons by string name)
// ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  BarChart3,
  Globe,
  MapPin,
  Facebook: Globe, // lucide doesn't have Facebook — use Globe
  Instagram,
  Twitter: X, // X icon for Twitter/X
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
// Main Page
// ────────────────────────────────────────────────────────────

export default function ClientCredentialsPage() {
  const { clientId } = useClientPortal();

  const [credentials, setCredentials] = useState<ClientCredentialMasked[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClientCredentialMasked | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCredentials = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/client-portal/${clientId}/credentials`);
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
    if (!deleteTarget || !clientId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/client-portal/${clientId}/credentials?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCredentials((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Error deleting credential:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
              Platform <span className="v2-accent">Credentials</span>
            </h1>
            <p className="text-fm-neutral-600 mt-1 font-medium">
              Securely share your platform access with our team
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-fm-magenta-50 text-fm-magenta-700 border-fm-magenta-200">
              {credentials.length} Credential{credentials.length !== 1 ? 's' : ''}
            </Badge>
            <button
              onClick={() => { setShowAdd(true); setEditingId(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-fm-magenta-600 text-white rounded-lg text-sm font-medium hover:bg-fm-magenta-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Credential
            </button>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800">End-to-end encrypted</p>
          <p className="text-xs text-green-600 mt-0.5">
            All credentials are encrypted before storage. Only authorized team members can access them for your project work.
          </p>
        </div>
      </div>

      {/* Add / Edit form */}
      {showAdd && (
        <CredentialForm
          clientId={clientId}
          editingId={editingId}
          onClose={() => { setShowAdd(false); setEditingId(null); }}
          onSaved={() => {
            setShowAdd(false);
            setEditingId(null);
            fetchCredentials();
          }}
        />
      )}

      {/* Credentials list */}
      {credentials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credentials.map((cred) => {
            const preset = getPlatformPreset(cred.platform);
            return (
              <Card key={cred.id} variant="client" hover glow className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPlatformColor(cred.platform)}`}>
                        {preset ? (
                          <PlatformIcon preset={preset} className="w-5 h-5" />
                        ) : (
                          <Key className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-fm-neutral-900">
                          {getPlatformName(cred.platform)}
                        </h3>
                        {cred.label && (
                          <p className="text-xs text-fm-neutral-500">{cred.label}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingId(cred.id); setShowAdd(true); }}
                        className="p-2 text-fm-neutral-400 hover:text-fm-magenta-600 hover:bg-fm-neutral-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cred)}
                        className="p-2 text-fm-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Masked fields */}
                  <div className="space-y-1.5">
                    {Object.entries(cred.credentials_masked).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-fm-neutral-500 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-fm-neutral-700 font-mono text-xs">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-fm-neutral-100">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          cred.status === 'active'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : cred.status === 'expired'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }
                      >
                        {cred.status}
                      </Badge>
                      <span className="text-xs text-fm-neutral-400 capitalize">{cred.credential_type.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-xs text-fm-neutral-400">
                      {new Date(cred.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  {cred.notes && (
                    <p className="text-xs text-fm-neutral-500 mt-2 italic">{cred.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : !showAdd ? (
        <EmptyState
          icon={<Key className="w-6 h-6" />}
          title="No credentials added yet"
          description="Add your platform credentials so our team can manage your accounts securely"
          action={
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-fm-magenta-600 text-white rounded-lg text-sm font-medium hover:bg-fm-magenta-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Credential
            </button>
          }
        />
      ) : null}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">Delete Credential</h3>
            <p className="text-sm text-fm-neutral-600 mb-6">
              Are you sure you want to delete the <strong>{getPlatformName(deleteTarget.platform)}</strong> credential
              {deleteTarget.label ? ` "${deleteTarget.label}"` : ''}? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-fm-neutral-600 hover:text-fm-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Credential Form (Add / Edit)
// ────────────────────────────────────────────────────────────

function CredentialForm({
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
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedCredType, setSelectedCredType] = useState<CredentialType>('login');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const preset = getPlatformPreset(selectedPlatform);
  const credTypeConfig = preset?.credentialTypes.find((ct) => ct.type === selectedCredType);
  const fields: PlatformField[] = credTypeConfig?.fields || [];

  // When platform changes, reset credential type to first available
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

    // Validate required fields
    for (const field of fields) {
      if (field.required && !fieldValues[field.key]?.trim()) {
        setError(`${field.label} is required`);
        return;
      }
    }

    setSaving(true);
    setError('');

    try {
      const url = `/api/client-portal/${clientId}/credentials`;
      const method = editingId ? 'PUT' : 'POST';
      const body: Record<string, unknown> = {
        platform: selectedPlatform,
        credential_type: selectedCredType,
        label: label || null,
        notes: notes || null,
        credentials: fieldValues,
      };
      if (editingId) body.id = editingId;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(onSaved, 800);
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
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-fm-neutral-900">
          {editingId ? 'Update Credential' : 'Add New Credential'}
        </h3>
        <button onClick={onClose} className="text-fm-neutral-400 hover:text-fm-neutral-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {success ? (
        <div className="flex items-center gap-2 text-green-700 py-4">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Credential saved successfully!</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Platform picker */}
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Platform</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {PLATFORM_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm ${
                    selectedPlatform === p.id
                      ? 'border-fm-magenta-600 bg-fm-magenta-50'
                      : 'border-fm-neutral-200 hover:border-fm-neutral-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${p.color}`}>
                    <PlatformIcon preset={p} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-fm-neutral-700 leading-tight" style={{ textAlign: 'center' }}>
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Credential type selector (if platform has multiple) */}
          {preset && preset.credentialTypes.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Credential Type</label>
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
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <CredentialInput
                    type={field.type}
                    placeholder={field.placeholder}
                    value={fieldValues[field.key] || ''}
                    onChange={(val) => setFieldValues((prev) => ({ ...prev, [field.key]: val }))}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Label */}
          {selectedPlatform && (
            <>
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                  Label <span className="text-fm-neutral-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Main account, Client's personal, Backup"
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                  Notes <span className="text-fm-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-600 resize-none"
                />
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-fm-neutral-600 hover:text-fm-neutral-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedPlatform || saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-fm-magenta-600 text-white rounded-lg text-sm font-medium hover:bg-fm-magenta-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {editingId ? 'Update' : 'Save Credential'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Password-toggle input
// ────────────────────────────────────────────────────────────

function CredentialInput({
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
