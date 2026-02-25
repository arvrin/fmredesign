/**
 * Google Drive API types
 */

export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export interface UploadResult {
  fileId: string;
  webViewLink: string;
  size: number;
  mimeType: string;
  name: string;
}

export interface DriveApiError {
  code: number;
  message: string;
  status?: string;
}
