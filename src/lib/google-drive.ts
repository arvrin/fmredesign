/**
 * Google Drive REST API v3 client
 * Raw fetch-based (no googleapis npm package) — same pattern as src/lib/social/meta-api.ts
 *
 * Uses the existing service account for Drive API access.
 */

import crypto from 'crypto';
import type { DriveFileMetadata, UploadResult } from './google-drive.types';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/drive';

// Simple upload threshold — above this we use resumable
const SIMPLE_UPLOAD_LIMIT = 5 * 1024 * 1024; // 5 MB

// ─────────────────────────────────────────────────────────
// Token cache
// ─────────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

function getCredentials() {
  const email =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  let rawKey =
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  // Support base64-encoded key (Vercel-safe: set GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 instead)
  if (!rawKey && process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64) {
    rawKey = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8');
  }

  if (!email || !rawKey) {
    throw new Error(
      'Google service account credentials not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY in .env.local'
    );
  }

  // Handle escaped newlines from env
  const privateKey = rawKey.replace(/\\n/g, '\n');
  return { email, privateKey };
}

function getRootFolderId(): string {
  const id = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!id) {
    throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID is not configured');
  }
  return id;
}

// ─────────────────────────────────────────────────────────
// JWT-based service account auth
// ─────────────────────────────────────────────────────────

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64url');
}

export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (>60s remaining)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const { email, privateKey } = getCredentials();
  const impersonateEmail = process.env.GOOGLE_DRIVE_IMPERSONATE_EMAIL;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));

  // Build JWT claims — if impersonateEmail is set, service account acts as that user
  // (required because service accounts have no storage quota)
  const claims: Record<string, unknown> = {
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600, // 1 hour
  };
  if (impersonateEmail) {
    claims.sub = impersonateEmail;
  }

  const payload = base64url(JSON.stringify(claims));

  const signInput = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  const signature = signer.sign(privateKey, 'base64url');

  const jwt = `${signInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get access token: ${res.status} ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return cachedToken.token;
}

// ─────────────────────────────────────────────────────────
// Drive API helpers
// ─────────────────────────────────────────────────────────

async function driveRequest(
  path: string,
  opts: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken();
  const url = path.startsWith('http') ? path : `${DRIVE_API}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      ...opts.headers,
    },
  });
  return res;
}

// ─────────────────────────────────────────────────────────
// Folder operations
// ─────────────────────────────────────────────────────────

export async function createFolder(
  name: string,
  parentId: string
): Promise<string> {
  const res = await driveRequest('/files?fields=id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create folder "${name}": ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.id;
}

/**
 * Idempotent: creates client folder + sub-folders under root if not cached.
 * Returns the client's root Drive folder ID.
 */
export async function ensureClientFolder(
  clientId: string,
  clientName: string,
  existingDriveFolderId?: string | null
): Promise<string> {
  // Already have a folder — verify it exists
  if (existingDriveFolderId) {
    const check = await driveRequest(
      `/files/${existingDriveFolderId}?fields=id,trashed`
    );
    if (check.ok) {
      const data = await check.json();
      if (!data.trashed) return existingDriveFolderId;
    }
    // Folder was trashed or gone — create a new one
  }

  const rootId = getRootFolderId();

  // Check if folder already exists (by name query)
  const q = encodeURIComponent(
    `name = '${clientName.replace(/'/g, "\\'")}' and '${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await driveRequest(`/files?q=${q}&fields=files(id)`);

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
  }

  // Create client root folder
  const clientFolderId = await createFolder(clientName, rootId);

  // Create sub-folders
  const subFolders = [
    'Brand Assets',
    'Campaign Materials',
    'Reports',
    'Contracts',
    'Invoices',
    'Design',
    'Client Uploads',
    'General',
  ];

  await Promise.all(subFolders.map((name) => createFolder(name, clientFolderId)));

  return clientFolderId;
}

// ─────────────────────────────────────────────────────────
// File upload
// ─────────────────────────────────────────────────────────

export async function uploadFile(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folderId: string;
}): Promise<UploadResult> {
  const { buffer, fileName, mimeType, folderId } = params;

  if (buffer.length <= SIMPLE_UPLOAD_LIMIT) {
    return simpleUpload(buffer, fileName, mimeType, folderId);
  }
  return resumableUpload(buffer, fileName, mimeType, folderId);
}

async function simpleUpload(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string
): Promise<UploadResult> {
  const token = await getAccessToken();

  const metadata = JSON.stringify({
    name: fileName,
    parents: [folderId],
  });

  const boundary = '-------314159265358979323846';
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`
    ),
    buffer,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const res = await fetch(
    `${UPLOAD_API}/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': String(body.length),
      },
      body,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Simple upload failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return {
    fileId: data.id,
    webViewLink: data.webViewLink || '',
    size: Number(data.size) || buffer.length,
    mimeType: data.mimeType || mimeType,
    name: data.name || fileName,
  };
}

async function resumableUpload(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string
): Promise<UploadResult> {
  const token = await getAccessToken();

  // Step 1: Initiate resumable session
  const initRes = await fetch(
    `${UPLOAD_API}/files?uploadType=resumable&fields=id,name,mimeType,size,webViewLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': mimeType,
        'X-Upload-Content-Length': String(buffer.length),
      },
      body: JSON.stringify({
        name: fileName,
        parents: [folderId],
      }),
    }
  );

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`Resumable upload init failed: ${initRes.status} ${err}`);
  }

  const uploadUri = initRes.headers.get('Location');
  if (!uploadUri) {
    throw new Error('No upload URI returned from resumable init');
  }

  // Step 2: Upload the file content
  const uploadRes = await fetch(uploadUri, {
    method: 'PUT',
    headers: {
      'Content-Length': String(buffer.length),
      'Content-Type': mimeType,
    },
    body: new Uint8Array(buffer),
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Resumable upload failed: ${uploadRes.status} ${err}`);
  }

  const data = await uploadRes.json();
  return {
    fileId: data.id,
    webViewLink: data.webViewLink || '',
    size: Number(data.size) || buffer.length,
    mimeType: data.mimeType || mimeType,
    name: data.name || fileName,
  };
}

// ─────────────────────────────────────────────────────────
// File operations
// ─────────────────────────────────────────────────────────

export async function downloadFile(
  fileId: string
): Promise<{ stream: ReadableStream; mimeType: string; fileName: string }> {
  // First get metadata
  const metaRes = await driveRequest(
    `/files/${fileId}?fields=name,mimeType`
  );
  if (!metaRes.ok) {
    throw new Error(`Failed to get file metadata: ${metaRes.status}`);
  }
  const meta = await metaRes.json();

  // Then download
  const dlRes = await driveRequest(`/files/${fileId}?alt=media`);
  if (!dlRes.ok) {
    throw new Error(`Failed to download file: ${dlRes.status}`);
  }

  if (!dlRes.body) {
    throw new Error('No response body from Drive download');
  }

  return {
    stream: dlRes.body,
    mimeType: meta.mimeType || 'application/octet-stream',
    fileName: meta.name || 'download',
  };
}

export async function deleteFile(fileId: string): Promise<void> {
  const res = await driveRequest(`/files/${fileId}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) {
    const err = await res.text();
    throw new Error(`Failed to delete file: ${res.status} ${err}`);
  }
}

export async function getFileMetadata(
  fileId: string
): Promise<DriveFileMetadata> {
  const res = await driveRequest(
    `/files/${fileId}?fields=id,name,mimeType,size,webViewLink,createdTime,modifiedTime`
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to get file metadata: ${res.status} ${err}`);
  }
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    size: Number(data.size) || 0,
    webViewLink: data.webViewLink,
    createdTime: data.createdTime,
    modifiedTime: data.modifiedTime,
  };
}

/**
 * Find a sub-folder by name inside a parent folder.
 * Returns the folder ID or null if not found.
 */
export async function findSubFolder(
  parentId: string,
  folderName: string
): Promise<string | null> {
  const q = encodeURIComponent(
    `name = '${folderName.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const res = await driveRequest(`/files?q=${q}&fields=files(id)`);
  if (!res.ok) return null;

  const data = await res.json();
  return data.files?.[0]?.id || null;
}
