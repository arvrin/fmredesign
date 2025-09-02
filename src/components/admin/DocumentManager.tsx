/**
 * Document & Assets Manager Component
 * Comprehensive file management system for client assets and documents
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Download,
  Upload,
  Share2,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  FolderPlus,
  Folder,
  Star,
  Clock,
  User,
  MoreVertical,
  Grid3X3,
  List,
  SortAsc,
  Tag,
  Link,
  Copy,
  Move,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileImage,
  FileVideo,
  FileAudio,
  File
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { DeliverableFile, ClientProfile } from '@/lib/admin/client-types';
import { ClientService } from '@/lib/admin/client-service';

interface DocumentManagerProps {
  clientId?: string;
  campaignId?: string;
}

interface FileWithMetadata extends DeliverableFile {
  folder?: string;
  tags?: string[];
  isStarred?: boolean;
  sharedWith?: string[];
  permissions?: 'view' | 'edit' | 'admin';
  status?: 'draft' | 'review' | 'approved' | 'final';
}

export function DocumentManager({ clientId, campaignId }: DocumentManagerProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [folders, setFolders] = useState<string[]>(['Brand Assets', 'Campaign Materials', 'Reports', 'Contracts']);
  const [selectedFolder, setSelectedFolder] = useState<string>('All Files');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents' | 'videos' | 'other'>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [client, setClient] = useState<ClientProfile | null>(null);

  useEffect(() => {
    loadData();
  }, [clientId, campaignId]);

  const loadData = () => {
    // Load sample file data (in real app, this would come from API)
    const sampleFiles: FileWithMetadata[] = [
      {
        id: 'file-001',
        name: 'Brand Guidelines.pdf',
        url: '/sample/brand-guidelines.pdf',
        type: 'application/pdf',
        size: 2048000, // 2MB
        uploadedBy: 'design-team',
        uploadedAt: '2024-08-15T10:00:00Z',
        version: 2,
        folder: 'Brand Assets',
        tags: ['branding', 'guidelines', 'final'],
        isStarred: true,
        status: 'final'
      },
      {
        id: 'file-002',
        name: 'Social Media Post.png',
        url: '/sample/social-post.png',
        type: 'image/png',
        size: 512000, // 512KB
        uploadedBy: 'creative-team',
        uploadedAt: '2024-08-20T14:30:00Z',
        version: 1,
        folder: 'Campaign Materials',
        tags: ['social-media', 'post', 'instagram'],
        isStarred: false,
        status: 'review'
      },
      {
        id: 'file-003',
        name: 'Monthly Report.xlsx',
        url: '/sample/monthly-report.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1024000, // 1MB
        uploadedBy: 'analytics-team',
        uploadedAt: '2024-08-22T09:15:00Z',
        version: 1,
        folder: 'Reports',
        tags: ['analytics', 'monthly', 'performance'],
        isStarred: false,
        status: 'draft'
      },
      {
        id: 'file-004',
        name: 'Campaign Video.mp4',
        url: '/sample/campaign-video.mp4',
        type: 'video/mp4',
        size: 15728640, // 15MB
        uploadedBy: 'video-team',
        uploadedAt: '2024-08-18T16:45:00Z',
        version: 3,
        folder: 'Campaign Materials',
        tags: ['video', 'campaign', 'youtube'],
        isStarred: true,
        status: 'approved'
      }
    ];
    
    setFiles(sampleFiles);
    
    if (clientId) {
      const clientData = ClientService.getClientById(clientId);
      setClient(clientData);
    }
  };

  const getFileIcon = (type: string, size: 'sm' | 'lg' = 'sm') => {
    const iconSize = size === 'lg' ? 'h-8 w-8' : 'h-4 w-4';
    
    if (type.startsWith('image/')) {
      return <FileImage className={`${iconSize} text-green-600`} />;
    }
    if (type.startsWith('video/')) {
      return <FileVideo className={`${iconSize} text-purple-600`} />;
    }
    if (type.startsWith('audio/')) {
      return <FileAudio className={`${iconSize} text-orange-600`} />;
    }
    if (type.includes('pdf')) {
      return <FileText className={`${iconSize} text-red-600`} />;
    }
    if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FileText className={`${iconSize} text-green-600`} />;
    }
    if (type.includes('document') || type.includes('word')) {
      return <FileText className={`${iconSize} text-blue-600`} />;
    }
    return <File className={`${iconSize} text-gray-600`} />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      final: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const filteredFiles = files
    .filter(file => {
      // Folder filter
      if (selectedFolder !== 'All Files' && file.folder !== selectedFolder) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filterType !== 'all') {
        if (filterType === 'images' && !file.type.startsWith('image/')) return false;
        if (filterType === 'documents' && !file.type.includes('pdf') && !file.type.includes('document') && !file.type.includes('spreadsheet')) return false;
        if (filterType === 'videos' && !file.type.startsWith('video/')) return false;
        if (filterType === 'other' && (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.includes('pdf') || file.type.includes('document') || file.type.includes('spreadsheet'))) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'size': return b.size - a.size;
        case 'type': return a.type.localeCompare(b.type);
        case 'date': 
        default: return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Document & Asset Manager</h2>
            <p className="text-fm-neutral-600 mt-1">
              {client ? `Manage files and assets for ${client.name}` : 'Centralized file management system'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button size="sm" icon={<Upload className="h-4 w-4" />} onClick={() => setShowUploadModal(true)}>
              Upload Files
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="images">Images</option>
              <option value="documents">Documents</option>
              <option value="videos">Videos</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
              <option value="type">Sort by Type</option>
            </select>
            
            <div className="flex items-center space-x-1 border border-fm-neutral-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-fm-magenta-100 text-fm-magenta-700' : 'text-fm-neutral-600'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-fm-magenta-100 text-fm-magenta-700' : 'text-fm-neutral-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Folders */}
        <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4">
          <h3 className="font-semibold text-fm-neutral-900 mb-4">Folders</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => setSelectedFolder('All Files')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedFolder === 'All Files' 
                  ? 'bg-fm-magenta-50 text-fm-magenta-700' 
                  : 'text-fm-neutral-700 hover:bg-fm-neutral-50'
              }`}
            >
              <Archive className="h-4 w-4" />
              <span>All Files</span>
              <span className="ml-auto text-sm text-fm-neutral-500">{files.length}</span>
            </button>
            
            {folders.map((folder) => {
              const folderCount = files.filter(f => f.folder === folder).length;
              return (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedFolder === folder 
                      ? 'bg-fm-magenta-50 text-fm-magenta-700' 
                      : 'text-fm-neutral-700 hover:bg-fm-neutral-50'
                  }`}
                >
                  <Folder className="h-4 w-4" />
                  <span>{folder}</span>
                  <span className="ml-auto text-sm text-fm-neutral-500">{folderCount}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-fm-neutral-200">
            <h4 className="font-medium text-fm-neutral-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-fm-neutral-700 hover:bg-fm-neutral-50 rounded-lg">
                <Star className="h-4 w-4" />
                <span>Starred</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-fm-neutral-700 hover:bg-fm-neutral-50 rounded-lg">
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-fm-neutral-700 hover:bg-fm-neutral-50 rounded-lg">
                <Share2 className="h-4 w-4" />
                <span>Shared</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Action Bar */}
          {selectedFiles.length > 0 && (
            <div className="bg-fm-magenta-50 border border-fm-magenta-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-fm-magenta-800 font-medium">
                  {selectedFiles.length} file(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Move className="h-4 w-4 mr-2" />
                    Move
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* File Grid/List */}
          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:shadow-md ${
                      selectedFiles.includes(file.id) 
                        ? 'border-fm-magenta-300 bg-fm-magenta-50' 
                        : 'border-fm-neutral-200 hover:border-fm-magenta-200'
                    }`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {getFileIcon(file.type, 'lg')}
                      <div className="flex items-center space-x-2">
                        {file.isStarred && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        <button className="p-1 hover:bg-fm-neutral-100 rounded">
                          <MoreVertical className="h-4 w-4 text-fm-neutral-400" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-fm-neutral-900 truncate mb-1">
                      {file.name}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-fm-neutral-500 mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span>v{file.version}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {file.status && getStatusBadge(file.status)}
                      <span className="text-xs text-fm-neutral-500">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-fm-neutral-100 text-fm-neutral-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 2 && (
                          <span className="px-2 py-1 bg-fm-neutral-100 text-fm-neutral-600 text-xs rounded">
                            +{file.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedFiles.includes(file.id) 
                        ? 'bg-fm-magenta-50 border border-fm-magenta-200' 
                        : 'hover:bg-fm-neutral-50'
                    }`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {getFileIcon(file.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-fm-neutral-900 truncate">
                            {file.name}
                          </h4>
                          {file.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                          {file.status && getStatusBadge(file.status)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-fm-neutral-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span>Modified {new Date(file.uploadedAt).toLocaleDateString()}</span>
                          <span>by {file.uploadedBy}</span>
                          {file.folder && <span>in {file.folder}</span>}
                        </div>
                        
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-fm-neutral-100 text-fm-neutral-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <button className="p-2 hover:bg-fm-neutral-100 rounded">
                        <MoreVertical className="h-4 w-4 text-fm-neutral-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
                <h4 className="font-semibold text-fm-neutral-900 mb-2">No files found</h4>
                <p className="text-fm-neutral-600 mb-6">
                  {searchQuery || filterType !== 'all' || selectedFolder !== 'All Files'
                    ? 'Try adjusting your search or filters'
                    : 'Upload your first files to get started'}
                </p>
                <Button onClick={() => setShowUploadModal(true)} icon={<Upload className="h-4 w-4" />}>
                  Upload Files
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}