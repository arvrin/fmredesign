/**
 * TalentGrid — talent card grid/list for both Applications and Network tabs.
 * Contains ApplicationsList, ApplicationCard, TalentsList, TalentCard,
 * and the small helper components SocialPill and PriceRange.
 */

'use client';

import { useState } from 'react';
import {
  TalentApplication,
  TalentProfile,
  TALENT_CATEGORIES,
  CURRENCIES,
} from '@/lib/admin/talent-types';
import { DashboardButton } from '@/design-system';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  ExternalLink,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getCurrencySymbol(code?: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol || '\u20B9';
}

function SocialPill({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string;
  icon: any;
  label: string;
  color: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      <ExternalLink className="h-3 w-3 opacity-60" />
    </a>
  );
}

function PriceRange({
  label,
  min,
  max,
  symbol,
}: {
  label: string;
  min: number;
  max: number;
  symbol: string;
}) {
  if (!min && !max) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-fm-neutral-500">{label}:</span>
      <span className="font-medium">
        {symbol}
        {min.toLocaleString()}
        {max > 0 && max !== min ? ` \u2013 ${symbol}${max.toLocaleString()}` : ''}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ApplicationsList                                                   */
/* ------------------------------------------------------------------ */

export function ApplicationsList({
  applications,
  isLoading,
  onAction,
}: {
  applications: TalentApplication[];
  isLoading: boolean;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-fm-neutral-200 p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No applications found"
        description="There are no talent applications matching your current filters."
      />
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} onAction={onAction} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ApplicationCard                                                    */
/* ------------------------------------------------------------------ */

function ApplicationCard({
  application,
  onAction,
}: {
  application: TalentApplication;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pricing = (application as any).pricing;
  const portfolioLinks = (application as any).portfolioLinks;
  const sym = getCurrencySymbol(application.preferences?.currency);

  return (
    <div className="bg-white rounded-xl border border-fm-neutral-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-fm-neutral-900">
                  {application.personalInfo.fullName}
                </h3>
                <p className="text-fm-neutral-600 text-sm">
                  {application.personalInfo.email} &bull; {application.personalInfo.location.city}
                </p>
              </div>

              <StatusBadge status={application.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="text-fm-neutral-500">Category:</span>
                <p className="font-medium">
                  {TALENT_CATEGORIES[application.professionalDetails.category]?.label}
                </p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Experience:</span>
                <p className="font-medium">{application.professionalDetails.yearsOfExperience} years</p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Applied:</span>
                <p className="font-medium">
                  {new Date(application.applicationDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-fm-neutral-500">Pricing:</span>
                <p className="font-medium">
                  {pricing?.hourlyRate?.max > 0
                    ? `${sym}${pricing.hourlyRate.min}\u2013${pricing.hourlyRate.max}/hr`
                    : pricing?.projectRate?.max > 0
                    ? `${sym}${pricing.projectRate.min}\u2013${pricing.projectRate.max}/proj`
                    : `${sym}${application.preferences.minimumProjectValue.toLocaleString()}+`}
                </p>
              </div>
            </div>

            {/* Compact social links */}
            <div className="flex items-center gap-3 text-sm flex-wrap">
              {application.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${application.socialMedia.instagram.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>{application.socialMedia.instagram.followers.toLocaleString()}</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
              {application.socialMedia.youtube && (
                <a
                  href={application.socialMedia.youtube.channel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>{application.socialMedia.youtube.subscribers.toLocaleString()}</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
              {application.socialMedia.linkedin && (
                <a
                  href={application.socialMedia.linkedin.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <DashboardButton
              variant="secondary"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              icon={<Eye className="h-4 w-4" />}
            >
              {expanded ? 'Less' : 'View'}
            </DashboardButton>

            {application.status === 'submitted' && (
              <>
                <DashboardButton
                  size="sm"
                  onClick={() => onAction(application.id, 'approve')}
                  icon={<CheckCircle className="h-4 w-4" />}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </DashboardButton>
                <DashboardButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onAction(application.id, 'reject')}
                  icon={<XCircle className="h-4 w-4" />}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Reject
                </DashboardButton>
              </>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-fm-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Bio</h4>
                  <p className="text-sm text-fm-neutral-600">{application.personalInfo.bio}</p>
                </div>

                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {application.professionalDetails.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-fm-magenta-50 text-fm-magenta-700 text-xs rounded"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {application.professionalDetails.tools &&
                  application.professionalDetails.tools.length > 0 &&
                  application.professionalDetails.tools[0] !== '' && (
                    <div>
                      <h4 className="font-medium text-fm-neutral-900 mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.professionalDetails.tools.map((tool, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-fm-neutral-100 text-fm-neutral-700 text-xs rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Social Links */}
                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Social Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.socialMedia.instagram && (
                      <SocialPill
                        href={`https://instagram.com/${application.socialMedia.instagram.handle}`}
                        icon={Instagram}
                        label={`@${application.socialMedia.instagram.handle}`}
                        color="bg-pink-50 text-pink-700 border-pink-200"
                      />
                    )}
                    {application.socialMedia.youtube && (
                      <SocialPill
                        href={application.socialMedia.youtube.channel}
                        icon={Youtube}
                        label="YouTube"
                        color="bg-red-50 text-red-700 border-red-200"
                      />
                    )}
                    {application.socialMedia.linkedin && (
                      <SocialPill
                        href={application.socialMedia.linkedin.profileUrl}
                        icon={Linkedin}
                        label="LinkedIn"
                        color="bg-blue-50 text-blue-700 border-blue-200"
                      />
                    )}
                    {application.socialMedia.behance && (
                      <SocialPill
                        href={application.socialMedia.behance.profileUrl}
                        icon={Globe}
                        label="Behance"
                        color="bg-fm-magenta-50 text-fm-magenta-800 border-fm-magenta-200"
                      />
                    )}
                    {application.socialMedia.dribbble && (
                      <SocialPill
                        href={application.socialMedia.dribbble.profileUrl}
                        icon={Globe}
                        label="Dribbble"
                        color="bg-pink-50 text-pink-700 border-pink-200"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Portfolio Links */}
                {portfolioLinks &&
                  (portfolioLinks.websiteUrl ||
                    portfolioLinks.workSampleUrls?.some((u: string) => u)) && (
                    <div>
                      <h4 className="font-medium text-fm-neutral-900 mb-2">Portfolio</h4>
                      <div className="space-y-2">
                        {portfolioLinks.websiteUrl && (
                          <a
                            href={portfolioLinks.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-fm-magenta-600 hover:underline"
                          >
                            <Globe className="h-4 w-4" />
                            {portfolioLinks.websiteUrl}
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                        )}
                        {portfolioLinks.workSampleUrls
                          ?.filter((u: string) => u)
                          .map((url: string, i: number) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Work Sample {i + 1}
                            </a>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Pricing */}
                {pricing && (
                  <div>
                    <h4 className="font-medium text-fm-neutral-900 mb-2">Pricing</h4>
                    <div className="space-y-1.5 bg-fm-neutral-50 rounded-lg p-3">
                      <PriceRange
                        label="Hourly"
                        min={pricing.hourlyRate?.min || 0}
                        max={pricing.hourlyRate?.max || 0}
                        symbol={sym}
                      />
                      <PriceRange
                        label="Per-project"
                        min={pricing.projectRate?.min || 0}
                        max={pricing.projectRate?.max || 0}
                        symbol={sym}
                      />
                      <PriceRange
                        label="Monthly retainer"
                        min={pricing.retainerRate?.min || 0}
                        max={pricing.retainerRate?.max || 0}
                        symbol={sym}
                      />
                      {pricing.openToNegotiation && (
                        <p className="text-xs text-green-600 mt-1">Open to negotiation</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-fm-neutral-900 mb-2">Preferences</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Min. Project Value:</span>
                      <span>
                        {sym}
                        {application.preferences.minimumProjectValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Remote Work:</span>
                      <span>{application.availability.remoteWork ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Commitment:</span>
                      <span className="capitalize">
                        {application.availability.projectCommitment?.replace('_', ' ') || 'Both'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Communication:</span>
                      <span className="capitalize">
                        {application.preferences.communicationStyle || 'Mixed'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fm-neutral-500">Languages:</span>
                      <span>{application.personalInfo.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TalentsList                                                        */
/* ------------------------------------------------------------------ */

export function TalentsList({
  talents,
  isLoading,
}: {
  talents: TalentProfile[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-fm-neutral-200 p-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {talents.map((talent) => (
        <TalentCard key={talent.id} talent={talent} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TalentCard                                                         */
/* ------------------------------------------------------------------ */

function TalentCard({ talent }: { talent: TalentProfile }) {
  const slug = talent.profileSlug || talent.id;

  return (
    <div className="bg-white rounded-xl border border-fm-neutral-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-fm-neutral-900">
            {talent.personalInfo.fullName}
          </h3>
          <p className="text-fm-neutral-600 text-sm">
            {TALENT_CATEGORIES[talent.professionalDetails.category]?.label}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{talent.ratings.overallRating.toFixed(1)}</span>
          <span className="text-xs text-fm-neutral-500">({talent.ratings.totalReviews})</span>
        </div>
      </div>

      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-fm-neutral-500">Experience:</span>
          <span>{talent.professionalDetails.yearsOfExperience} years</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fm-neutral-500">Availability:</span>
          <span className="capitalize">{talent.availability.currentStatus.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fm-neutral-500">Location:</span>
          <span>{talent.personalInfo.location.city}</span>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex items-center gap-3 mb-4">
        {talent.socialMedia.instagram && (
          <a
            href={`https://instagram.com/${talent.socialMedia.instagram.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:underline"
          >
            <Instagram className="h-3 w-3 text-pink-500" />
            <span>{talent.socialMedia.instagram.followers.toLocaleString()}</span>
          </a>
        )}
        {talent.socialMedia.youtube && (
          <a
            href={talent.socialMedia.youtube.channel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:underline"
          >
            <Youtube className="h-3 w-3 text-red-500" />
            <span>{talent.socialMedia.youtube.subscribers.toLocaleString()}</span>
          </a>
        )}
        {talent.socialMedia.linkedin && (
          <a
            href={talent.socialMedia.linkedin.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:underline"
          >
            <Linkedin className="h-3 w-3 text-blue-600" />
          </a>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-fm-neutral-900">
          {getCurrencySymbol(talent.preferences?.currency)}
          {talent.preferences.minimumProjectValue.toLocaleString()}+
        </span>
        <a href={`/talent/${slug}`} target="_blank" rel="noopener noreferrer">
          <DashboardButton size="sm" variant="secondary">
            View Profile
          </DashboardButton>
        </a>
      </div>
    </div>
  );
}
