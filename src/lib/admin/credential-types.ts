/**
 * Client credential types and platform presets.
 * Credentials are AES-256-CBC encrypted at rest — see token-crypto.ts.
 */

// ────────────────────────────────────────────────────────────
// Database row shape
// ────────────────────────────────────────────────────────────

export interface ClientCredential {
  id: string;
  client_id: string;
  platform: string;
  credential_type: CredentialType;
  label: string | null;
  /** Encrypted JSON blob (server-side only) */
  credentials: string;
  status: CredentialStatus;
  notes: string | null;
  added_by: string;
  created_at: string;
  updated_at: string;
}

/** What the frontend sees — credentials are masked */
export interface ClientCredentialMasked {
  id: string;
  client_id: string;
  platform: string;
  credential_type: CredentialType;
  label: string | null;
  /** e.g. { username: "john@example.com", password: "••••••d123" } */
  credentials_masked: Record<string, string>;
  status: CredentialStatus;
  notes: string | null;
  added_by: string;
  created_at: string;
  updated_at: string;
}

export type CredentialStatus = 'active' | 'expired' | 'revoked';
export type CredentialType = 'login' | 'oauth_token' | 'api_key' | 'app_credentials';

// ────────────────────────────────────────────────────────────
// Platform presets
// ────────────────────────────────────────────────────────────

export interface PlatformField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url';
  placeholder?: string;
  required?: boolean;
}

export interface PlatformPreset {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  credentialTypes: {
    type: CredentialType;
    label: string;
    fields: PlatformField[];
  }[];
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'google_ads',
    name: 'Google Ads',
    icon: 'Search',
    color: 'bg-blue-100 text-blue-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email', type: 'text', placeholder: 'ads@company.com', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'customer_id', label: 'Customer ID', type: 'text', placeholder: '123-456-7890' },
        ],
      },
      {
        type: 'oauth_token',
        label: 'OAuth / API Token',
        fields: [
          { key: 'client_id', label: 'Client ID', type: 'text', required: true },
          { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
          { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
          { key: 'developer_token', label: 'Developer Token', type: 'password' },
        ],
      },
    ],
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    icon: 'BarChart3',
    color: 'bg-orange-100 text-orange-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email', type: 'text', placeholder: 'analytics@company.com', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'property_id', label: 'Property ID (GA4)', type: 'text', placeholder: '123456789' },
        ],
      },
    ],
  },
  {
    id: 'google_search_console',
    name: 'Search Console',
    icon: 'Globe',
    color: 'bg-green-100 text-green-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'site_url', label: 'Site URL', type: 'url', placeholder: 'https://example.com' },
        ],
      },
    ],
  },
  {
    id: 'google_my_business',
    name: 'Google Business Profile',
    icon: 'MapPin',
    color: 'bg-blue-100 text-blue-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'business_name', label: 'Business Name', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    icon: 'Facebook',
    color: 'bg-indigo-100 text-indigo-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email / Phone', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'page_name', label: 'Page Name', type: 'text' },
        ],
      },
      {
        type: 'app_credentials',
        label: 'App Credentials',
        fields: [
          { key: 'app_id', label: 'App ID', type: 'text', required: true },
          { key: 'app_secret', label: 'App Secret', type: 'password', required: true },
          { key: 'page_access_token', label: 'Page Access Token', type: 'password' },
        ],
      },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    color: 'bg-pink-100 text-pink-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'username', label: 'Username', type: 'text', placeholder: '@handle', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
    ],
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: 'Twitter',
    color: 'bg-neutral-100 text-neutral-800',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'username', label: 'Username / Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
      {
        type: 'api_key',
        label: 'API Keys',
        fields: [
          { key: 'api_key', label: 'API Key', type: 'password', required: true },
          { key: 'api_secret', label: 'API Secret', type: 'password', required: true },
          { key: 'access_token', label: 'Access Token', type: 'password', required: true },
          { key: 'access_token_secret', label: 'Access Token Secret', type: 'password', required: true },
        ],
      },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'Linkedin',
    color: 'bg-sky-100 text-sky-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'company_page', label: 'Company Page URL', type: 'url' },
        ],
      },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Music',
    color: 'bg-neutral-100 text-neutral-800',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
      {
        type: 'app_credentials',
        label: 'TikTok for Business',
        fields: [
          { key: 'app_id', label: 'App ID', type: 'text', required: true },
          { key: 'app_secret', label: 'App Secret', type: 'password', required: true },
          { key: 'access_token', label: 'Access Token', type: 'password' },
        ],
      },
    ],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'Pin',
    color: 'bg-red-100 text-red-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    color: 'bg-red-100 text-red-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'email', label: 'Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'channel_url', label: 'Channel URL', type: 'url' },
        ],
      },
    ],
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: 'Globe',
    color: 'bg-blue-100 text-blue-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'site_url', label: 'Site URL', type: 'url', placeholder: 'https://example.com/wp-admin', required: true },
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
    ],
  },
  {
    id: 'hosting',
    name: 'Hosting / cPanel',
    icon: 'Server',
    color: 'bg-emerald-100 text-emerald-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'panel_url', label: 'Panel URL', type: 'url', placeholder: 'https://cpanel.example.com', required: true },
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
    ],
  },
  {
    id: 'domain_registrar',
    name: 'Domain Registrar',
    icon: 'Globe',
    color: 'bg-amber-100 text-amber-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'registrar', label: 'Registrar Name', type: 'text', placeholder: 'GoDaddy, Namecheap, etc.' },
          { key: 'login_url', label: 'Login URL', type: 'url' },
          { key: 'username', label: 'Username / Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
    ],
  },
  {
    id: 'custom',
    name: 'Other / Custom',
    icon: 'Key',
    color: 'bg-fm-neutral-100 text-fm-neutral-700',
    credentialTypes: [
      {
        type: 'login',
        label: 'Login Credentials',
        fields: [
          { key: 'service_name', label: 'Service Name', type: 'text', required: true },
          { key: 'login_url', label: 'Login URL', type: 'url' },
          { key: 'username', label: 'Username / Email', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
        ],
      },
      {
        type: 'api_key',
        label: 'API Key',
        fields: [
          { key: 'service_name', label: 'Service Name', type: 'text', required: true },
          { key: 'api_key', label: 'API Key', type: 'password', required: true },
          { key: 'api_secret', label: 'API Secret (if any)', type: 'password' },
          { key: 'endpoint', label: 'API Endpoint', type: 'url' },
        ],
      },
    ],
  },
];

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

export function getPlatformPreset(platformId: string): PlatformPreset | undefined {
  return PLATFORM_PRESETS.find((p) => p.id === platformId);
}

/** Mask a credential value — show last 4 chars only */
export function maskValue(value: string): string {
  if (!value) return '';
  if (value.length <= 4) return '****';
  return '****' + value.slice(-4);
}

/** Mask all values in a credentials object */
export function maskCredentials(creds: Record<string, string>): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [key, value] of Object.entries(creds)) {
    // Don't mask non-sensitive fields
    if (['service_name', 'registrar', 'business_name', 'page_name', 'channel_url', 'company_page', 'site_url', 'panel_url', 'login_url', 'endpoint'].includes(key)) {
      masked[key] = value;
    } else {
      masked[key] = maskValue(value);
    }
  }
  return masked;
}

export function getPlatformColor(platformId: string): string {
  return getPlatformPreset(platformId)?.color || 'bg-fm-neutral-100 text-fm-neutral-700';
}

export function getPlatformName(platformId: string): string {
  return getPlatformPreset(platformId)?.name || platformId;
}
