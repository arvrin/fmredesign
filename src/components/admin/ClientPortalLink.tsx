'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/primitives/Card';
import { Button } from '@/design-system/components/primitives/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Link,
  Copy,
  Share2,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { adminToast } from '@/lib/admin/toast';

interface ClientPortalLinkProps {
  clientId: string;
  clientName: string;
  primaryEmail: string;
  additionalEmails?: string[];
}

interface PortalLink {
  token: string;
  expires: string;
  portalUrl: string;
  email: string;
}

export default function ClientPortalLink({ 
  clientId, 
  clientName, 
  primaryEmail, 
  additionalEmails = [] 
}: ClientPortalLinkProps) {
  const [generatedLinks, setGeneratedLinks] = useState<PortalLink[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(primaryEmail);

  const allEmails = [primaryEmail, ...additionalEmails].filter(Boolean);

  const generatePortalLink = async (email: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/client-portal/${clientId}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          requestAccess: true
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate portal link');
      }

      const data = await response.json();
      const newLink: PortalLink = {
        token: data.data.token,
        expires: data.data.expires,
        portalUrl: `${window.location.origin}${data.data.portalUrl}`,
        email
      };

      setGeneratedLinks(prev => [newLink, ...prev.filter(link => link.email !== email)]);
      adminToast.success('Portal link generated successfully');

    } catch (error) {
      console.error('Error generating portal link:', error);
      adminToast.error(error instanceof Error ? error.message : 'Failed to generate portal link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      adminToast.success('Copied to clipboard');
    } catch (error) {
      adminToast.error('Failed to copy to clipboard');
    }
  };

  const shareViaEmail = (link: PortalLink) => {
    const subject = encodeURIComponent(`Your ${clientName} Client Portal Access`);
    const body = encodeURIComponent(`Hello,

Your client portal is ready! You can access your project dashboard, content calendar, and communications through the secure link below:

${link.portalUrl}

This link will expire on ${new Date(link.expires).toLocaleDateString()} at ${new Date(link.expires).toLocaleTimeString()}.

If you have any questions or need assistance, please don't hesitate to reach out.

Best regards,
FreakingMinds Team`);

    const mailtoUrl = `mailto:${link.email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_self');
  };

  const isLinkExpired = (expires: string): boolean => {
    return new Date(expires) < new Date();
  };

  const getTimeRemaining = (expires: string): string => {
    const now = new Date();
    const expiryDate = new Date(expires);
    const diffInHours = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.ceil(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Link className="h-5 w-5 mr-2" />
            Client Portal Access
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generate New Link */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Generate Portal Link For:
            </label>
            <div className="flex gap-2">
              <select 
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-fm-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allEmails.map((email) => (
                  <option key={email} value={email}>
                    {email} {email === primaryEmail && '(Primary)'}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => generatePortalLink(selectedEmail)}
                disabled={isGenerating}
                className="flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Generate Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Generated Links */}
        {generatedLinks.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-fm-neutral-900">Generated Portal Links</h4>
            <div className="space-y-3">
              {generatedLinks.map((link, index) => (
                <div key={`${link.email}-${index}`} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-900">{link.email}</p>
                      <div className="flex items-center mt-1">
                        {isLinkExpired(link.expires) ? (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Expires in {getTimeRemaining(link.expires)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(link.portalUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => shareViaEmail(link)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(link.portalUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-fm-neutral-50 rounded p-2">
                    <Input
                      value={link.portalUrl}
                      readOnly
                      className="text-xs bg-transparent border-none p-0 h-auto"
                    />
                  </div>
                  
                  <p className="text-xs text-fm-neutral-500 mt-2">
                    Link expires: {new Date(link.expires).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Portal Access Instructions</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Portal links are valid for 24 hours from generation</li>
            <li>• Clients can only access data associated with their account</li>
            <li>• Email addresses must match those registered for the client</li>
            <li>• Use the email button to send the link directly to the client</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}