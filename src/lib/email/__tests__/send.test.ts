import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Inngest client (sendEmail now routes through Inngest first)
const mockInngestSend = vi.fn(() => Promise.resolve());
vi.mock('@/lib/inngest/client', () => ({
  inngest: { send: mockInngestSend },
}));

// Mock the resend module (fallback when Inngest fails)
const mockResendSend = vi.fn();
vi.mock('../resend', () => ({
  getResend: vi.fn(() => ({
    emails: { send: mockResendSend },
  })),
}));

import { getResend } from '../resend';
import {
  sendEmail,
  notifyTeam,
  newLeadEmail,
  newSupportTicketEmail,
  ticketStatusUpdateEmail,
  talentApplicationReceivedEmail,
  talentApplicationTeamEmail,
  talentApprovedEmail,
  invoiceCreatedEmail,
  proposalCreatedEmail,
} from '../send';

describe('sendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInngestSend.mockResolvedValue(undefined);
    mockResendSend.mockResolvedValue({ id: 'test-id' });
  });

  it('sends email event to Inngest', async () => {
    await sendEmail({ to: 'test@example.com', subject: 'Test', html: '<p>Hi</p>' });

    expect(mockInngestSend).toHaveBeenCalledWith({
      name: 'email/send',
      data: {
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Hi</p>',
      },
    });
    // Resend should NOT be called when Inngest succeeds
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it('falls back to Resend when Inngest fails', async () => {
    mockInngestSend.mockRejectedValueOnce(new Error('Inngest down'));

    await sendEmail({ to: 'test@example.com', subject: 'Fallback', html: '<p>x</p>' });

    expect(mockResendSend).toHaveBeenCalledWith({
      from: 'FreakingMinds <notifications@freakingminds.in>',
      to: 'test@example.com',
      subject: 'Fallback',
      html: '<p>x</p>',
    });
  });

  it('does not throw when both Inngest and Resend fail', async () => {
    mockInngestSend.mockRejectedValueOnce(new Error('Inngest down'));
    mockResendSend.mockRejectedValueOnce(new Error('Resend down'));

    await expect(
      sendEmail({ to: 'test@example.com', subject: 'Fail', html: '<p>x</p>' })
    ).resolves.toBeUndefined();
  });

  it('does not throw when getResend returns null (fallback path)', async () => {
    mockInngestSend.mockRejectedValueOnce(new Error('Inngest down'));
    vi.mocked(getResend).mockReturnValueOnce(null);

    await expect(
      sendEmail({ to: 'test@example.com', subject: 'No key', html: '<p>x</p>' })
    ).resolves.toBeUndefined();
  });
});

describe('notifyTeam', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInngestSend.mockResolvedValue(undefined);
  });

  it('sends to NOTIFICATION_EMAIL or fallback via Inngest', async () => {
    notifyTeam('Subject', '<p>Body</p>');

    // notifyTeam calls sendEmail which is async, give it a tick
    await new Promise((r) => setTimeout(r, 50));

    expect(mockInngestSend).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'email/send',
        data: expect.objectContaining({
          subject: 'Subject',
          html: '<p>Body</p>',
        }),
      })
    );
  });
});

describe('template: newLeadEmail', () => {
  it('returns subject and html with lead data', () => {
    const result = newLeadEmail({
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Inc',
      projectType: 'website',
      budgetRange: '5-10 lakhs',
      leadScore: 85,
      priority: 'high',
    });

    expect(result.subject).toContain('John Doe');
    expect(result.subject).toContain('Acme Inc');
    expect(result.html).toContain('john@example.com');
    expect(result.html).toContain('<strong>85</strong>/100');
    expect(result.html).toContain('HIGH');
    expect(result.html).toContain('website');
  });
});

describe('template: newSupportTicketEmail', () => {
  it('returns subject and html with ticket data', () => {
    const result = newSupportTicketEmail({
      ticketId: 'ticket-1',
      clientName: 'Acme Corp',
      title: 'Login issue',
      description: 'Cannot log in',
      priority: 'high',
      category: 'technical',
    });

    expect(result.subject).toContain('Login issue');
    expect(result.subject).toContain('Acme Corp');
    expect(result.html).toContain('Login issue');
    expect(result.html).toContain('Cannot log in');
    expect(result.html).toContain('HIGH');
  });
});

describe('template: ticketStatusUpdateEmail', () => {
  it('returns subject and html with status info', () => {
    const result = ticketStatusUpdateEmail({
      clientName: 'Jane',
      title: 'Bug report',
      newStatus: 'in_progress',
      assignedTo: 'Dev Team',
    });

    expect(result.subject).toContain('Bug report');
    expect(result.subject).toContain('In Progress');
    expect(result.html).toContain('Hi Jane');
    expect(result.html).toContain('In Progress');
    expect(result.html).toContain('Dev Team');
  });
});

describe('template: talentApplicationReceivedEmail', () => {
  it('returns confirmation email for applicant', () => {
    const result = talentApplicationReceivedEmail({
      fullName: 'Alice',
      email: 'alice@example.com',
    });

    expect(result.subject).toContain('Application Received');
    expect(result.html).toContain('Hi Alice');
    expect(result.html).toContain('CreativeMinds');
  });
});

describe('template: talentApplicationTeamEmail', () => {
  it('returns team notification with applicant info', () => {
    const result = talentApplicationTeamEmail({
      fullName: 'Bob',
      email: 'bob@example.com',
      category: 'Designer',
      experience: '5 years',
    });

    expect(result.subject).toContain('Bob');
    expect(result.html).toContain('bob@example.com');
    expect(result.html).toContain('Designer');
    expect(result.html).toContain('5 years');
  });
});

describe('template: talentApprovedEmail', () => {
  it('returns approval email with profile link', () => {
    const result = talentApprovedEmail({
      fullName: 'Charlie',
      profileSlug: 'charlie-abc1',
    });

    expect(result.subject).toContain('Approved');
    expect(result.html).toContain('Congratulations, Charlie');
    expect(result.html).toContain('/talent/charlie-abc1');
  });
});

describe('template: invoiceCreatedEmail', () => {
  it('returns invoice notification with formatted amount', () => {
    const result = invoiceCreatedEmail({
      invoiceNumber: 'FM-INV-001',
      clientName: 'Acme Corp',
      total: 50000,
      dueDate: '2026-03-01',
      status: 'draft',
    });

    expect(result.subject).toContain('FM-INV-001');
    expect(result.subject).toContain('Acme Corp');
    expect(result.html).toContain('50,000');
    expect(result.html).toContain('2026-03-01');
    expect(result.html).toContain('DRAFT');
  });
});

describe('template: proposalCreatedEmail', () => {
  it('returns proposal notification', () => {
    const result = proposalCreatedEmail({
      proposalNumber: 'PM164/2026',
      title: 'Website Redesign',
      clientName: 'Acme Corp',
      status: 'draft',
    });

    expect(result.subject).toContain('PM164/2026');
    expect(result.subject).toContain('Website Redesign');
    expect(result.html).toContain('Acme Corp');
    expect(result.html).toContain('DRAFT');
  });
});
