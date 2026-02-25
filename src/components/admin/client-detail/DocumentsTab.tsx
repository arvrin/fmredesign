/**
 * DocumentsTab — Self-fetching tab for client detail page.
 * Lists documents, supports upload/download/preview/delete/visibility toggle.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Eye,
  Trash2,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  EyeOff,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { DashboardButton as Button } from '@/design-system';
import { UploadModal } from '@/components/admin/UploadModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { DocumentRecord, StorageInfo, DocumentCategory } from '@/lib/document-types';
import { DOCUMENT_CATEGORIES } from '@/lib/document-types';

interface DocumentsTabProps {
  clientId: string;
  clientName?: string;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/'))
    return <FileImage className="h-5 w-5 text-green-600" />;
  if (mimeType.startsWith('video/'))
    return <FileVideo className="h-5 w-5 text-purple-600" />;
  if (mimeType.startsWith('audio/'))
    return <FileAudio className="h-5 w-5 text-orange-600" />;
  if (mimeType.includes('pdf'))
    return <FileText className="h-5 w-5 text-red-600" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
    return <FileText className="h-5 w-5 text-green-600" />;
  if (mimeType.includes('document') || mimeType.includes('word'))
    return <FileText className="h-5 w-5 text-blue-600" />;
  return <File className="h-5 w-5 text-fm-neutral-600" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getCategoryBadge(category: string) {
  const colors: Record<string, string> = {
    brand: 'bg-orange-100 text-orange-800',
    campaign: 'bg-blue-100 text-blue-800',
    report: 'bg-indigo-100 text-indigo-800',
    contract: 'bg-purple-100 text-purple-800',
    invoice: 'bg-green-100 text-green-800',
    design: 'bg-pink-100 text-pink-800',
    client_upload: 'bg-yellow-100 text-yellow-800',
    general: 'bg-fm-neutral-100 text-fm-neutral-800',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        colors[category] || colors.general
      }`}
    >
      {category.replace('_', ' ')}
    </span>
  );
}

export function DocumentsTab({ clientId, clientName }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentRecord | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ clientId });
      if (activeCategory !== 'all') params.set('category', activeCategory);

      const res = await fetch(`/api/admin/documents?${params}`);
      if (res.ok) {
        const json = await res.json();
        setDocuments(json.data || []);
        if (json.storage) setStorage(json.storage);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId, activeCategory]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDownload = (doc: DocumentRecord) => {
    window.open(`/api/admin/documents/download?id=${doc.id}`, '_blank');
  };

  const handlePreview = (doc: DocumentRecord) => {
    if (doc.driveWebViewLink) {
      window.open(doc.driveWebViewLink, '_blank');
    }
  };

  const handleToggleVisibility = async (doc: DocumentRecord) => {
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: doc.id,
          clientVisible: !doc.clientVisible,
        }),
      });
      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === doc.id ? { ...d, clientVisible: !d.clientVisible } : d
          )
        );
      }
    } catch (err) {
      console.error('Toggle visibility error:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/documents?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
        setDeleteTarget(null);
        fetchDocuments(); // Refresh storage info
      }
    } catch (err) {
      console.error('Delete error:', err);
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
      {/* Header + Storage */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-fm-neutral-900">Documents</h3>
            {storage && (
              <div className="mt-2 max-w-xs">
                <div className="flex justify-between text-xs text-fm-neutral-500 mb-1">
                  <span>{formatFileSize(storage.usedBytes)} used</span>
                  <span>{formatFileSize(storage.limitBytes)} limit</span>
                </div>
                <div className="w-full bg-fm-neutral-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      storage.percentage > 90 ? 'bg-red-500' : 'bg-fm-magenta-600'
                    }`}
                    style={{ width: `${Math.min(storage.percentage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeCategory === 'all'
                ? 'bg-fm-magenta-100 text-fm-magenta-700 font-medium'
                : 'text-fm-neutral-600 hover:bg-fm-neutral-100'
            }`}
          >
            All ({documents.length})
          </button>
          {DOCUMENT_CATEGORIES.map((cat) => {
            const count = documents.filter((d) => d.category === cat.key).length;
            if (activeCategory === 'all' && count === 0) return null;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-fm-magenta-100 text-fm-magenta-700 font-medium'
                    : 'text-fm-neutral-600 hover:bg-fm-neutral-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* File list */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200">
        {documents.length > 0 ? (
          <div className="divide-y divide-fm-neutral-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 sm:p-4 hover:bg-fm-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getFileIcon(doc.fileType)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-fm-neutral-900 text-sm truncate">
                        {doc.name}
                      </span>
                      {getCategoryBadge(doc.category)}
                      {!doc.clientVisible && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-fm-neutral-200 text-fm-neutral-600">
                          Internal
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-fm-neutral-500 mt-0.5">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>v{doc.version}</span>
                      <span>
                        {new Date(doc.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {doc.uploadedByName && <span>by {doc.uploadedByName}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  {doc.driveWebViewLink && (
                    <button
                      onClick={() => handlePreview(doc)}
                      className="p-2 text-fm-neutral-500 hover:text-fm-magenta-600 hover:bg-fm-neutral-100 rounded-lg"
                      title="Preview"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-fm-neutral-500 hover:text-fm-magenta-600 hover:bg-fm-neutral-100 rounded-lg"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(doc)}
                    className={`p-2 rounded-lg ${
                      doc.clientVisible
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-fm-neutral-400 hover:bg-fm-neutral-100'
                    }`}
                    title={doc.clientVisible ? 'Visible to client' : 'Hidden from client'}
                  >
                    {doc.clientVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(doc)}
                    className="p-2 text-fm-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12" style={{ textAlign: 'center' }}>
            <FileText className="h-10 w-10 text-fm-neutral-300 mx-auto mb-3" />
            <p className="text-fm-neutral-700 font-medium">No documents yet</p>
            <p className="text-sm text-fm-neutral-500 mt-1">Upload files to get started</p>
            <Button size="sm" className="mt-4" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        clientId={clientId}
        onUploadComplete={fetchDocuments}
        storageUsed={storage?.usedBytes}
        storageLimit={storage?.limitBytes}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove it from Google Drive.`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
