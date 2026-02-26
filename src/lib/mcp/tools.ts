/**
 * MCP tool definitions and implementations.
 * Each tool maps to existing Supabase query patterns from admin API routes.
 */

import { getSupabaseAdmin } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Tool schema type
// ---------------------------------------------------------------------------

export interface MCPToolDef {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface MCPToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

export const TOOL_DEFINITIONS: MCPToolDef[] = [
  {
    name: 'list_clients',
    description: 'List all clients with optional status filter',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Filter by status: active, inactive, prospect, churned' },
        limit: { type: 'number', description: 'Max results (default: 50)' },
      },
    },
  },
  {
    name: 'get_client',
    description: 'Get a single client by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Client UUID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_projects',
    description: 'List all projects with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Filter by client ID' },
        status: { type: 'string', description: 'Filter by status' },
        limit: { type: 'number', description: 'Max results (default: 50)' },
      },
    },
  },
  {
    name: 'get_project',
    description: 'Get a single project by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Project UUID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_invoices',
    description: 'List invoices with optional status filter',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Filter by status: draft, sent, paid, overdue' },
        client_id: { type: 'string', description: 'Filter by client ID' },
        limit: { type: 'number', description: 'Max results (default: 50)' },
      },
    },
  },
  {
    name: 'list_proposals',
    description: 'List proposals with optional status filter',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Filter by status' },
        limit: { type: 'number', description: 'Max results (default: 50)' },
      },
    },
  },
  {
    name: 'list_content',
    description: 'List content calendar items',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Filter by status' },
        platform: { type: 'string', description: 'Filter by platform' },
        limit: { type: 'number', description: 'Max results (default: 50)' },
      },
    },
  },
  {
    name: 'update_content_status',
    description: 'Update the status of a content item',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Content item UUID' },
        status: { type: 'string', description: 'New status value' },
      },
      required: ['id', 'status'],
    },
  },
  {
    name: 'list_tickets',
    description: 'List support tickets',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Filter by status' },
        priority: { type: 'string', description: 'Filter by priority' },
        limit: { type: 'number', description: 'Max results (default: 50)' },
      },
    },
  },
  {
    name: 'create_ticket',
    description: 'Create a new support ticket',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID' },
        subject: { type: 'string', description: 'Ticket subject' },
        description: { type: 'string', description: 'Ticket description' },
        priority: { type: 'string', description: 'Priority: low, medium, high, urgent' },
        category: { type: 'string', description: 'Ticket category' },
      },
      required: ['client_id', 'subject'],
    },
  },
  {
    name: 'get_notifications',
    description: 'Get recent notifications',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max results (default: 20)' },
        unread_only: { type: 'boolean', description: 'Only return unread notifications' },
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

type ToolArgs = Record<string, unknown>;

const toolHandlers: Record<string, (args: ToolArgs) => Promise<MCPToolResult>> = {
  list_clients: async (args) => {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (args.status) query = query.eq('status', args.status);
    query = query.limit(Number(args.limit) || 50);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  get_client: async (args) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('clients').select('*').eq('id', args.id).single();
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  list_projects: async (args) => {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (args.client_id) query = query.eq('client_id', args.client_id);
    if (args.status) query = query.eq('status', args.status);
    query = query.limit(Number(args.limit) || 50);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  get_project: async (args) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('projects').select('*').eq('id', args.id).single();
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  list_invoices: async (args) => {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (args.status) query = query.eq('status', args.status);
    if (args.client_id) query = query.eq('client_id', args.client_id);
    query = query.limit(Number(args.limit) || 50);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  list_proposals: async (args) => {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('proposals').select('*').order('created_at', { ascending: false });
    if (args.status) query = query.eq('status', args.status);
    query = query.limit(Number(args.limit) || 50);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  list_content: async (args) => {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('content_calendar').select('*').order('scheduled_date', { ascending: false });
    if (args.status) query = query.eq('status', args.status);
    if (args.platform) query = query.eq('platform', args.platform);
    query = query.limit(Number(args.limit) || 50);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  update_content_status: async (args) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('content_calendar')
      .update({ status: args.status })
      .eq('id', args.id)
      .select('id, title, status')
      .single();
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  list_tickets: async (args) => {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    if (args.status) query = query.eq('status', args.status);
    if (args.priority) query = query.eq('priority', args.priority);
    query = query.limit(Number(args.limit) || 50);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  create_ticket: async (args) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        client_id: args.client_id,
        subject: args.subject,
        description: args.description || '',
        priority: args.priority || 'medium',
        category: args.category || 'general',
        status: 'open',
      })
      .select('*')
      .single();
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },

  get_notifications: async (args) => {
    const supabase = getSupabaseAdmin();
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (args.unread_only) query = query.eq('is_read', false);
    query = query.limit(Number(args.limit) || 20);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data, null, 2));
  },
};

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

export async function executeTool(name: string, args: ToolArgs): Promise<MCPToolResult> {
  const handler = toolHandlers[name];
  if (!handler) {
    return errorResult(`Unknown tool: ${name}`);
  }
  try {
    return await handler(args);
  } catch (err) {
    return errorResult(err instanceof Error ? err.message : 'Tool execution failed');
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function textResult(text: string): MCPToolResult {
  return { content: [{ type: 'text', text }] };
}

function errorResult(message: string): MCPToolResult {
  return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
}
