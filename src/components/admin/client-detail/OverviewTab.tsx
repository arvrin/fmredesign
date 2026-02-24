'use client';

import { DashboardCard as Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import type { ClientProfile } from '@/hooks/admin/useClientDetail';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  TrendingUp,
} from 'lucide-react';
import { BrandIdentitySection } from './BrandIdentitySection';

interface OverviewTabProps {
  clientProfile: ClientProfile;
  onProfileUpdate?: () => void;
}

export function OverviewTab({ clientProfile, onProfileUpdate }: OverviewTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientProfile.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-fm-neutral-400 mr-3" />
                <a
                  href={clientProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fm-magenta-600 hover:underline"
                >
                  {clientProfile.website}
                </a>
              </div>
            )}

            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-fm-neutral-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-fm-neutral-900">
                  {clientProfile.headquarters.city}, {clientProfile.headquarters.state}
                </p>
                <p className="text-sm text-fm-neutral-600">{clientProfile.headquarters.country}</p>
              </div>
            </div>

            {clientProfile.description && (
              <div>
                <p className="text-sm text-fm-neutral-600">{clientProfile.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-fm-neutral-900">{clientProfile.primaryContact.name}</p>
              <p className="text-sm text-fm-neutral-600">{clientProfile.primaryContact.role}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-fm-neutral-400 mr-3" />
                <a
                  href={`mailto:${clientProfile.primaryContact.email}`}
                  className="text-fm-magenta-600 hover:underline"
                >
                  {clientProfile.primaryContact.email}
                </a>
              </div>

              {clientProfile.primaryContact.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-fm-neutral-400 mr-3" />
                  <a
                    href={`tel:${clientProfile.primaryContact.phone}`}
                    className="text-fm-magenta-600 hover:underline"
                  >
                    {clientProfile.primaryContact.phone}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Contract Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-sm text-fm-neutral-600">Contract Value</p>
              <p className="text-2xl font-bold text-fm-neutral-900">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: clientProfile.contractDetails.currency,
                  minimumFractionDigits: 0,
                }).format(clientProfile.contractDetails.value)}
              </p>
            </div>

            <div>
              <p className="text-sm text-fm-neutral-600">Start Date</p>
              <p className="text-lg font-medium text-fm-neutral-900">
                {clientProfile.contractDetails.startDate
                  ? new Date(clientProfile.contractDetails.startDate).toLocaleDateString()
                  : 'Not set'}
              </p>
            </div>

            <div>
              <p className="text-sm text-fm-neutral-600">End Date</p>
              <p className="text-lg font-medium text-fm-neutral-900">
                {clientProfile.contractDetails.endDate
                  ? new Date(clientProfile.contractDetails.endDate).toLocaleDateString()
                  : 'Ongoing'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Identity */}
      <BrandIdentitySection
        clientId={clientProfile.id}
        clientData={{
          logoUrl: (clientProfile as any).logoUrl,
          brandColors: (clientProfile as any).brandColors,
          brandFonts: (clientProfile as any).brandFonts,
          tagline: (clientProfile as any).tagline,
          brandGuidelinesUrl: (clientProfile as any).brandGuidelinesUrl,
          name: clientProfile.name,
        }}
        onUpdate={onProfileUpdate || (() => {})}
      />
    </div>
  );
}
