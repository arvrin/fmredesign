/**
 * Social Accounts Panel
 * Manages connected Facebook/Instagram accounts for a client.
 * Rendered inside Settings > Social Media tab.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Facebook,
  Instagram,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Power,
  Key,
} from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { useSocialAccounts } from '@/hooks/admin/useSocialAccounts';
import type { SocialPlatform } from '@/lib/social/types';

interface SocialAccountsPanelProps {
  clientId: string;
  clientName: string;
}

export function SocialAccountsPanel({ clientId, clientName }: SocialAccountsPanelProps) {
  const {
    accounts,
    loading,
    adding,
    verifying,
    loadAccounts,
    verifyToken,
    addAccount,
    removeAccount,
    toggleActive,
  } = useSocialAccounts();

  const [showAddForm, setShowAddForm] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [platformInput, setPlatformInput] = useState<SocialPlatform>('facebook');
  const [verifiedInfo, setVerifiedInfo] = useState<{
    pageId: string;
    pageName: string;
    instagramAccountId: string | null;
    hasInstagram: boolean;
  } | null>(null);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) loadAccounts(clientId);
  }, [clientId, loadAccounts]);

  const handleVerify = async () => {
    setFormError('');
    setVerifiedInfo(null);

    if (!tokenInput.trim()) {
      setFormError('Please enter a Page Access Token');
      return;
    }

    const info = await verifyToken(tokenInput.trim());
    if (info) {
      setVerifiedInfo(info);
    } else {
      setFormError('Token verification failed. Make sure it is a valid Page Access Token.');
    }
  };

  const handleAdd = async () => {
    if (!verifiedInfo) return;

    const success = await addAccount({
      clientId,
      platform: platformInput,
      pageId: verifiedInfo.pageId,
      pageName: verifiedInfo.pageName,
      instagramAccountId: platformInput === 'instagram' ? (verifiedInfo.instagramAccountId || undefined) : undefined,
      accessToken: tokenInput.trim(),
    });

    if (success) {
      setShowAddForm(false);
      setTokenInput('');
      setVerifiedInfo(null);
      setFormError('');
    } else {
      setFormError('Failed to add account. It may already be connected.');
    }
  };

  const handleDelete = async (id: string) => {
    await removeAccount(id);
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-fm-neutral-500 py-8">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading accounts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-fm-neutral-900">
          Connected accounts for {clientName}
        </p>
        {!showAddForm && (
          <DashboardButton
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add Account
          </DashboardButton>
        )}
      </div>

      {/* Account list */}
      {accounts.length === 0 && !showAddForm && (
        <div className="bg-fm-neutral-50 rounded-lg p-6 border border-fm-neutral-200" style={{ textAlign: 'center' }}>
          <Key className="h-8 w-8 text-fm-neutral-400 mx-auto mb-2" />
          <p className="text-sm text-fm-neutral-600">No social accounts connected yet.</p>
          <p className="text-xs text-fm-neutral-400 mt-1">
            Add a Facebook Page or Instagram account to start publishing.
          </p>
        </div>
      )}

      {accounts.map((account) => (
        <div
          key={account.id}
          className="flex items-center justify-between p-4 border border-fm-neutral-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              account.platform === 'instagram'
                ? 'bg-pink-100 text-pink-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {account.platform === 'instagram' ? (
                <Instagram className="h-5 w-5" />
              ) : (
                <Facebook className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-fm-neutral-900">
                {account.pageName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-fm-neutral-500 capitalize">
                  {account.platform}
                </span>
                {account.isActive ? (
                  <Badge variant="success" className="text-xs">Active</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Paused</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DashboardButton
              variant="ghost"
              size="sm"
              onClick={() => toggleActive(account.id, !account.isActive)}
              title={account.isActive ? 'Pause account' : 'Activate account'}
            >
              <Power className={`h-4 w-4 ${account.isActive ? 'text-green-600' : 'text-fm-neutral-400'}`} />
            </DashboardButton>

            {deleteConfirm === account.id ? (
              <div className="flex items-center gap-1">
                <DashboardButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(account.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Confirm
                </DashboardButton>
                <DashboardButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </DashboardButton>
              </div>
            ) : (
              <DashboardButton
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirm(account.id)}
              >
                <Trash2 className="h-4 w-4 text-fm-neutral-400 hover:text-red-500" />
              </DashboardButton>
            )}
          </div>
        </div>
      ))}

      {/* Add account form */}
      {showAddForm && (
        <div className="border border-fm-neutral-200 rounded-lg p-4 space-y-4 bg-fm-neutral-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fm-neutral-900">Add Social Account</p>
            <button
              onClick={() => {
                setShowAddForm(false);
                setTokenInput('');
                setVerifiedInfo(null);
                setFormError('');
              }}
              className="text-xs text-fm-neutral-500 hover:text-fm-neutral-700"
            >
              Cancel
            </button>
          </div>

          {/* Platform selector */}
          <div>
            <label className="block text-xs font-medium text-fm-neutral-600 mb-1">Platform</label>
            <select
              value={platformInput}
              onChange={(e) => {
                setPlatformInput(e.target.value as SocialPlatform);
                setVerifiedInfo(null);
              }}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-fm-magenta-500"
            >
              <option value="facebook">Facebook Page</option>
              <option value="instagram">Instagram (via Facebook Page)</option>
            </select>
          </div>

          {/* Token input */}
          <div>
            <label className="block text-xs font-medium text-fm-neutral-600 mb-1">
              Page Access Token
            </label>
            <textarea
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                setVerifiedInfo(null);
                setFormError('');
              }}
              rows={3}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-fm-magenta-500"
              placeholder="Paste your Page Access Token here..."
            />
            <p className="text-xs text-fm-neutral-400 mt-1">
              Generate this from the Meta Developer Console &gt; Graph API Explorer.
            </p>
          </div>

          {/* Verify button */}
          {!verifiedInfo && (
            <DashboardButton
              variant="secondary"
              size="sm"
              onClick={handleVerify}
              disabled={verifying || !tokenInput.trim()}
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Verify Token
                </>
              )}
            </DashboardButton>
          )}

          {/* Verified info */}
          {verifiedInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Token verified</span>
              </div>
              <p className="text-sm text-green-700">
                Page: <strong>{verifiedInfo.pageName}</strong> ({verifiedInfo.pageId})
              </p>
              {platformInput === 'instagram' && (
                <p className="text-sm text-green-700">
                  {verifiedInfo.hasInstagram ? (
                    <>Instagram Business Account: <strong>{verifiedInfo.instagramAccountId}</strong></>
                  ) : (
                    <span className="text-amber-700">
                      No Instagram Business Account linked to this page. Connect one in Facebook Page settings first.
                    </span>
                  )}
                </p>
              )}

              <DashboardButton
                variant="primary"
                size="sm"
                onClick={handleAdd}
                disabled={adding || (platformInput === 'instagram' && !verifiedInfo.hasInstagram)}
              >
                {adding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Account
                  </>
                )}
              </DashboardButton>
            </div>
          )}

          {/* Error */}
          {formError && (
            <div className="flex items-start gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-xs">{formError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
