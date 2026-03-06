/**
 * Proposal Numbering Service
 * API-backed persistent numbering with localStorage fallback.
 *
 * Format: PM1/2026
 */

const PROPOSAL_COUNTER_KEY = 'fm_proposal_counter';
const PROPOSAL_YEAR_KEY = 'fm_proposal_year';

export class ProposalNumbering {
  /**
   * Get the next proposal number by calling the API (increments the counter).
   * Falls back to localStorage if the API call fails.
   */
  static async getNextProposalNumber(): Promise<string> {
    try {
      const res = await fetch('/api/admin/proposal-sequence', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.proposalNumber) {
        // Sync localStorage as backup
        this.syncLocalStorage(json.data.counter, json.data.year);
        return json.data.proposalNumber;
      }
      throw new Error('Invalid API response');
    } catch {
      // Fallback to localStorage
      return this.getNextFromLocalStorage();
    }
  }

  /**
   * Preview the next proposal number without incrementing.
   * Falls back to localStorage if the API call fails.
   */
  static async previewNextProposalNumber(): Promise<string> {
    try {
      const res = await fetch('/api/admin/proposal-sequence');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.next) {
        return json.data.next;
      }
      throw new Error('Invalid API response');
    } catch {
      return this.previewFromLocalStorage();
    }
  }

  /**
   * Validate proposal number format: PM{digits}/{4-digit year}
   */
  static isValidFormat(proposalNumber: string): boolean {
    return /^PM\d+\/\d{4}$/.test(proposalNumber);
  }

  /**
   * Update local counter based on a manually entered proposal number.
   * Keeps localStorage in sync so fallback stays current.
   */
  static updateFromManualProposal(proposalNumber: string): void {
    const match = proposalNumber.match(/^PM(\d+)\/(\d{4})$/);
    if (!match) return;

    const counter = parseInt(match[1]);
    const year = parseInt(match[2]);

    if (typeof window === 'undefined') return;

    const currentStoredCounter = parseInt(localStorage.getItem(PROPOSAL_COUNTER_KEY) || '0');
    const currentStoredYear = parseInt(
      localStorage.getItem(PROPOSAL_YEAR_KEY) || new Date().getFullYear().toString(),
    );

    if (year === currentStoredYear && counter > currentStoredCounter) {
      localStorage.setItem(PROPOSAL_COUNTER_KEY, counter.toString());
    } else if (year > currentStoredYear) {
      localStorage.setItem(PROPOSAL_COUNTER_KEY, counter.toString());
      localStorage.setItem(PROPOSAL_YEAR_KEY, year.toString());
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private static syncLocalStorage(counter: number, year: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROPOSAL_COUNTER_KEY, counter.toString());
    localStorage.setItem(PROPOSAL_YEAR_KEY, year.toString());
  }

  private static getNextFromLocalStorage(): string {
    if (typeof window === 'undefined') return 'PM1/2026';

    const currentYear = new Date().getFullYear();
    const storedYear = parseInt(localStorage.getItem(PROPOSAL_YEAR_KEY) || '0');
    let counter = parseInt(localStorage.getItem(PROPOSAL_COUNTER_KEY) || '0');

    if (storedYear !== currentYear) {
      counter = 0;
      localStorage.setItem(PROPOSAL_YEAR_KEY, currentYear.toString());
    }

    counter += 1;
    localStorage.setItem(PROPOSAL_COUNTER_KEY, counter.toString());

    return `PM${counter}/${currentYear}`;
  }

  private static previewFromLocalStorage(): string {
    if (typeof window === 'undefined') return 'PM1/2026';

    const currentYear = new Date().getFullYear();
    const storedYear = parseInt(localStorage.getItem(PROPOSAL_YEAR_KEY) || '0');
    let counter = parseInt(localStorage.getItem(PROPOSAL_COUNTER_KEY) || '0');

    if (storedYear !== currentYear) {
      counter = 0;
    }

    return `PM${counter + 1}/${currentYear}`;
  }
}
