/**
 * ScrapedContactTable Component
 * Renders contacts in table or card view, with detail drawer and empty state.
 */

'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Eye,
  UserCheck,
  Users,
  Upload,
  ExternalLink,
  X,
} from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import type {
  ScrapedContact,
  ScrapedContactStatus,
  ScrapedContactFilters,
} from '@/lib/admin/scraped-contact-types';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '@/lib/admin/scraped-contact-types';

interface ScrapedContactTableProps {
  contacts: ScrapedContact[];
  loading: boolean;
  viewMode: 'table' | 'cards';
  selectedContacts: Set<string>;
  onSelectedContactsChange: (selected: Set<string>) => void;
  selectedContact: ScrapedContact | null;
  onSelectContact: (contact: ScrapedContact | null) => void;
  onUpdateStatus: (contactId: string, status: ScrapedContactStatus) => void;
  onUpdateNotes: (contactId: string, notes: string) => void;
  onImport: () => void;
  searchQuery: string;
  filters: ScrapedContactFilters;
}

function StatusSelect({
  value,
  onChange,
  className,
}: {
  value: ScrapedContactStatus;
  onChange: (status: ScrapedContactStatus) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ScrapedContactStatus)}
      className={
        className ??
        'text-xs font-medium rounded-full px-2.5 py-0.5 border border-fm-neutral-200 bg-white text-fm-neutral-700 focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent'
      }
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function getSourceLabel(platform: string): string {
  return SOURCE_OPTIONS.find((s) => s.value === platform)?.label || platform;
}

export function ScrapedContactTable({
  contacts,
  loading,
  viewMode,
  selectedContacts,
  onSelectedContactsChange,
  selectedContact,
  onSelectContact,
  onUpdateStatus,
  onUpdateNotes,
  onImport,
  searchQuery,
  filters,
}: ScrapedContactTableProps) {
  const [drawerNotes, setDrawerNotes] = useState('');

  // Empty state
  if (contacts.length === 0 && !loading) {
    return (
      <EmptyState
        icon={<Users className="w-6 h-6" />}
        title="No contacts found"
        description={
          searchQuery || Object.keys(filters).length > 1
            ? 'Try adjusting your search or filters'
            : 'Import your first batch of scraped contacts'
        }
        action={
          <DashboardButton variant="primary" size="sm" onClick={onImport}>
            <Upload className="w-4 h-4" />
            Import JSON
          </DashboardButton>
        }
      />
    );
  }

  return (
    <>
      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-fm-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-fm-neutral-200">
              <thead className="bg-fm-neutral-50">
                <tr>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-fm-neutral-300 text-fm-magenta-600 focus:ring-fm-magenta-500"
                      checked={selectedContacts.size === contacts.length && contacts.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectedContactsChange(new Set(contacts.map((c) => c.id)));
                        } else {
                          onSelectedContactsChange(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-fm-neutral-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-fm-neutral-50">
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contact.id)}
                        onChange={(e) => {
                          const next = new Set(selectedContacts);
                          if (e.target.checked) next.add(contact.id);
                          else next.delete(contact.id);
                          onSelectedContactsChange(next);
                        }}
                        className="rounded border-fm-neutral-300 text-fm-magenta-600 focus:ring-fm-magenta-500"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-fm-neutral-900">
                        {contact.firstName} {contact.lastName}
                      </div>
                      {contact.category && (
                        <div className="text-xs text-fm-neutral-500">{contact.category}</div>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-fm-neutral-900">{contact.companyName || '—'}</div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                      {contact.email ? (
                        <div className="text-sm text-fm-neutral-700 flex items-center">
                          <Mail className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[180px]">{contact.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-fm-neutral-400">—</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap">
                      {contact.phone || contact.mobile ? (
                        <div className="text-sm text-fm-neutral-700 flex items-center">
                          <Phone className="w-3 h-3 mr-1 shrink-0" />
                          {contact.phone || contact.mobile}
                        </div>
                      ) : (
                        <span className="text-xs text-fm-neutral-400">—</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={contact.sourcePlatform}>
                        {getSourceLabel(contact.sourcePlatform)}
                      </StatusBadge>
                    </td>
                    <td className="hidden xl:table-cell px-4 py-3 whitespace-nowrap text-sm text-fm-neutral-700">
                      {contact.country || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusSelect
                        value={contact.status}
                        onChange={(status) => onUpdateStatus(contact.id, status)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <DashboardButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDrawerNotes(contact.notes || '');
                          onSelectContact(contact);
                        }}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </DashboardButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl border border-fm-neutral-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-fm-neutral-900">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p className="text-sm text-fm-neutral-600">{contact.companyName || 'No company'}</p>
                  </div>
                  <StatusBadge status={contact.sourcePlatform}>
                    {getSourceLabel(contact.sourcePlatform)}
                  </StatusBadge>
                </div>

                <div className="space-y-1.5 mb-3 text-sm">
                  {contact.email && (
                    <div className="text-fm-neutral-700 flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1.5 shrink-0 text-fm-neutral-400" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {(contact.phone || contact.mobile) && (
                    <div className="text-fm-neutral-700 flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1.5 shrink-0 text-fm-neutral-400" />
                      {contact.phone || contact.mobile}
                    </div>
                  )}
                  {contact.country && (
                    <div className="text-fm-neutral-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-fm-neutral-400" />
                      {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>

                {contact.category && (
                  <p className="text-xs text-fm-neutral-500 mb-3">{contact.category}</p>
                )}

                <div className="flex items-center justify-between">
                  <StatusSelect
                    value={contact.status}
                    onChange={(status) => onUpdateStatus(contact.id, status)}
                    className="text-xs font-medium rounded-full px-3 py-1 border border-fm-neutral-200 bg-white text-fm-neutral-700 focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent"
                  />
                  <DashboardButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDrawerNotes(contact.notes || '');
                      onSelectContact(contact);
                    }}
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </DashboardButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      {selectedContact && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => onSelectContact(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-fm-neutral-900">Contact Details</h2>
                <DashboardButton variant="ghost" size="sm" onClick={() => onSelectContact(null)}>
                  <X className="w-5 h-5" />
                </DashboardButton>
              </div>

              <div className="space-y-5">
                {/* Name & Company */}
                <div>
                  <h3 className="text-lg font-semibold text-fm-neutral-900">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h3>
                  {selectedContact.companyName && (
                    <p className="text-sm text-fm-neutral-600">{selectedContact.companyName}</p>
                  )}
                  {selectedContact.category && (
                    <p className="text-xs text-fm-neutral-500 mt-0.5">{selectedContact.category}</p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {selectedContact.email && (
                    <div>
                      <span className="text-fm-neutral-500 block text-xs">Email</span>
                      <a href={`mailto:${selectedContact.email}`} className="text-fm-magenta-600 font-medium">
                        {selectedContact.email}
                      </a>
                    </div>
                  )}
                  {selectedContact.phone && (
                    <div>
                      <span className="text-fm-neutral-500 block text-xs">Phone</span>
                      <a href={`tel:${selectedContact.phone}`} className="text-fm-magenta-600 font-medium">
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                  {selectedContact.mobile && (
                    <div>
                      <span className="text-fm-neutral-500 block text-xs">Mobile</span>
                      <a href={`tel:${selectedContact.mobile}`} className="text-fm-magenta-600 font-medium">
                        {selectedContact.mobile}
                      </a>
                    </div>
                  )}
                  {selectedContact.website && (
                    <div>
                      <span className="text-fm-neutral-500 block text-xs">Website</span>
                      <a
                        href={selectedContact.website.startsWith('http') ? selectedContact.website : `https://${selectedContact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fm-magenta-600 font-medium flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{selectedContact.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Location */}
                {(selectedContact.city || selectedContact.state || selectedContact.country) && (
                  <div>
                    <span className="text-fm-neutral-500 text-xs block mb-1">Location</span>
                    <p className="text-sm text-fm-neutral-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {[selectedContact.city, selectedContact.state, selectedContact.country].filter(Boolean).join(', ')}
                    </p>
                    {selectedContact.addressFull && (
                      <p className="text-xs text-fm-neutral-500 mt-0.5">{selectedContact.addressFull}</p>
                    )}
                  </div>
                )}

                <hr className="border-fm-neutral-200" />

                {/* Business Info */}
                {selectedContact.businessDescription && (
                  <div>
                    <span className="text-fm-neutral-500 text-xs block mb-1">Business Description</span>
                    <p className="text-sm text-fm-neutral-700">{selectedContact.businessDescription}</p>
                  </div>
                )}
                {selectedContact.speciality && (
                  <div>
                    <span className="text-fm-neutral-500 text-xs block mb-1">Speciality</span>
                    <p className="text-sm text-fm-neutral-700">{selectedContact.speciality}</p>
                  </div>
                )}
                {selectedContact.keywords && (
                  <div>
                    <span className="text-fm-neutral-500 text-xs block mb-1">Keywords</span>
                    <p className="text-sm text-fm-neutral-700">{selectedContact.keywords}</p>
                  </div>
                )}

                {/* Social Links */}
                {selectedContact.socialLinks && (
                  <div>
                    <span className="text-fm-neutral-500 text-xs block mb-1">Social Links</span>
                    <p className="text-sm text-fm-neutral-700">{selectedContact.socialLinks}</p>
                  </div>
                )}

                {/* Profile URL */}
                {selectedContact.profileUrl && (
                  <div>
                    <span className="text-fm-neutral-500 text-xs block mb-1">Profile URL</span>
                    <a
                      href={selectedContact.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-fm-magenta-600 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Profile
                    </a>
                  </div>
                )}

                <hr className="border-fm-neutral-200" />

                {/* Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-fm-neutral-500 block text-xs">Source</span>
                    <StatusBadge status={selectedContact.sourcePlatform}>
                      {getSourceLabel(selectedContact.sourcePlatform)}
                    </StatusBadge>
                  </div>
                  <div>
                    <span className="text-fm-neutral-500 block text-xs">Status</span>
                    <StatusSelect
                      value={selectedContact.status}
                      onChange={(status) => onUpdateStatus(selectedContact.id, status)}
                    />
                  </div>
                  {selectedContact.chapterName && (
                    <div>
                      <span className="text-fm-neutral-500 block text-xs">Chapter</span>
                      <p className="font-medium text-fm-neutral-900">{selectedContact.chapterName}</p>
                    </div>
                  )}
                  {selectedContact.membershipStatus && (
                    <div>
                      <span className="text-fm-neutral-500 block text-xs">Membership</span>
                      <p className="font-medium text-fm-neutral-900">{selectedContact.membershipStatus}</p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <span className="text-fm-neutral-500 text-xs block mb-1">Notes</span>
                  <textarea
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    placeholder="Add notes about this contact..."
                    className="w-full min-h-[80px] text-sm border border-fm-neutral-200 rounded-lg p-2.5 text-fm-neutral-700 focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent resize-y"
                  />
                  {drawerNotes !== (selectedContact.notes || '') && (
                    <DashboardButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onUpdateNotes(selectedContact.id, drawerNotes)}
                      className="mt-2"
                    >
                      Save Notes
                    </DashboardButton>
                  )}
                </div>

                <div className="text-xs text-fm-neutral-500">
                  Created: {new Date(selectedContact.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
