'use client';

import { DashboardCard as Card, CardContent, CardHeader, CardTitle, DashboardButton } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import { TEAM_ROLES, type TeamRole } from '@/lib/admin/types';
import type {
  AssignedTeamMember,
  AvailableTeamMember,
  NewTeamAssignment,
} from '@/hooks/admin/useClientDetail';
import {
  Plus,
  Save,
  Users,
  UserMinus,
  Briefcase,
  Clock,
} from 'lucide-react';

interface TeamTabProps {
  assignedTeamMembers: AssignedTeamMember[];
  availableTeamMembers: AvailableTeamMember[];
  showAddTeamForm: boolean;
  setShowAddTeamForm: (show: boolean) => void;
  newTeamAssignment: NewTeamAssignment;
  setNewTeamAssignment: React.Dispatch<React.SetStateAction<NewTeamAssignment>>;
  onAddTeamMember: () => Promise<void>;
  onRemoveTeamMember: (member: AssignedTeamMember) => Promise<void>;
}

export function TeamTab({
  assignedTeamMembers,
  availableTeamMembers,
  showAddTeamForm,
  setShowAddTeamForm,
  newTeamAssignment,
  setNewTeamAssignment,
  onAddTeamMember,
  onRemoveTeamMember,
}: TeamTabProps) {
  return (
    <div className="space-y-6">
      {/* Team Assignment Form */}
      {showAddTeamForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Assign Team Member
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Select Team Member *"
                  value={newTeamAssignment.teamMemberId}
                  onChange={(e) =>
                    setNewTeamAssignment((prev) => ({ ...prev, teamMemberId: e.target.value }))
                  }
                  required
                >
                  <option value="">Choose a team member...</option>
                  {availableTeamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {TEAM_ROLES[member.role as TeamRole]}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Input
                  label="Weekly Hours"
                  type="number"
                  min={1}
                  max={40}
                  value={newTeamAssignment.hoursAllocated}
                  onChange={(e) =>
                    setNewTeamAssignment((prev) => ({
                      ...prev,
                      hoursAllocated: parseInt(e.target.value) || 1,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Role</label>
                <div className="flex items-center pt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTeamAssignment.isLead}
                      onChange={(e) =>
                        setNewTeamAssignment((prev) => ({ ...prev, isLead: e.target.checked }))
                      }
                      className="rounded border-fm-neutral-300 text-fm-magenta-600 focus:ring-fm-magenta-700"
                    />
                    <span className="ml-2 text-sm text-fm-neutral-700">Account Lead</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4 pt-4 border-t border-fm-neutral-200">
              <DashboardButton onClick={() => setShowAddTeamForm(false)} variant="outline">
                Cancel
              </DashboardButton>
              <DashboardButton
                onClick={onAddTeamMember}
                disabled={!newTeamAssignment.teamMemberId}
                className="flex items-center"
              >
                <Save className="h-4 w-4" />
                Assign Team Member
              </DashboardButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Team Members */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Assigned Team Members ({assignedTeamMembers.length})
            </CardTitle>
            <DashboardButton
              onClick={() => setShowAddTeamForm(true)}
              className="flex items-center"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Assign Member
            </DashboardButton>
          </div>
        </CardHeader>
        <CardContent>
          {assignedTeamMembers.length > 0 ? (
            <div className="space-y-4">
              {assignedTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-fm-magenta-100 flex items-center justify-center text-fm-magenta-600 font-medium text-sm">
                      {member.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-fm-neutral-900 truncate">{member.name}</h4>
                        {member.isLead && (
                          <Badge className="bg-fm-magenta-100 text-fm-magenta-800">Lead</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-fm-neutral-600 flex-wrap">
                        <span className="flex items-center">
                          <Briefcase className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          {TEAM_ROLES[member.role as TeamRole]}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          {member.hoursAllocated}h/week
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-13 sm:pl-0">
                    <StatusBadge status={member.status} />
                    <DashboardButton
                      onClick={() => onRemoveTeamMember(member)}
                      variant="danger-ghost"
                      size="sm"
                    >
                      <UserMinus className="h-4 w-4" />
                    </DashboardButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              title="No Team Members Assigned"
              description="This client doesn't have any team members assigned yet."
              action={
                <DashboardButton onClick={() => setShowAddTeamForm(true)}>
                  <Plus className="h-4 w-4" />
                  Assign First Member
                </DashboardButton>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
