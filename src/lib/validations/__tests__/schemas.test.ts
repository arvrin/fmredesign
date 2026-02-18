import { describe, it, expect } from 'vitest';
import {
  createClientSchema,
  createProjectSchema,
  createContentSchema,
  createTeamMemberSchema,
  createUserSchema,
  createInvoiceSchema,
  createLeadSchema,
  validateBody,
} from '../schemas';

describe('createClientSchema', () => {
  it('accepts valid client data', () => {
    const result = createClientSchema.safeParse({
      name: 'Acme Corp',
      email: 'contact@acme.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = createClientSchema.safeParse({
      name: '',
      email: 'contact@acme.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = createClientSchema.safeParse({
      name: 'Acme Corp',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const result = createClientSchema.safeParse({
      name: 'Acme Corp',
    });
    expect(result.success).toBe(false);
  });

  it('accepts full client data with all optional fields', () => {
    const result = createClientSchema.safeParse({
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '+919876543210',
      industry: 'Technology',
      website: 'https://acme.com',
      status: 'active',
      health: 'excellent',
      contractType: 'retainer',
      contractValue: 50000,
      services: ['SEO', 'Social Media'],
      tags: ['premium'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status enum', () => {
    const result = createClientSchema.safeParse({
      name: 'Acme Corp',
      email: 'contact@acme.com',
      status: 'invalid-status',
    });
    expect(result.success).toBe(false);
  });
});

describe('createProjectSchema', () => {
  const validProject = {
    clientId: 'client-123',
    name: 'Website Redesign',
    type: 'web-development',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    projectManager: 'John Doe',
    budget: 50000,
  };

  it('accepts valid project data', () => {
    const result = createProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = createProjectSchema.safeParse({
      name: 'Website Redesign',
    });
    expect(result.success).toBe(false);
  });

  it('accepts budget as string', () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      budget: '50000',
    });
    expect(result.success).toBe(true);
  });

  it('validates priority enum', () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      priority: 'invalid',
    });
    expect(result.success).toBe(false);
  });
});

describe('createContentSchema', () => {
  it('accepts valid content data', () => {
    const result = createContentSchema.safeParse({
      projectId: 'proj-123',
      title: 'Blog Post: SEO Tips',
      type: 'blog',
      platform: 'website',
      scheduledDate: '2024-03-15',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = createContentSchema.safeParse({
      projectId: 'proj-123',
      type: 'blog',
      platform: 'website',
      scheduledDate: '2024-03-15',
    });
    expect(result.success).toBe(false);
  });
});

describe('createTeamMemberSchema', () => {
  it('accepts valid team member data', () => {
    const result = createTeamMemberSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@freakingminds.com',
      role: 'designer',
      department: 'Creative',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = createTeamMemberSchema.safeParse({
      name: 'Jane Smith',
      email: 'invalid',
      role: 'designer',
      department: 'Creative',
    });
    expect(result.success).toBe(false);
  });

  it('validates type enum', () => {
    const result = createTeamMemberSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@freakingminds.com',
      role: 'designer',
      department: 'Creative',
      type: 'intern', // not in enum
    });
    expect(result.success).toBe(false);
  });
});

describe('createUserSchema', () => {
  it('accepts valid user data', () => {
    const result = createUserSchema.safeParse({
      name: 'Admin User',
      email: 'admin@freakingminds.com',
      mobileNumber: '+919876543210',
      role: 'admin',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid role', () => {
    const result = createUserSchema.safeParse({
      name: 'Admin User',
      email: 'admin@freakingminds.com',
      mobileNumber: '+919876543210',
      role: 'superuser', // not in enum
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing mobile number', () => {
    const result = createUserSchema.safeParse({
      name: 'Admin User',
      email: 'admin@freakingminds.com',
      role: 'admin',
    });
    expect(result.success).toBe(false);
  });
});

describe('createInvoiceSchema', () => {
  it('accepts valid invoice data', () => {
    const result = createInvoiceSchema.safeParse({
      invoiceNumber: 'INV-001',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      client: {
        name: 'Acme Corp',
        email: 'billing@acme.com',
      },
      lineItems: [
        { description: 'Web Design', quantity: 1, rate: 5000, amount: 5000 },
      ],
      subtotal: 5000,
      total: 5900,
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty invoice (all optional)', () => {
    const result = createInvoiceSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = createInvoiceSchema.safeParse({
      status: 'cancelled', // not in enum
    });
    expect(result.success).toBe(false);
  });
});

describe('createLeadSchema', () => {
  const validLead = {
    name: 'John Doe',
    email: 'john@company.com',
    company: 'Company Inc',
    projectType: 'website',
    projectDescription: 'Need a new website',
    budgetRange: '50k-100k',
    timeline: '3 months',
    primaryChallenge: 'Low online visibility',
    companySize: '50-100',
  };

  it('accepts valid lead data', () => {
    const result = createLeadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = createLeadSchema.safeParse({
      name: 'John Doe',
      email: 'john@company.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = createLeadSchema.safeParse({
      ...validLead,
      email: 'not-valid',
    });
    expect(result.success).toBe(false);
  });
});

describe('validateBody', () => {
  it('returns success with valid data', () => {
    const result = validateBody(createUserSchema, {
      name: 'Test',
      email: 'test@test.com',
      mobileNumber: '+919999999999',
      role: 'viewer',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Test');
    }
  });

  it('returns error with invalid data', () => {
    const result = validateBody(createUserSchema, {
      name: '',
      email: 'invalid',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Validation failed');
    }
  });

  it('returns descriptive error paths', () => {
    const result = validateBody(createClientSchema, {
      name: 'Test',
      email: 'not-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('email');
    }
  });
});
