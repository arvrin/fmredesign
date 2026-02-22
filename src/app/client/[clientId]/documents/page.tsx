'use client';

import { useState, useEffect } from 'react';
import {
  DashboardCard as Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  IconBox,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  Video,
  Archive,
  File,
  Download,
  ExternalLink,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterTabBar } from '@/components/ui/filter-tab-bar';

interface Document {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadedBy: string;
  createdAt: string;
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'contract', label: 'Contracts' },
  { key: 'report', label: 'Reports' },
  { key: 'invoice', label: 'Invoices' },
  { key: 'design', label: 'Design' },
  { key: 'brand', label: 'Brand' },
  { key: 'general', label: 'General' },
];

function getFileIcon(type: string) {
  switch (type) {
    case 'spreadsheet':
      return <FileSpreadsheet className="w-5 h-5" />;
    case 'presentation':
      return <Presentation className="w-5 h-5" />;
    case 'image':
      return <Image className="w-5 h-5" />;
    case 'video':
      return <Video className="w-5 h-5" />;
    case 'archive':
      return <Archive className="w-5 h-5" />;
    case 'document':
      return <FileText className="w-5 h-5" />;
    default:
      return <File className="w-5 h-5" />;
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'contract':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'report':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'invoice':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'design':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'brand':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200';
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ClientDocumentsPage() {
  const { clientId } = useClientPortal();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    if (!clientId) return;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const url = `/api/client-portal/${clientId}/documents${category !== 'all' ? `?category=${category}` : ''}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setDocuments(json.data || []);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId, category]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
              Document <span className="v2-accent">Vault</span>
            </h1>
            <p className="text-fm-neutral-600 mt-1 font-medium">
              Access shared documents and files
            </p>
          </div>
          <Badge variant="secondary" className="bg-fm-magenta-50 text-fm-magenta-700 border-fm-magenta-200">
            {documents.length} Document{documents.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Category Filter */}
      <FilterTabBar
        tabs={CATEGORIES.map((cat) => ({ key: cat.key, label: cat.label }))}
        active={category}
        onChange={setCategory}
        variant="client"
        className="mb-6"
      />

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} variant="client" hover glow className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-50 flex items-center justify-center text-fm-magenta-600 flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-fm-neutral-900 truncate">{doc.name}</h3>
                    {doc.description && (
                      <p className="text-sm text-fm-neutral-600 mt-1 line-clamp-2">{doc.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getCategoryColor(doc.category)} variant="secondary">
                        {doc.category}
                      </Badge>
                      {doc.fileSize > 0 && (
                        <span className="text-xs text-fm-neutral-500">{formatFileSize(doc.fileSize)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-fm-neutral-500">
                        {new Date(doc.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-fm-magenta-600 hover:text-fm-magenta-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FolderOpen className="w-6 h-6" />}
          title="No documents yet"
          description={
            category === 'all'
              ? 'Documents shared by your team will appear here'
              : `No ${category} documents at the moment`
          }
        />
      )}
    </>
  );
}
