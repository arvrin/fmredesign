'use client';

import { useState, useEffect } from 'react';
import {
  DashboardCard as Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardButton as Button
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  User,
  Send,
  Search,
  HelpCircle,
  BookOpen,
  Video,
  Download,
  ExternalLink,
  MessageCircle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { getStatusColor, getPriorityColor } from '@/lib/client-portal/status-colors';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
  category: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function ClientSupportPage() {
  const { clientId } = useClientPortal();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [faqs] = useState<FAQ[]>([
    {
      question: "How do I track my project progress?",
      answer: "You can track your project progress by navigating to the Projects section in your dashboard. Each project shows real-time progress, milestones, and timeline updates.",
      category: "Projects"
    },
    {
      question: "When will I receive my monthly reports?",
      answer: "Monthly performance reports are automatically generated on the 1st of each month and are available in your Reports section. You'll also receive an email notification when new reports are ready.",
      category: "Reports"
    },
    {
      question: "How can I request changes to my content calendar?",
      answer: "You can submit content change requests through the Support section or by contacting your dedicated account manager directly. Most requests are processed within 24 hours.",
      category: "Content"
    },
    {
      question: "What's included in my service package?",
      answer: "Your service package details are available in the Overview section. For specific questions about inclusions or upgrades, please contact your account manager.",
      category: "Billing"
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'general'
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!clientId) return;
    fetchTickets();
  }, [clientId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/client-portal/${clientId}/support/tickets`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch(`/api/client-portal/${clientId}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      });

      if (res.ok) {
        const data = await res.json();
        setTickets([data.data, ...tickets]);
        setNewTicket({ title: '', description: '', priority: 'medium', category: 'general' });
        setShowNewTicketForm(false);
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
              Support <span className="v2-accent">Center</span>
            </h1>
            <p className="text-fm-neutral-600 mt-1 font-medium">Get help and manage your support requests</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="client" hover className="cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-fm-neutral-900 mb-2">Live Chat</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Chat with our support team in real-time</p>
            <Button variant="client" size="sm" className="w-full" disabled title="Coming soon">
              Start Chat (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card variant="client" hover className="cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-fm-neutral-900 mb-2">Phone Support</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Speak directly with your account manager</p>
            <a href="tel:+919876543210" className="w-full">
              <Button variant="ghost" size="sm" className="w-full text-fm-magenta-600">
                Call Now
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card variant="client" hover className="cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-fm-neutral-900 mb-2">Email Support</h3>
            <p className="text-sm text-fm-neutral-600 mb-4">Send us a detailed message</p>
            <a href="mailto:support@freakingminds.com" className="w-full">
              <Button variant="ghost" size="sm" className="w-full text-fm-magenta-600">
                Send Email
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Support Tickets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-fm-neutral-900">Your Support Tickets</h2>
            <Button
              variant="client"
              size="sm"
              onClick={() => setShowNewTicketForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* New Ticket Form */}
          {showNewTicketForm && (
            <Card variant="glass" className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Create New Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                      Subject
                    </label>
                    <Input
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder="Provide detailed information about your issue or request"
                      rows={4}
                      required
                      className="w-full p-3 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500 resize-vertical"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                        className="w-full p-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        className="w-full p-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                      >
                        <option value="general">General</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="services">Services</option>
                        <option value="reports">Reports</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pt-4">
                    <Button type="submit" variant="client" size="sm" disabled={submitting}>
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? 'Submitting...' : 'Submit Ticket'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewTicketForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} variant="client" hover>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-fm-neutral-900">{ticket.title}</h3>
                        <div
                          className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`}
                          role="img"
                          aria-label={`${ticket.priority} priority`}
                        />
                      </div>
                      <p className="text-sm text-fm-neutral-600 line-clamp-2">{ticket.description}</p>
                    </div>
                    <Badge className={getStatusColor(ticket.status)} variant="secondary">
                      {ticket.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-fm-neutral-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {ticket.assignedTo}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(ticket.lastUpdate).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-fm-magenta-600">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {tickets.length === 0 && (
              <Card variant="glass" className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-fm-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">No support tickets</h3>
                <p className="text-fm-neutral-600 mb-4">You don&apos;t have any open support tickets</p>
                <Button variant="client" size="sm" onClick={() => setShowNewTicketForm(true)}>
                  Create Your First Ticket
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-display font-semibold text-fm-neutral-900 mb-4">Frequently Asked Questions</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq, idx) => (
              <Card key={idx} variant="glass">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-fm-magenta-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4 text-fm-magenta-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-fm-neutral-900 mb-2">{faq.question}</h3>
                      <p className="text-sm text-fm-neutral-600">{faq.answer}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredFAQs.length === 0 && searchQuery && (
              <Card variant="glass" className="p-8 text-center">
                <Search className="w-12 h-12 text-fm-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">No results found</h3>
                <p className="text-fm-neutral-600">Try different keywords or contact support for help</p>
              </Card>
            )}
          </div>

          {/* Resources */}
          <Card variant="client" className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <BookOpen className="w-4 h-4 mr-2" />
                User Guide & Documentation
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <Video className="w-4 h-4 mr-2" />
                Tutorial Videos
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <Download className="w-4 h-4 mr-2" />
                Download Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
