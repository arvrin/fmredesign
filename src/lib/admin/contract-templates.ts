/**
 * Contract Templates
 * Pre-built templates for Indian and International clients.
 * Auto-populates contract form with appropriate defaults.
 */

import type { ContractServiceItem } from './contract-types';
import { INDIAN_BANK_INFO, INTERNATIONAL_BANK_INFO, type BankAccountInfo } from './types';

export interface ContractTemplate {
  id: 'indian' | 'international';
  label: string;
  description: string;
  currency: string;
  billingCycle: string;
  paymentTerms: string;
  /** Function that generates title from client name */
  generateTitle: (clientName: string) => string;
  /** Default services — admin can edit before saving */
  defaultServices: ContractServiceItem[];
  /** Full T&C text with numbered sections */
  termsAndConditions: string;
  /** Bank account details for payment */
  bankDetails: BankAccountInfo;
}

/* ═══════════════════════════════════════════
   Indian Client Template
   ═══════════════════════════════════════════ */
const INDIAN_TEMPLATE: ContractTemplate = {
  id: 'indian',
  label: 'Indian Client',
  description: 'INR pricing, Indian law, GST-compliant, 15-day notice period',
  currency: 'INR',
  billingCycle: 'monthly',
  paymentTerms: 'Advance payment before each billing cycle',
  generateTitle: (clientName: string) =>
    `Digital Marketing Services Agreement — ${clientName}`,
  defaultServices: [
    {
      name: 'Digital Marketing Setup',
      description:
        'One-time setup: brand audit, competitor analysis, strategy roadmap, social media setup, SEO baseline audit, analytics configuration.',
      quantity: 1,
      unitPrice: 25000,
      total: 25000,
    },
    {
      name: 'Monthly Digital Marketing Retainer',
      description:
        'Social media management, content creation, SEO optimization, paid ads management, monthly performance reporting, strategy reviews.',
      quantity: 6,
      unitPrice: 30000,
      total: 180000,
    },
  ],
  bankDetails: INDIAN_BANK_INFO,
  termsAndConditions: `Parties & Agreement:
This Agreement is entered into between Freaking Minds, Bhopal, Madhya Pradesh, India ("Agency") and the Client as named in this contract.

Scope of Work:
The Agency agrees to provide digital marketing services as detailed in the Scope of Services section above. Any work outside the agreed scope will be quoted and approved separately before commencement.

Fees & Payment Terms:
• All fees are quoted in Indian Rupees (INR) and are exclusive of applicable GST (18%).
• Setup/one-time fees are payable in full before project commencement.
• Monthly retainer fees are payable in advance at the start of each billing cycle.
• Late payments beyond 15 days may result in temporary suspension of services.
• Payment via bank transfer (NEFT/RTGS/UPI).

Client Responsibilities:
The Client agrees to provide timely access to:
• Website CMS, hosting, and domain credentials
• Social media account access
• Analytics and Search Console access
• Brand assets (logos, images, guidelines)
• Timely approvals and feedback (within 3 business days)
Delays in providing access or approvals may affect project timelines and deliverables.

No Guarantee of Results:
The Agency does not guarantee specific rankings, traffic levels, follower counts, or revenue outcomes. Digital marketing results depend on market conditions, competition, algorithms, and other factors beyond the Agency's control. The Agency guarantees professional execution of agreed deliverables.

Communication & Reporting:
• Monthly performance reports will be provided.
• Communication via email, WhatsApp, or scheduled calls.
• Standard response time: 1 business day.
• Monthly review calls to discuss strategy and performance.

Confidentiality:
Both parties agree to maintain strict confidentiality of all business, technical, financial, and strategic information shared during the engagement. This obligation survives termination of this Agreement.

Intellectual Property:
• All creative work, content, and deliverables created become Client property upon full payment.
• The Agency retains the right to showcase work in its portfolio unless explicitly restricted in writing.
• Pre-existing Agency tools, frameworks, and methodologies remain Agency property.

Term & Termination:
• Monthly retainer operates on a rolling monthly basis after the minimum commitment period.
• Either party may terminate with 15 days written notice.
• No refunds for completed work periods or work already in progress.
• Upon termination, all access credentials will be returned and pending deliverables handed over.

Limitation of Liability:
Agency liability shall not exceed the total fees paid within the previous 1 month of services.

Governing Law:
This Agreement shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bhopal, Madhya Pradesh.`,
};

/* ═══════════════════════════════════════════
   International Client Template
   ═══════════════════════════════════════════ */
const INTERNATIONAL_TEMPLATE: ContractTemplate = {
  id: 'international',
  label: 'International Client',
  description: 'GBP/USD pricing, international law, remote collaboration, 30-day notice',
  currency: 'GBP',
  billingCycle: 'monthly',
  paymentTerms: 'Advance payment required before each billing cycle',
  generateTitle: (clientName: string) =>
    `Digital Marketing Services Agreement — ${clientName}`,
  defaultServices: [
    {
      name: 'Initial Setup & Strategy',
      description:
        'One-time setup: comprehensive audit, competitor analysis, keyword research, strategy roadmap, analytics configuration, baseline reporting setup.',
      quantity: 1,
      unitPrice: 750,
      total: 750,
    },
    {
      name: 'Monthly Retainer',
      description:
        'Ongoing optimization, content creation, performance monitoring, monthly reporting, strategy reviews, and continuous improvements.',
      quantity: 6,
      unitPrice: 600,
      total: 3600,
    },
  ],
  bankDetails: INTERNATIONAL_BANK_INFO,
  termsAndConditions: `Parties & Agreement:
This Agreement is entered into between Freaking Minds, Bhopal, India ("Agency") and the Client as named in this contract. Both parties agree to collaborate remotely in good faith.

Scope of Work:
The Agency agrees to provide the services as detailed in the Scope of Services section above. Work outside the agreed scope will be quoted separately and requires written approval before commencement.

Project Phases & Deliverables:
Services are structured in phases as outlined in the Scope of Services. Each phase includes specific deliverables that will be communicated and tracked through the client portal. The Agency will provide regular updates on progress and milestones.

Fees & Payment Terms:
• All fees are quoted in the currency specified in this contract.
• Initial setup fees are payable in full before project commencement.
• Monthly retainer fees are payable in advance at the start of each month.
• Payment via international bank transfer (Wise recommended for lower fees) or alternative methods agreed upon.
• Late payments beyond 7 days may result in temporary suspension of services until payment is received.
• All fees are exclusive of any applicable local taxes in the Client's jurisdiction.

Client Responsibilities:
The Client agrees to provide:
• Website access (CMS, hosting, domain credentials)
• Analytics and Search Console access
• Brand assets and content approvals
• Timely feedback and approvals (within 3 business days)
Project timelines depend on timely access to website, analytics, hosting, and approvals provided by the Client. Delays in providing these may affect deliverable timelines.

No Guarantee of Results:
The Agency does not guarantee specific rankings, traffic levels, or business outcomes, as search engine algorithms and market conditions are outside the Agency's control. The Agency guarantees professional execution of all agreed deliverables following industry best practices.

Communication & Reporting:
• Monthly performance reports provided via the client portal.
• Communication via email or scheduled video calls.
• Standard response time: 1–2 business days.
• Time zone considerations will be accommodated for scheduling.

Confidentiality:
Both parties agree to maintain strict confidentiality of all business, technical, financial, and strategic information shared during the engagement. This obligation survives termination of this Agreement by 2 years.

Intellectual Property:
• All work created (content, designs, strategies, reports) becomes Client property upon full payment completion.
• The Agency retains the right to showcase work for portfolio purposes unless otherwise agreed in writing.
• Pre-existing Agency tools, frameworks, and proprietary methodologies remain Agency property.

Term & Termination:
• The initial commitment period is as defined in the service scope.
• After the minimum period, the retainer operates on a rolling monthly basis.
• Either party may terminate with 30 days written notice after the minimum commitment period.
• No refunds for completed work periods.
• Upon termination, all credentials will be returned, and pending deliverables will be completed and handed over.

Limitation of Liability:
Agency liability shall not exceed the total fees paid within the previous 2 months of services. The Agency shall not be liable for any indirect, incidental, or consequential damages.

Remote Collaboration:
This engagement is conducted remotely. The Agency operates from India (IST timezone) and will accommodate reasonable scheduling needs. All deliverables, reports, and communication will be conducted through digital channels.

Governing Law:
This Agreement shall be governed by mutually accepted commercial laws applicable to international service agreements. Both parties agree to resolve disputes through good-faith negotiation. If unresolved, disputes shall be referred to arbitration under internationally recognised rules.`,
};

/* ═══════════════════════════════════════════
   Exports
   ═══════════════════════════════════════════ */

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  INDIAN_TEMPLATE,
  INTERNATIONAL_TEMPLATE,
];

export function getTemplate(id: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find((t) => t.id === id);
}
