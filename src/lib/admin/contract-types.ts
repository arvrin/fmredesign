/**
 * Contract management types.
 * Shared between admin API and client portal API routes.
 */

export type ContractStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'edit_requested';

export interface ContractServiceItem {
  serviceId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Contract {
  id: string;
  clientId: string;
  title: string;
  contractNumber?: string;
  status: ContractStatus;
  services: ContractServiceItem[];
  totalValue: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  paymentTerms?: string;
  billingCycle?: string;
  termsAndConditions?: string;
  clientFeedback?: string;
  revisionNotes?: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Currency formatting — locale-aware based on contract currency */
const CURRENCY_LOCALES: Record<string, string> = {
  INR: 'en-IN',
  GBP: 'en-GB',
  USD: 'en-US',
  EUR: 'de-DE',
  AED: 'ar-AE',
  AUD: 'en-AU',
  CAD: 'en-CA',
  SGD: 'en-SG',
};

export function formatContractCurrency(amount: number, currency: string): string {
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** DB row (snake_case) to API response (camelCase) */
export function transformContract(row: Record<string, unknown>): Contract {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    title: row.title as string,
    contractNumber: (row.contract_number as string) ?? undefined,
    status: row.status as ContractStatus,
    services: Array.isArray(row.services) ? (row.services as ContractServiceItem[]) : [],
    totalValue: Number(row.total_value) || 0,
    currency: (row.currency as string) || 'INR',
    startDate: (row.start_date as string) ?? undefined,
    endDate: (row.end_date as string) ?? undefined,
    paymentTerms: (row.payment_terms as string) ?? undefined,
    billingCycle: (row.billing_cycle as string) ?? undefined,
    termsAndConditions: (row.terms_and_conditions as string) ?? undefined,
    clientFeedback: (row.client_feedback as string) ?? undefined,
    revisionNotes: (row.revision_notes as string) ?? undefined,
    sentAt: (row.sent_at as string) ?? undefined,
    acceptedAt: (row.accepted_at as string) ?? undefined,
    rejectedAt: (row.rejected_at as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
