/**
 * Admin Dashboard Home Page
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { AdminStorage } from '@/lib/admin/storage';
import { Invoice, InvoiceUtils } from '@/lib/admin/types';
import { Button } from '@/design-system/components/atoms/Button/Button';

interface DashboardStats {
  totalInvoices: number;
  totalClients: number;
  totalRevenue: number;
  pendingInvoices: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const invoices = AdminStorage.getInvoices();
    const clients = AdminStorage.getClients();

    // Calculate stats
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const pendingInvoices = invoices.filter(
      inv => inv.status === 'sent' || inv.status === 'overdue'
    ).length;

    setStats({
      totalInvoices: invoices.length,
      totalClients: clients.length,
      totalRevenue,
      pendingInvoices,
    });

    // Get recent invoices (last 5)
    const recent = invoices
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    setRecentInvoices(recent);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-fm-neutral-100 text-fm-neutral-800';
    }
  };

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice for a client',
      href: '/admin/invoice',
      icon: FileText,
      color: 'bg-fm-magenta-50 text-fm-magenta-700',
    },
    {
      title: 'Add Client',
      description: 'Add a new client to your database',
      href: '/admin/clients',
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'View Reports',
      description: 'Analytics and financial reports',
      href: '/admin/reports',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-700',
    },
  ];

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.totalInvoices,
      icon: FileText,
      color: 'bg-fm-magenta-50 text-fm-magenta-700',
      change: '+12% from last month',
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
      change: '+8% from last month',
    },
    {
      title: 'Total Revenue',
      value: InvoiceUtils.formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-50 text-green-700',
      change: '+23% from last month',
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: Clock,
      color: 'bg-orange-50 text-orange-700',
      change: stats.pendingInvoices > 0 ? 'Needs attention' : 'All caught up!',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-fm-neutral-900">Welcome back!</h1>
        <p className="mt-2 text-fm-neutral-600">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-fm-neutral-600">{card.title}</p>
                  <p className="text-2xl font-bold text-fm-neutral-900">{card.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-fm-neutral-500">{card.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-fm-neutral-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group relative rounded-lg border border-fm-neutral-200 p-4 hover:border-fm-magenta-200 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className={`inline-flex p-2 rounded-lg ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-fm-neutral-900 group-hover:text-fm-magenta-700">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-fm-neutral-500">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-fm-neutral-400 group-hover:text-fm-magenta-700 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-fm-neutral-900">Recent Invoices</h2>
          <Link 
            href="/admin/invoice" 
            className="text-sm font-medium text-fm-magenta-700 hover:text-fm-magenta-800"
          >
            View all
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-fm-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-fm-neutral-900">No invoices</h3>
            <p className="mt-1 text-sm text-fm-neutral-500">
              Get started by creating your first invoice.
            </p>
            <div className="mt-6">
              <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                <Link href="/admin/invoice">Create Invoice</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-fm-neutral-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fm-neutral-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-fm-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fm-neutral-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-500">
                      {invoice.client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-900 font-medium">
                      {InvoiceUtils.formatCurrency(invoice.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-500">
                      {InvoiceUtils.formatDate(invoice.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}