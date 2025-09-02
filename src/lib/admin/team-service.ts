/**
 * Team Management Service
 * Comprehensive team member management for Freaking Minds Agency
 */

import { 
  TeamMember, 
  TeamRole, 
  TeamDepartment, 
  TeamAssignment, 
  TeamMetrics,
  TEAM_ROLES,
  TEAM_DEPARTMENTS,
  COMMON_SKILLS
} from './types';

export class TeamService {
  private static readonly STORAGE_KEYS = {
    TEAM_MEMBERS: 'fm_team_members',
    TEAM_ASSIGNMENTS: 'fm_team_assignments',
  };

  // ===== TEAM MEMBER MANAGEMENT =====

  static getAllTeamMembers(): TeamMember[] {
    try {
      const members = localStorage.getItem(this.STORAGE_KEYS.TEAM_MEMBERS);
      return members ? JSON.parse(members) : this.getDefaultTeamMembers();
    } catch (error) {
      console.error('Error loading team members:', error);
      return this.getDefaultTeamMembers();
    }
  }

  static getActiveTeamMembers(): TeamMember[] {
    return this.getAllTeamMembers().filter(member => member.status === 'active');
  }

  static getTeamMemberById(id: string): TeamMember | null {
    const members = this.getAllTeamMembers();
    return members.find(member => member.id === id) || null;
  }

  static saveTeamMember(member: TeamMember): void {
    const members = this.getAllTeamMembers();
    const existingIndex = members.findIndex(m => m.id === member.id);
    
    if (existingIndex >= 0) {
      members[existingIndex] = { ...member, updatedAt: new Date().toISOString() };
    } else {
      members.push({ ...member, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(this.STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
  }

  static deleteTeamMember(id: string): void {
    const members = this.getAllTeamMembers().filter(member => member.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
    
    // Also remove from assignments
    this.removeTeamMemberFromAllAssignments(id);
  }

  static getTeamMembersByRole(role: TeamRole): TeamMember[] {
    return this.getAllTeamMembers().filter(member => member.role === role);
  }

  static getTeamMembersByDepartment(department: TeamDepartment): TeamMember[] {
    return this.getAllTeamMembers().filter(member => member.department === department);
  }

  static getTeamMembersByType(type: 'employee' | 'freelancer' | 'contractor'): TeamMember[] {
    return this.getAllTeamMembers().filter(member => member.type === type);
  }

  static searchTeamMembers(query: string): TeamMember[] {
    const searchTerm = query.toLowerCase();
    return this.getAllTeamMembers().filter(member =>
      member.name.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      TEAM_ROLES[member.role].toLowerCase().includes(searchTerm) ||
      member.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }

  static getTeamMembersBySkill(skill: string): TeamMember[] {
    return this.getAllTeamMembers().filter(member =>
      member.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  // ===== TEAM ASSIGNMENTS =====

  static getAllAssignments(): TeamAssignment[] {
    try {
      const assignments = localStorage.getItem(this.STORAGE_KEYS.TEAM_ASSIGNMENTS);
      return assignments ? JSON.parse(assignments) : [];
    } catch (error) {
      console.error('Error loading team assignments:', error);
      return [];
    }
  }

  static saveAssignment(assignment: TeamAssignment): void {
    const assignments = this.getAllAssignments();
    const existingIndex = assignments.findIndex(a => a.id === assignment.id);
    
    if (existingIndex >= 0) {
      assignments[existingIndex] = assignment;
    } else {
      assignments.push(assignment);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.TEAM_ASSIGNMENTS, JSON.stringify(assignments));
    
    // Update team member's client assignments
    this.updateTeamMemberAssignments(assignment.teamMemberId);
  }

  static getAssignmentsByTeamMember(teamMemberId: string): TeamAssignment[] {
    return this.getAllAssignments().filter(assignment => 
      assignment.teamMemberId === teamMemberId
    );
  }

  static getAssignmentsByClient(clientId: string): TeamAssignment[] {
    return this.getAllAssignments().filter(assignment => 
      assignment.clientId === clientId && assignment.status === 'active'
    );
  }

  static removeAssignment(assignmentId: string): void {
    const assignments = this.getAllAssignments().filter(a => a.id !== assignmentId);
    localStorage.setItem(this.STORAGE_KEYS.TEAM_ASSIGNMENTS, JSON.stringify(assignments));
  }

  static removeTeamMemberFromAllAssignments(teamMemberId: string): void {
    const assignments = this.getAllAssignments().filter(a => a.teamMemberId !== teamMemberId);
    localStorage.setItem(this.STORAGE_KEYS.TEAM_ASSIGNMENTS, JSON.stringify(assignments));
  }

  private static updateTeamMemberAssignments(teamMemberId: string): void {
    const member = this.getTeamMemberById(teamMemberId);
    if (!member) return;

    const assignments = this.getAssignmentsByTeamMember(teamMemberId);
    const activeAssignments = assignments.filter(a => a.status === 'active');
    
    member.assignedClients = activeAssignments.map(a => a.clientId);
    member.currentProjects = activeAssignments.map(a => a.projectId).filter(Boolean) as string[];
    member.workload = this.calculateTeamMemberWorkload(teamMemberId);
    
    this.saveTeamMember(member);
  }

  private static calculateTeamMemberWorkload(teamMemberId: string): number {
    const member = this.getTeamMemberById(teamMemberId);
    if (!member) return 0;

    const assignments = this.getAssignmentsByTeamMember(teamMemberId)
      .filter(a => a.status === 'active');
    
    const totalAllocatedHours = assignments.reduce((sum, a) => sum + a.hoursAllocated, 0);
    return Math.round((totalAllocatedHours / member.capacity) * 100);
  }

  // ===== TEAM ANALYTICS & METRICS =====

  static getTeamMetrics(): TeamMetrics {
    const allMembers = this.getAllTeamMembers();
    const activeMembers = allMembers.filter(m => m.status === 'active');
    
    const employees = allMembers.filter(m => m.type === 'employee').length;
    const freelancers = allMembers.filter(m => m.type === 'freelancer').length;
    
    const totalCapacity = activeMembers.reduce((sum, m) => sum + m.capacity, 0);
    const totalWorkload = activeMembers.reduce((sum, m) => sum + (m.workload * m.capacity / 100), 0);
    const avgUtilization = totalCapacity > 0 ? Math.round((totalWorkload / totalCapacity) * 100) : 0;

    // Department breakdown
    const departmentBreakdown = {} as Record<TeamDepartment, number>;
    Object.keys(TEAM_DEPARTMENTS).forEach(dept => {
      departmentBreakdown[dept as TeamDepartment] = activeMembers.filter(m => m.department === dept).length;
    });

    // Skills breakdown
    const skillsBreakdown: Record<string, number> = {};
    activeMembers.forEach(member => {
      member.skills.forEach(skill => {
        skillsBreakdown[skill] = (skillsBreakdown[skill] || 0) + 1;
      });
    });

    return {
      totalMembers: allMembers.length,
      activeMembers: activeMembers.length,
      employees,
      freelancers,
      avgUtilization,
      totalCapacity,
      departmentBreakdown,
      skillsBreakdown
    };
  }

  static getAvailableTeamMembers(): TeamMember[] {
    return this.getActiveTeamMembers().filter(member => member.workload < 90);
  }

  static getOverloadedTeamMembers(): TeamMember[] {
    return this.getActiveTeamMembers().filter(member => member.workload > 100);
  }

  static getTeamMembersByCapacityRange(minHours: number, maxHours: number): TeamMember[] {
    return this.getActiveTeamMembers().filter(member => 
      member.capacity >= minHours && member.capacity <= maxHours
    );
  }

  // ===== CLIENT INTEGRATION =====

  static getTeamMembersForClient(clientId: string): TeamMember[] {
    const assignments = this.getAssignmentsByClient(clientId);
    const memberIds = assignments.map(a => a.teamMemberId);
    return this.getAllTeamMembers().filter(member => memberIds.includes(member.id));
  }

  static assignTeamMemberToClient(teamMemberId: string, clientId: string, hoursAllocated: number, isLead = false): void {
    const assignment: TeamAssignment = {
      id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      teamMemberId,
      clientId,
      role: 'Team Member',
      startDate: new Date().toISOString().split('T')[0],
      hoursAllocated,
      isLead,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.saveAssignment(assignment);
  }

  static removeTeamMemberFromClient(teamMemberId: string, clientId: string): void {
    const assignments = this.getAllAssignments().filter(a => 
      !(a.teamMemberId === teamMemberId && a.clientId === clientId)
    );
    localStorage.setItem(this.STORAGE_KEYS.TEAM_ASSIGNMENTS, JSON.stringify(assignments));
    this.updateTeamMemberAssignments(teamMemberId);
  }

  // ===== UTILITY METHODS =====

  static generateTeamMemberId(): string {
    return `tm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static validateTeamMemberData(member: Partial<TeamMember>): string[] {
    const errors: string[] = [];

    if (!member.name?.trim()) errors.push('Name is required');
    if (!member.email?.trim()) errors.push('Email is required');
    if (!member.phone?.trim()) errors.push('Phone is required');
    if (!member.role) errors.push('Role is required');
    if (!member.department) errors.push('Department is required');
    if (!member.type) errors.push('Employment type is required');
    if (!member.compensation?.amount || member.compensation.amount <= 0) {
      errors.push('Valid compensation amount is required');
    }

    // Email validation
    if (member.email && !/\S+@\S+\.\S+/.test(member.email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }

  // ===== DEFAULT DATA =====

  private static getDefaultTeamMembers(): TeamMember[] {
    return [
      {
        id: 'tm-001',
        name: 'Aaryavar Singh',
        email: 'aaryavar@freakingminds.in',
        phone: '+91 91760 84110',
        type: 'employee',
        status: 'active',
        startDate: '2023-01-01',
        role: 'creative-director',
        department: 'creative',
        seniority: 'director',
        skills: ['Brand Strategy', 'Creative Direction', 'Client Communication', 'Project Management'],
        certifications: [],
        compensation: {
          type: 'salary',
          amount: 80000,
          currency: 'INR',
          billingRate: 2000
        },
        workType: 'full-time',
        location: 'hybrid',
        capacity: 40,
        assignedClients: [],
        currentProjects: [],
        workload: 85,
        clientRatings: 4.9,
        tasksCompleted: 145,
        efficiency: 95,
        documents: [],
        notes: 'Founder and Creative Director',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tm-002',
        name: 'Priya Sharma',
        email: 'priya@freakingminds.in',
        phone: '+91 98765 43210',
        type: 'employee',
        status: 'active',
        startDate: '2023-03-15',
        role: 'social-media-manager',
        department: 'creative',
        seniority: 'senior',
        skills: ['Instagram Marketing', 'Facebook Ads', 'Content Strategy', 'Adobe Photoshop'],
        certifications: [],
        compensation: {
          type: 'salary',
          amount: 45000,
          currency: 'INR',
          billingRate: 1200
        },
        workType: 'full-time',
        location: 'office',
        capacity: 40,
        assignedClients: [],
        currentProjects: [],
        workload: 75,
        clientRatings: 4.7,
        tasksCompleted: 98,
        efficiency: 88,
        documents: [],
        notes: 'Excellent at social media strategy and client communication',
        createdAt: '2023-03-15T00:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tm-003',
        name: 'Rahul Kumar',
        email: 'rahul.dev@freakingminds.in',
        phone: '+91 87654 32109',
        type: 'freelancer',
        status: 'active',
        startDate: '2023-06-01',
        role: 'web-developer',
        department: 'technology',
        seniority: 'senior',
        skills: ['React', 'Next.js', 'WordPress', 'API Integration', 'Database Management'],
        certifications: [],
        compensation: {
          type: 'hourly',
          amount: 800,
          currency: 'INR',
          billingRate: 1500
        },
        workType: 'freelance',
        location: 'remote',
        capacity: 25,
        assignedClients: [],
        currentProjects: [],
        workload: 60,
        clientRatings: 4.8,
        tasksCompleted: 67,
        efficiency: 92,
        documents: [],
        notes: 'Reliable freelance developer with excellent technical skills',
        createdAt: '2023-06-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tm-004',
        name: 'Sneha Patel',
        email: 'sneha@freakingminds.in',
        phone: '+91 76543 21098',
        type: 'employee',
        status: 'active',
        startDate: '2023-05-01',
        role: 'graphic-designer',
        department: 'creative',
        seniority: 'mid',
        skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Brand Identity', 'UI/UX Design'],
        certifications: [],
        compensation: {
          type: 'salary',
          amount: 38000,
          currency: 'INR',
          billingRate: 1000
        },
        workType: 'full-time',
        location: 'office',
        capacity: 40,
        assignedClients: [],
        currentProjects: [],
        workload: 70,
        clientRatings: 4.6,
        tasksCompleted: 89,
        efficiency: 85,
        documents: [],
        notes: 'Creative and detail-oriented designer',
        createdAt: '2023-05-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
    ];
  }
}