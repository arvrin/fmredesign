import { getResend } from './resend';

const FROM = 'FreakingMinds <notifications@freakingminds.in>';
const FALLBACK_EMAIL = 'freakingmindsdigital@gmail.com';

function getNotificationEmail(): string {
  return process.env.NOTIFICATION_EMAIL || FALLBACK_EMAIL;
}

// ---------------------------------------------------------------------------
// Core sender — fire-and-forget, never throws
// ---------------------------------------------------------------------------

interface SendEmailOpts {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(opts: SendEmailOpts): Promise<void> {
  try {
    const resend = getResend();
    if (!resend) return;

    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

/** Shortcut: send to the team notification address */
export function notifyTeam(subject: string, html: string): void {
  sendEmail({ to: getNotificationEmail(), subject, html });
}

/** Send to a specific recipient */
export function notifyRecipient(to: string, subject: string, html: string): void {
  sendEmail({ to, subject, html });
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const BRAND_MAGENTA = '#c9325d';
const HEADING_COLOR = '#0f0f0f';
const TEXT_COLOR = '#404040';
const LIGHT_BG = '#f9f9f9';

function emailWrapper(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${LIGHT_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT_BG};padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
  <tr><td style="background:${BRAND_MAGENTA};padding:24px 32px">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">${title}</h1>
  </td></tr>
  <tr><td style="padding:32px">
    ${body}
  </td></tr>
  <tr><td style="padding:16px 32px 24px;border-top:1px solid #eee">
    <p style="margin:0;color:#999;font-size:12px">FreakingMinds Digital &mdash; freakingminds.in</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:${TEXT_COLOR};font-size:14px;font-weight:600;vertical-align:top;white-space:nowrap">${label}</td>
    <td style="padding:6px 0;color:${TEXT_COLOR};font-size:14px">${value}</td>
  </tr>`;
}

function dataTable(rows: string): string {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0">${rows}</table>`;
}

function badge(text: string, color: string = BRAND_MAGENTA): string {
  return `<span style="display:inline-block;background:${color};color:#fff;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:600">${text}</span>`;
}

// ---------------------------------------------------------------------------
// Template functions
// ---------------------------------------------------------------------------

interface LeadEmailData {
  name: string;
  email: string;
  company: string;
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  primaryChallenge?: string;
  leadScore?: number;
  priority?: string;
}

export function newLeadEmail(data: LeadEmailData): { subject: string; html: string } {
  const priorityColor = data.priority === 'high' ? '#dc2626' : data.priority === 'medium' ? '#f59e0b' : '#22c55e';

  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">New lead from the website!</p>
    ${dataTable(
      row('Name', data.name) +
      row('Email', `<a href="mailto:${data.email}" style="color:${BRAND_MAGENTA}">${data.email}</a>`) +
      row('Company', data.company) +
      (data.projectType ? row('Project Type', data.projectType) : '') +
      (data.budgetRange ? row('Budget', data.budgetRange) : '') +
      (data.timeline ? row('Timeline', data.timeline) : '') +
      (data.primaryChallenge ? row('Challenge', data.primaryChallenge) : '') +
      (data.leadScore !== undefined ? row('Lead Score', `${data.leadScore}/100`) : '') +
      (data.priority ? row('Priority', badge(data.priority.toUpperCase(), priorityColor)) : '')
    )}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">View in the <a href="https://freakingminds.in/admin/leads" style="color:${BRAND_MAGENTA}">admin dashboard</a>.</p>
  `;

  return {
    subject: `New Lead: ${data.name} (${data.company})`,
    html: emailWrapper('New Lead Received', body),
  };
}

interface SupportTicketEmailData {
  ticketId: string;
  clientName: string;
  title: string;
  description: string;
  priority: string;
  category: string;
}

export function newSupportTicketEmail(data: SupportTicketEmailData): { subject: string; html: string } {
  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">A client has submitted a support ticket.</p>
    ${dataTable(
      row('Client', data.clientName) +
      row('Title', data.title) +
      row('Priority', badge(data.priority.toUpperCase())) +
      row('Category', data.category) +
      row('Description', data.description)
    )}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">Manage in the <a href="https://freakingminds.in/admin/support" style="color:${BRAND_MAGENTA}">admin dashboard</a>.</p>
  `;

  return {
    subject: `Support Ticket: ${data.title} (${data.clientName})`,
    html: emailWrapper('New Support Ticket', body),
  };
}

interface TicketStatusUpdateData {
  clientName: string;
  title: string;
  oldStatus?: string;
  newStatus: string;
  assignedTo?: string;
}

export function ticketStatusUpdateEmail(data: TicketStatusUpdateData): { subject: string; html: string } {
  const statusLabel = data.newStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">Hi ${data.clientName},</p>
    <p style="margin:0 0 16px;color:${TEXT_COLOR};font-size:14px">Your support ticket has been updated.</p>
    ${dataTable(
      row('Ticket', data.title) +
      row('Status', badge(statusLabel)) +
      (data.assignedTo ? row('Assigned To', data.assignedTo) : '')
    )}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">You can track your tickets in the <a href="https://freakingminds.in/client" style="color:${BRAND_MAGENTA}">client portal</a>.</p>
  `;

  return {
    subject: `Ticket Update: ${data.title} — ${statusLabel}`,
    html: emailWrapper('Support Ticket Update', body),
  };
}

interface TalentApplicationData {
  fullName: string;
  email: string;
  category?: string;
  experience?: string;
}

export function talentApplicationReceivedEmail(data: TalentApplicationData): { subject: string; html: string } {
  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">Hi ${data.fullName},</p>
    <p style="margin:0 0 16px;color:${TEXT_COLOR};font-size:14px">Thank you for applying to CreativeMinds! We've received your application and our team will review it shortly.</p>
    <p style="margin:0 0 16px;color:${TEXT_COLOR};font-size:14px">We'll notify you once your application has been reviewed. In the meantime, feel free to explore our website at <a href="https://freakingminds.in" style="color:${BRAND_MAGENTA}">freakingminds.in</a>.</p>
    <p style="margin:0;color:${TEXT_COLOR};font-size:14px">Best,<br>The FreakingMinds Team</p>
  `;

  return {
    subject: 'Application Received — CreativeMinds by FreakingMinds',
    html: emailWrapper('Application Received', body),
  };
}

export function talentApplicationTeamEmail(data: TalentApplicationData): { subject: string; html: string } {
  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">New CreativeMinds application received.</p>
    ${dataTable(
      row('Name', data.fullName) +
      row('Email', `<a href="mailto:${data.email}" style="color:${BRAND_MAGENTA}">${data.email}</a>`) +
      (data.category ? row('Category', data.category) : '') +
      (data.experience ? row('Experience', data.experience) : '')
    )}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">Review in the <a href="https://freakingminds.in/admin/creativeminds" style="color:${BRAND_MAGENTA}">admin dashboard</a>.</p>
  `;

  return {
    subject: `New Talent Application: ${data.fullName}`,
    html: emailWrapper('New Talent Application', body),
  };
}

interface TalentApprovedData {
  fullName: string;
  profileSlug: string;
}

export function talentApprovedEmail(data: TalentApprovedData): { subject: string; html: string } {
  const profileUrl = `https://freakingminds.in/talent/${data.profileSlug}`;

  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">Congratulations, ${data.fullName}!</p>
    <p style="margin:0 0 16px;color:${TEXT_COLOR};font-size:14px">Your CreativeMinds application has been approved! Your public talent profile is now live.</p>
    <p style="margin:0 0 24px;color:${TEXT_COLOR};font-size:14px">View your profile: <a href="${profileUrl}" style="color:${BRAND_MAGENTA};font-weight:600">${profileUrl}</a></p>
    <p style="margin:0;color:${TEXT_COLOR};font-size:14px">Welcome to the team!<br>The FreakingMinds Team</p>
  `;

  return {
    subject: 'You\'re Approved! — CreativeMinds by FreakingMinds',
    html: emailWrapper('Application Approved', body),
  };
}

interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  total: number;
  currency?: string;
  dueDate?: string;
  status?: string;
}

export function invoiceCreatedEmail(data: InvoiceEmailData): { subject: string; html: string } {
  const cur = data.currency || 'INR';
  const locale = cur === 'INR' ? 'en-IN' : 'en-GB';
  const formatted = new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(data.total);

  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">A new invoice has been created.</p>
    ${dataTable(
      row('Invoice #', data.invoiceNumber) +
      row('Client', data.clientName) +
      row('Total', `<strong>${formatted}</strong>`) +
      (data.dueDate ? row('Due Date', data.dueDate) : '') +
      (data.status ? row('Status', badge(data.status.toUpperCase())) : '')
    )}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">View in the <a href="https://freakingminds.in/admin/invoices" style="color:${BRAND_MAGENTA}">admin dashboard</a>.</p>
  `;

  return {
    subject: `Invoice Created: ${data.invoiceNumber} — ${data.clientName}`,
    html: emailWrapper('Invoice Created', body),
  };
}

interface ProposalEmailData {
  proposalNumber: string;
  title: string;
  clientName?: string;
  status?: string;
}

export function proposalCreatedEmail(data: ProposalEmailData): { subject: string; html: string } {
  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">A new proposal has been created.</p>
    ${dataTable(
      row('Proposal #', data.proposalNumber) +
      row('Title', data.title) +
      (data.clientName ? row('Client', data.clientName) : '') +
      (data.status ? row('Status', badge(data.status.toUpperCase())) : '')
    )}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">View in the <a href="https://freakingminds.in/admin/proposals" style="color:${BRAND_MAGENTA}">admin dashboard</a>.</p>
  `;

  return {
    subject: `Proposal Created: ${data.proposalNumber} — ${data.title}`,
    html: emailWrapper('Proposal Created', body),
  };
}

// ---------------------------------------------------------------------------
// Contract email templates
// ---------------------------------------------------------------------------

/** Escape HTML to prevent XSS in email templates */
function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

interface ContractEmailData {
  title: string;
  clientName?: string;
  contractNumber?: string;
  totalValue?: number;
  currency?: string;
}

export function contractCreatedEmail(data: ContractEmailData): { subject: string; html: string } {
  const cur = data.currency || 'INR';
  const locale = cur === 'INR' ? 'en-IN' : 'en-GB';
  const formatted = data.totalValue
    ? new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(data.totalValue)
    : undefined;

  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">A new contract has been created.</p>
    ${dataTable(
      row('Title', escHtml(data.title)) +
      (data.clientName ? row('Client', escHtml(data.clientName)) : '') +
      (data.contractNumber ? row('Contract #', escHtml(data.contractNumber)) : '') +
      (formatted ? row('Total Value', `<strong>${formatted}</strong>`) : '') +
      row('Status', badge('DRAFT'))
    )}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">View in the <a href="https://freakingminds.in/admin/clients" style="color:${BRAND_MAGENTA}">admin dashboard</a>.</p>
  `;

  return {
    subject: `Contract Created: ${data.title}`,
    html: emailWrapper('Contract Created', body),
  };
}

interface ContractStatusEmailData {
  title: string;
  action: 'sent' | 'accepted' | 'rejected' | 'edit_requested';
  clientFeedback?: string;
}

export function contractStatusEmail(data: ContractStatusEmailData): { subject: string; html: string } {
  const labels: Record<string, string> = {
    sent: 'Sent to Client',
    accepted: 'Accepted',
    rejected: 'Rejected',
    edit_requested: 'Edit Requested',
  };
  const colors: Record<string, string> = {
    sent: '#3b82f6',
    accepted: '#22c55e',
    rejected: '#ef4444',
    edit_requested: '#f59e0b',
  };

  const label = labels[data.action] || data.action;
  const color = colors[data.action] || BRAND_MAGENTA;
  const safeTitle = escHtml(data.title);

  const body = `
    <p style="margin:0 0 16px;color:${HEADING_COLOR};font-size:16px;font-weight:700">Contract status updated.</p>
    ${dataTable(
      row('Contract', safeTitle) +
      row('Status', badge(label, color))
    )}
    ${data.clientFeedback ? `<div style="margin:16px 0;padding:12px;background:#fff7ed;border-left:3px solid #f59e0b;border-radius:4px"><p style="margin:0 0 4px;color:${HEADING_COLOR};font-size:13px;font-weight:600">Client Feedback</p><p style="margin:0;color:${TEXT_COLOR};font-size:13px">${escHtml(data.clientFeedback)}</p></div>` : ''}
    <p style="margin:16px 0 0;color:${TEXT_COLOR};font-size:13px">View in the <a href="https://freakingminds.in/admin/clients" style="color:${BRAND_MAGENTA}">admin dashboard</a>.</p>
  `;

  return {
    subject: `Contract ${label}: ${data.title}`,
    html: emailWrapper(`Contract ${label}`, body),
  };
}
