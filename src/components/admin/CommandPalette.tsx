'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Calendar,
  Search,
  Sparkles,
  Settings,
  Shield,
  UserCog,
  Presentation,
  Plus,
} from 'lucide-react';

const pages = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, group: 'Navigation' },
  { label: 'Clients', href: '/admin/clients', icon: Users, group: 'Navigation' },
  { label: 'Projects', href: '/admin/projects', icon: Briefcase, group: 'Navigation' },
  { label: 'Content Calendar', href: '/admin/content', icon: Calendar, group: 'Navigation' },
  { label: 'Invoices', href: '/admin/invoice', icon: FileText, group: 'Navigation' },
  { label: 'Proposals', href: '/admin/proposals', icon: Presentation, group: 'Navigation' },
  { label: 'Team', href: '/admin/team', icon: Users, group: 'Navigation' },
  { label: 'Discovery', href: '/admin/discovery', icon: Search, group: 'Navigation' },
  { label: 'CreativeMinds', href: '/admin/creativeminds', icon: Sparkles, group: 'Navigation' },
  { label: 'User Management', href: '/admin/users', icon: UserCog, group: 'Navigation' },
  { label: 'Admin System', href: '/admin/system', icon: Shield, group: 'Navigation' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, group: 'Navigation' },
];

const quickActions = [
  { label: 'New Project', href: '/admin/projects/new', icon: Plus, group: 'Quick Actions' },
  { label: 'New Content', href: '/admin/content/new', icon: Plus, group: 'Quick Actions' },
  { label: 'Create Invoice', href: '/admin/invoice', icon: Plus, group: 'Quick Actions' },
  { label: 'New Discovery', href: '/admin/discovery/new', icon: Plus, group: 'Quick Actions' },
  { label: 'Add Team Member', href: '/admin/team/new', icon: Plus, group: 'Quick Actions' },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <CommandItem
                key={page.href}
                value={page.label}
                onSelect={() => navigate(page.href)}
              >
                <Icon className="mr-2 h-4 w-4 text-fm-neutral-500" />
                {page.label}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <CommandItem
                key={action.href + action.label}
                value={action.label}
                onSelect={() => navigate(action.href)}
              >
                <Icon className="mr-2 h-4 w-4 text-fm-magenta-600" />
                {action.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
