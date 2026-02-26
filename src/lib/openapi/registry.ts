/**
 * OpenAPI route metadata registry.
 * Registers all admin API routes with their metadata for spec generation.
 */

export interface RouteParam {
  name: string;
  in: 'query' | 'path' | 'header';
  required?: boolean;
  description: string;
  schema: Record<string, unknown>;
}

export interface RouteSchema {
  type?: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: Record<string, unknown>;
  description?: string;
}

export interface RouteEntry {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  summary: string;
  description?: string;
  tags: string[];
  parameters?: RouteParam[];
  requestBody?: {
    description?: string;
    content: Record<string, { schema: RouteSchema }>;
  };
  responses: Record<string, {
    description: string;
    content?: Record<string, { schema: RouteSchema }>;
  }>;
  security?: Array<Record<string, string[]>>;
}

const registry: RouteEntry[] = [];

export function registerRoute(entry: RouteEntry): void {
  registry.push(entry);
}

export function getRoutes(): RouteEntry[] {
  return registry;
}

// ---------------------------------------------------------------------------
// Register all admin API routes
// ---------------------------------------------------------------------------

const bearerAuth = [{ BearerAuth: [] }];

const successResponse = (desc: string, schema?: RouteSchema) => ({
  '200': {
    description: desc,
    ...(schema ? { content: { 'application/json': { schema } } } : {}),
  },
  '401': { description: 'Authentication required' },
  '403': { description: 'Insufficient permissions' },
  '429': { description: 'Rate limit exceeded' },
});

// --- Clients ---
registerRoute({
  path: '/api/clients',
  method: 'get',
  summary: 'List all clients',
  tags: ['Clients'],
  security: bearerAuth,
  responses: successResponse('Client list'),
});

registerRoute({
  path: '/api/clients',
  method: 'post',
  summary: 'Create a new client',
  tags: ['Clients'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            industry: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'prospect', 'churned'] },
          },
        },
      },
    },
  },
  responses: successResponse('Client created'),
});

registerRoute({
  path: '/api/clients',
  method: 'put',
  summary: 'Update a client',
  tags: ['Clients'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
  },
  responses: successResponse('Client updated'),
});

// --- Projects ---
registerRoute({
  path: '/api/projects',
  method: 'get',
  summary: 'List all projects',
  tags: ['Projects'],
  security: bearerAuth,
  parameters: [
    { name: 'id', in: 'query', description: 'Fetch single project by ID', schema: { type: 'string' } },
  ],
  responses: successResponse('Project list'),
});

registerRoute({
  path: '/api/projects',
  method: 'post',
  summary: 'Create a new project',
  tags: ['Projects'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['clientId', 'name', 'type', 'startDate', 'endDate', 'projectManager', 'budget'],
          properties: {
            clientId: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            projectManager: { type: 'string' },
            budget: { type: 'number' },
          },
        },
      },
    },
  },
  responses: successResponse('Project created'),
});

// --- Content ---
registerRoute({
  path: '/api/content',
  method: 'get',
  summary: 'List content calendar items',
  tags: ['Content'],
  security: bearerAuth,
  parameters: [
    { name: 'id', in: 'query', description: 'Fetch single content item', schema: { type: 'string' } },
    { name: 'page', in: 'query', description: 'Page number', schema: { type: 'integer' } },
    { name: 'pageSize', in: 'query', description: 'Items per page', schema: { type: 'integer' } },
    { name: 'status', in: 'query', description: 'Filter by status', schema: { type: 'string' } },
    { name: 'platform', in: 'query', description: 'Filter by platform', schema: { type: 'string' } },
  ],
  responses: successResponse('Content list'),
});

registerRoute({
  path: '/api/content',
  method: 'post',
  summary: 'Create a content item',
  tags: ['Content'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['projectId', 'title', 'type', 'platform', 'scheduledDate'],
          properties: {
            projectId: { type: 'string' },
            title: { type: 'string' },
            type: { type: 'string' },
            platform: { type: 'string' },
            scheduledDate: { type: 'string' },
          },
        },
      },
    },
  },
  responses: successResponse('Content created'),
});

// --- Invoices ---
registerRoute({
  path: '/api/invoices',
  method: 'get',
  summary: 'List all invoices',
  tags: ['Invoices'],
  security: bearerAuth,
  responses: successResponse('Invoice list'),
});

registerRoute({
  path: '/api/invoices',
  method: 'post',
  summary: 'Create an invoice',
  tags: ['Invoices'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            invoiceNumber: { type: 'string' },
            client: { type: 'object' },
            lineItems: { type: 'array', items: { type: 'object' } },
            total: { type: 'number' },
            status: { type: 'string', enum: ['draft', 'sent', 'paid', 'overdue'] },
          },
        },
      },
    },
  },
  responses: successResponse('Invoice created'),
});

// --- Proposals ---
registerRoute({
  path: '/api/proposals',
  method: 'get',
  summary: 'List all proposals',
  tags: ['Proposals'],
  security: bearerAuth,
  responses: successResponse('Proposal list'),
});

registerRoute({
  path: '/api/proposals',
  method: 'post',
  summary: 'Create a proposal',
  tags: ['Proposals'],
  security: bearerAuth,
  responses: successResponse('Proposal created'),
});

// --- Contracts ---
registerRoute({
  path: '/api/contracts',
  method: 'get',
  summary: 'List all contracts',
  tags: ['Contracts'],
  security: bearerAuth,
  responses: successResponse('Contract list'),
});

registerRoute({
  path: '/api/contracts',
  method: 'post',
  summary: 'Create a contract',
  tags: ['Contracts'],
  security: bearerAuth,
  responses: successResponse('Contract created'),
});

// --- Team ---
registerRoute({
  path: '/api/team',
  method: 'get',
  summary: 'List team members',
  tags: ['Team'],
  security: bearerAuth,
  responses: successResponse('Team member list'),
});

registerRoute({
  path: '/api/team',
  method: 'post',
  summary: 'Add a team member',
  tags: ['Team'],
  security: bearerAuth,
  responses: successResponse('Team member created'),
});

// --- Leads ---
registerRoute({
  path: '/api/leads',
  method: 'get',
  summary: 'List all leads',
  tags: ['Leads'],
  security: bearerAuth,
  responses: successResponse('Lead list'),
});

registerRoute({
  path: '/api/leads/analytics',
  method: 'get',
  summary: 'Get lead analytics',
  tags: ['Leads'],
  security: bearerAuth,
  responses: successResponse('Lead analytics'),
});

// --- Support Tickets ---
registerRoute({
  path: '/api/admin/support',
  method: 'get',
  summary: 'List support tickets',
  tags: ['Support'],
  security: bearerAuth,
  responses: successResponse('Support ticket list'),
});

// --- Notifications ---
registerRoute({
  path: '/api/admin/notifications',
  method: 'get',
  summary: 'List notifications',
  tags: ['Notifications'],
  security: bearerAuth,
  responses: successResponse('Notification list'),
});

// --- API Keys ---
registerRoute({
  path: '/api/admin/api-keys',
  method: 'get',
  summary: 'List API keys',
  tags: ['API Keys'],
  security: bearerAuth,
  responses: successResponse('API key list'),
});

registerRoute({
  path: '/api/admin/api-keys',
  method: 'post',
  summary: 'Create an API key',
  tags: ['API Keys'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name', 'permissions'],
          properties: {
            name: { type: 'string' },
            permissions: { type: 'array', items: { type: 'string' } },
            rate_limit: { type: 'integer', description: 'Requests per minute (default: 60)' },
            expires_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  responses: successResponse('API key created (key shown once)'),
});

// --- Webhooks ---
registerRoute({
  path: '/api/webhooks/{provider}',
  method: 'post',
  summary: 'Receive incoming webhook',
  tags: ['Webhooks'],
  parameters: [
    { name: 'provider', in: 'path', required: true, description: 'Webhook provider (stripe, github, generic)', schema: { type: 'string' } },
  ],
  responses: {
    '200': { description: 'Webhook received' },
    '400': { description: 'Invalid signature' },
  },
});

// --- Outgoing Webhooks ---
registerRoute({
  path: '/api/admin/webhooks',
  method: 'get',
  summary: 'List outgoing webhooks',
  tags: ['Outgoing Webhooks'],
  security: bearerAuth,
  responses: successResponse('Webhook list'),
});

registerRoute({
  path: '/api/admin/webhooks',
  method: 'post',
  summary: 'Create an outgoing webhook',
  tags: ['Outgoing Webhooks'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name', 'url', 'events'],
          properties: {
            name: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            events: { type: 'array', items: { type: 'string' } },
            secret: { type: 'string' },
          },
        },
      },
    },
  },
  responses: successResponse('Webhook created'),
});

// --- MCP ---
registerRoute({
  path: '/api/mcp',
  method: 'post',
  summary: 'MCP JSON-RPC endpoint',
  description: 'Model Context Protocol endpoint. Supports initialize, tools/list, tools/call methods.',
  tags: ['MCP'],
  security: bearerAuth,
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['jsonrpc', 'method'],
          properties: {
            jsonrpc: { type: 'string', enum: ['2.0'] },
            id: { type: 'integer' },
            method: { type: 'string', enum: ['initialize', 'tools/list', 'tools/call'] },
            params: { type: 'object' },
          },
        },
      },
    },
  },
  responses: {
    '200': { description: 'JSON-RPC response' },
    '401': { description: 'Authentication required' },
  },
});
