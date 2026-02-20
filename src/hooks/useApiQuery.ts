/**
 * React Query hooks for all API resources.
 *
 * Usage:
 *   const { data, isLoading, error } = useClients();
 *   const { mutate: createClient } = useCreateClient();
 *
 * All query hooks return typed data with loading/error states.
 * All mutation hooks handle toast feedback automatically via the api layer.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type ListParams } from '@/lib/api';

// ---------------------------------------------------------------------------
// Query key factory — ensures consistent cache invalidation
// ---------------------------------------------------------------------------

export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    detail: (id: string) => ['clients', id] as const,
  },
  projects: {
    all: ['projects'] as const,
    list: (params?: ListParams) => ['projects', 'list', params] as const,
    detail: (id: string) => ['projects', id] as const,
    byClient: (clientId: string) => ['projects', 'client', clientId] as const,
  },
  content: {
    all: ['content'] as const,
    list: (params?: ListParams & { clientId?: string }) => ['content', 'list', params] as const,
    detail: (id: string) => ['content', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    detail: (id: string) => ['invoices', id] as const,
  },
  proposals: {
    all: ['proposals'] as const,
  },
  team: {
    all: ['team'] as const,
    detail: (id: string) => ['team', id] as const,
    assignments: (params?: { teamMemberId?: string; clientId?: string }) =>
      ['team', 'assignments', params] as const,
  },
  leads: {
    all: ['leads'] as const,
    list: (params?: ListParams) => ['leads', 'list', params] as const,
    analytics: (type: string) => ['leads', 'analytics', type] as const,
  },
  discovery: {
    all: ['discovery'] as const,
    detail: (id: string) => ['discovery', id] as const,
    byClient: (clientId: string) => ['discovery', 'client', clientId] as const,
  },
  talent: {
    all: ['talent'] as const,
    detail: (slug: string) => ['talent', slug] as const,
  },
  support: {
    all: ['support'] as const,
  },
  users: {
    all: ['users'] as const,
  },
  audit: {
    list: (params?: { limit?: number; resource_type?: string; action?: string }) =>
      ['audit', params] as const,
  },
} as const;

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export function useClients() {
  return useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: () => api.clients.list(),
    select: (res) => res.data,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => api.clients.get(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.clients.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clients.all }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.clients.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clients.all }),
  });
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function useProjects(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => api.projects.list(params),
    select: (res) => res.data,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => api.projects.get(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useProjectsByClient(clientId: string) {
  return useQuery({
    queryKey: queryKeys.projects.byClient(clientId),
    queryFn: () => api.projects.listByClient(clientId),
    select: (res) => res.data,
    enabled: !!clientId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.projects.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.projects.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.projects.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export function useContent(params?: ListParams & { clientId?: string }) {
  return useQuery({
    queryKey: queryKeys.content.list(params),
    queryFn: () => api.content.list(params),
    select: (res) => res.data,
  });
}

export function useContentItem(id: string) {
  return useQuery({
    queryKey: queryKeys.content.detail(id),
    queryFn: () => api.content.get(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.content.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.all }),
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.content.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.all }),
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.content.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.all }),
  });
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices.all,
    queryFn: () => api.invoices.list(),
    select: (res) => res.data,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => api.invoices.get(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.invoices.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.invoices.all }),
  });
}

// ---------------------------------------------------------------------------
// Proposals
// ---------------------------------------------------------------------------

export function useProposals() {
  return useQuery({
    queryKey: queryKeys.proposals.all,
    queryFn: () => api.proposals.list(),
    select: (res) => res.data,
  });
}

export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.proposals.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.proposals.all }),
  });
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export function useTeam() {
  return useQuery({
    queryKey: queryKeys.team.all,
    queryFn: () => api.team.list(),
    select: (res) => res.data,
  });
}

export function useTeamMember(id: string) {
  return useQuery({
    queryKey: queryKeys.team.detail(id),
    queryFn: () => api.team.get(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.team.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.team.all }),
  });
}

export function useUpdateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.team.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.team.all }),
  });
}

export function useTeamAssignments(params?: { teamMemberId?: string; clientId?: string }) {
  return useQuery({
    queryKey: queryKeys.team.assignments(params),
    queryFn: () => api.team.assignments.list(params),
    select: (res) => res.data,
    enabled: !!(params?.teamMemberId || params?.clientId),
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.team.assignments.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.team.assignments.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  });
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export function useLeads(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.leads.list(params),
    queryFn: () => api.leads.list(params),
    select: (res) => res.data,
  });
}

export function useLeadAnalytics(type: 'full' | 'dashboard' = 'full') {
  return useQuery({
    queryKey: queryKeys.leads.analytics(type),
    queryFn: () => api.leads.analytics(type),
    select: (res) => res.data,
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; status: string }) => api.leads.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.leads.all }),
  });
}

export function useConvertLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.leads.convert,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.leads.all });
      qc.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

export function useDiscoverySessions() {
  return useQuery({
    queryKey: queryKeys.discovery.all,
    queryFn: () => api.discovery.list(),
    select: (res) => res.data,
  });
}

export function useDiscoverySession(id: string) {
  return useQuery({
    queryKey: queryKeys.discovery.detail(id),
    queryFn: () => api.discovery.get(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// Talent
// ---------------------------------------------------------------------------

export function useTalentApplications() {
  return useQuery({
    queryKey: queryKeys.talent.all,
    queryFn: () => api.talent.list(),
    select: (res) => res.data,
  });
}

// ---------------------------------------------------------------------------
// Support
// ---------------------------------------------------------------------------

export function useSupportTickets(params?: { clientId?: string }) {
  return useQuery({
    queryKey: queryKeys.support.all,
    queryFn: () => api.support.list(params),
    select: (res) => res.data,
  });
}

export function useUpdateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.support.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.support.all }),
  });
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export function useAuthorizedUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => api.users.list(),
    select: (res) => res.data,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.users.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.users.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.users.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export function useAuditLog(params?: { limit?: number; resource_type?: string; action?: string }) {
  return useQuery({
    queryKey: queryKeys.audit.list(params),
    queryFn: () => api.audit.list(params),
    select: (res) => res.entries,
  });
}
