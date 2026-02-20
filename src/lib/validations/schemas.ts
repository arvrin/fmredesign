/**
 * Zod Validation Schemas
 * Shared between API routes (server-side validation) and forms (client-side validation).
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const nonEmptyString = z.string().min(1, 'Required');
const emailField = z.string().email('Invalid email');
const optionalString = z.string().optional();
const optionalEmail = z.string().email('Invalid email').optional().or(z.literal(''));

// ---------------------------------------------------------------------------
// Client schemas
// ---------------------------------------------------------------------------

export const createClientSchema = z.object({
  name: nonEmptyString,
  email: emailField,
  phone: optionalString,
  industry: optionalString,
  website: optionalString,
  address: optionalString,
  city: optionalString,
  state: optionalString,
  zipCode: optionalString,
  country: optionalString,
  gstNumber: optionalString,
  companySize: optionalString,
  status: z.enum(['active', 'inactive', 'prospect', 'churned']).optional(),
  health: z.enum(['excellent', 'good', 'at-risk', 'critical']).optional(),
  accountManager: optionalString,
  contractType: z.enum(['retainer', 'project', 'hourly', 'hybrid']).optional(),
  contractValue: z.union([z.number(), z.string()]).optional(),
  contractEndDate: optionalString,
  billingCycle: z.enum(['monthly', 'quarterly', 'annually', 'milestone']).optional(),
  totalValue: z.union([z.number(), z.string()]).optional(),
  services: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  portalPassword: optionalString,
});

export const updateClientSchema = z.object({
  id: nonEmptyString,
}).catchall(z.unknown());

// ---------------------------------------------------------------------------
// Project schemas
// ---------------------------------------------------------------------------

export const createProjectSchema = z.object({
  clientId: nonEmptyString,
  name: nonEmptyString,
  type: nonEmptyString,
  startDate: nonEmptyString,
  endDate: nonEmptyString,
  projectManager: nonEmptyString,
  budget: z.union([z.number(), z.string()]),
  description: optionalString,
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  estimatedHours: z.number().optional(),
  hourlyRate: z.union([z.number(), z.string()]).optional(),
  discoveryId: optionalString,
  contentRequirements: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
  notes: optionalString,
});

export const updateProjectSchema = z.object({
  id: nonEmptyString,
}).catchall(z.unknown());

// ---------------------------------------------------------------------------
// Content schemas
// ---------------------------------------------------------------------------

export const createContentSchema = z.object({
  projectId: nonEmptyString,
  title: nonEmptyString,
  type: nonEmptyString,
  platform: nonEmptyString,
  scheduledDate: nonEmptyString,
  clientId: optionalString,
  description: optionalString,
  content: optionalString,
  assignedDesigner: optionalString,
  assignedWriter: optionalString,
  hashtags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateContentSchema = z.object({
  id: nonEmptyString,
}).catchall(z.unknown());

// ---------------------------------------------------------------------------
// Team member schemas
// ---------------------------------------------------------------------------

export const createTeamMemberSchema = z.object({
  name: nonEmptyString,
  email: emailField,
  role: nonEmptyString,
  department: nonEmptyString,
  phone: optionalString,
  type: z.enum(['employee', 'freelancer', 'contractor']).optional(),
  status: z.enum(['active', 'inactive', 'on-leave', 'terminated']).optional(),
  seniority: z.enum(['junior', 'mid', 'senior', 'lead', 'director']).optional(),
  workType: z.enum(['full-time', 'part-time', 'contract', 'freelance']).optional(),
  location: z.enum(['office', 'remote', 'hybrid']).optional(),
  capacity: z.number().optional(),
  skills: z.array(z.string()).optional(),
  startDate: optionalString,
  compensation: z.record(z.string(), z.unknown()).optional(),
  notes: optionalString,
});

export const updateTeamMemberSchema = z.object({
  id: nonEmptyString,
}).catchall(z.unknown());

// ---------------------------------------------------------------------------
// User schemas
// ---------------------------------------------------------------------------

export const createUserSchema = z.object({
  name: nonEmptyString,
  email: emailField,
  mobileNumber: nonEmptyString,
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
  notes: optionalString,
});

export const updateUserSchema = z.object({
  id: nonEmptyString,
}).catchall(z.unknown());

// ---------------------------------------------------------------------------
// Invoice schemas
// ---------------------------------------------------------------------------

export const createInvoiceSchema = z.object({
  invoiceNumber: optionalString,
  date: optionalString,
  dueDate: optionalString,
  client: z.object({
    id: optionalString,
    name: optionalString,
    email: optionalEmail,
    phone: optionalString,
    address: optionalString,
    city: optionalString,
    state: optionalString,
    country: optionalString,
    gstNumber: optionalString,
  }).optional(),
  lineItems: z.array(z.object({
    id: optionalString,
    description: z.string(),
    quantity: z.number(),
    rate: z.number(),
    amount: z.number(),
  })).optional(),
  subtotal: z.number().optional(),
  taxRate: z.number().optional(),
  taxAmount: z.number().optional(),
  total: z.number().optional(),
  notes: optionalString,
  terms: optionalString,
  status: z.enum(['draft', 'sent', 'paid', 'overdue']).optional(),
});

export const updateInvoiceSchema = z.object({
  invoiceId: nonEmptyString,
}).catchall(z.unknown());

// ---------------------------------------------------------------------------
// Proposal schemas
// ---------------------------------------------------------------------------

export const createProposalSchema = z.object({
  title: optionalString,
  client: z.object({
    isExisting: z.boolean().optional(),
    clientId: optionalString,
    prospectInfo: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  servicePackages: z.array(z.unknown()).optional(),
  customServices: z.array(z.unknown()).optional(),
  timeline: z.record(z.string(), z.unknown()).optional(),
  investment: z.record(z.string(), z.unknown()).optional(),
  proposalType: z.enum(['project', 'retainer', 'hybrid']).optional(),
  validUntil: optionalString,
  status: z.enum(['draft', 'sent', 'viewed', 'approved', 'declined', 'expired', 'converted']).optional(),
});

export const updateProposalSchema = z.object({
  id: nonEmptyString,
}).catchall(z.unknown());

// ---------------------------------------------------------------------------
// Lead / Get Started form schemas
// ---------------------------------------------------------------------------

export const createLeadSchema = z.object({
  name: nonEmptyString,
  email: emailField,
  company: nonEmptyString,
  projectType: nonEmptyString,
  projectDescription: nonEmptyString,
  budgetRange: nonEmptyString,
  timeline: nonEmptyString,
  primaryChallenge: nonEmptyString,
  companySize: nonEmptyString,
  phone: optionalString,
  website: optionalString,
  jobTitle: optionalString,
  industry: optionalString,
  additionalChallenges: z.array(z.string()).optional(),
  specificRequirements: optionalString,
  source: optionalString,
  customFields: z.record(z.string(), z.unknown()).optional(),
});

// ---------------------------------------------------------------------------
// Discovery session schemas
// ---------------------------------------------------------------------------

export const createDiscoverySchema = z.object({
  action: z.literal('create'),
  session: z.object({
    id: nonEmptyString,
    clientId: nonEmptyString,
    leadId: optionalString,
    status: optionalString,
    currentSection: z.number().optional(),
    completedSections: z.array(z.number()).optional(),
    assignedTo: optionalString,
  }).catchall(z.unknown()),
});

export const updateDiscoverySchema = z.object({
  action: z.literal('update'),
  sessionId: nonEmptyString,
  updates: z.record(z.string(), z.unknown()),
});

// ---------------------------------------------------------------------------
// Talent application schema
// ---------------------------------------------------------------------------

export const submitTalentApplicationSchema = z.object({
  action: z.literal('submit_application'),
  application: z.object({
    personalInfo: z.object({
      fullName: nonEmptyString,
      email: emailField,
      phone: nonEmptyString,
    }).catchall(z.unknown()),
  }).catchall(z.unknown()),
});

// ---------------------------------------------------------------------------
// Contract schemas
// ---------------------------------------------------------------------------

const contractServiceItemSchema = z.object({
  serviceId: optionalString,
  name: nonEmptyString,
  description: optionalString,
  quantity: z.number().min(1).default(1),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
});

export const createContractSchema = z.object({
  clientId: nonEmptyString,
  title: nonEmptyString,
  contractNumber: optionalString,
  services: z.array(contractServiceItemSchema).min(1, 'At least one service is required'),
  totalValue: z.number().min(0),
  currency: z.string().default('INR'),
  startDate: optionalString,
  endDate: optionalString,
  paymentTerms: optionalString,
  billingCycle: z.enum(['monthly', 'quarterly', 'annually', 'milestone', 'one-time']).optional(),
  termsAndConditions: optionalString,
});

export const updateContractSchema = z.object({
  id: nonEmptyString,
}).catchall(z.unknown());

export const contractActionSchema = z.object({
  contractId: nonEmptyString,
  action: z.enum(['accept', 'reject', 'request_edit']),
  feedback: optionalString,
});

// ---------------------------------------------------------------------------
// Helper: validate request body
// ---------------------------------------------------------------------------

export function validateBody<T>(schema: z.ZodType<T>, body: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join('.');
    return path ? `${path}: ${issue.message}` : issue.message;
  });

  return { success: false, error: `Validation failed: ${errors.join(', ')}` };
}
