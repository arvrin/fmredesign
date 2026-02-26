/**
 * MCP JSON-RPC 2.0 request handler.
 * Implements the Model Context Protocol for tool-based interactions.
 */

import { TOOL_DEFINITIONS, executeTool } from './tools';
import type { ValidatedApiKey } from '@/lib/api-key-auth';
import { PermissionService } from '@/lib/admin/permissions';

// ---------------------------------------------------------------------------
// JSON-RPC types
// ---------------------------------------------------------------------------

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: number | string;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id?: number | string;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

// Tool name → minimum required permission
const TOOL_PERMISSIONS: Record<string, string> = {
  list_clients: 'clients.read',
  get_client: 'clients.read',
  list_projects: 'projects.read',
  get_project: 'projects.read',
  list_invoices: 'finance.read',
  list_proposals: 'finance.read',
  list_content: 'content.read',
  update_content_status: 'content.write',
  list_tickets: 'clients.read',
  create_ticket: 'clients.write',
  get_notifications: 'system.view_analytics',
};

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function handleMCPRequest(
  body: JsonRpcRequest,
  apiKey: ValidatedApiKey
): Promise<JsonRpcResponse> {
  const { id, method, params } = body;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'freakingminds-mcp',
            version: '1.0.0',
          },
        },
      };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOL_DEFINITIONS },
      };

    case 'tools/call': {
      const toolName = params?.name as string;
      const toolArgs = (params?.arguments as Record<string, unknown>) || {};

      if (!toolName) {
        return rpcError(id, -32602, 'Missing tool name');
      }

      // Permission check
      const requiredPermission = TOOL_PERMISSIONS[toolName];
      if (requiredPermission && !PermissionService.hasPermission(apiKey.user.permissions, requiredPermission)) {
        return rpcError(id, -32603, `Insufficient permissions for tool "${toolName}". Required: ${requiredPermission}`);
      }

      const result = await executeTool(toolName, toolArgs);
      return { jsonrpc: '2.0', id, result };
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

function rpcError(id: number | string | undefined, code: number, message: string): JsonRpcResponse {
  return { jsonrpc: '2.0', id, error: { code, message } };
}
