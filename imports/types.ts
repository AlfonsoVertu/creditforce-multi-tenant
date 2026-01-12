// Type Definitions for EstateNexus Core

export type Role = 'admin' | 'tenant-admin' | 'agent' | 'viewer';

export type PermissionType =
    // Pages
    | 'page.dashboard.view'
    | 'page.contacts.view'
    | 'page.notes.view'
    | 'page.files.view'
    | 'page.users.view'
    | 'page.audit.view'
    | 'page.billing.view'
    | 'page.docs.view'
    // Tools
    | 'tool.property.create'
    | 'tool.property.edit'
    | 'tool.property.delete'
    | 'tool.user.invite'
    | 'tool.user.role.update'
    | 'tool.user.disable'
    | 'tool.tenant.settings.update'
    | 'tool.admin.impersonate'
    | 'tool.data.export'
    | 'tool.notes.create'
    | 'tool.notes.delete'
    | 'tool.notes.export'
    | 'tool.files.upload'
    | 'tool.files.delete'
    | 'tool.contacts.create';

export interface User {
    _id: string;
    emails: { address: string; verified: boolean }[];
    profile: {
        name: string;
        tenantId?: string;
        jobTitle: string;
        avatar: string;
        assignedTemplateId?: string;
    };
    roles: Record<string, string[]>; // { [tenantId]: ['role1', 'role2'] }
    permissions: PermissionType[];
    stats: {
        lastLogin: Date;
        totalSessions: number;
        pagesVisited: number;
        activeSeconds: number;
        toolsUsed: Record<string, number>;
    };
    createdAt: Date;
}

export interface Tenant {
    _id: string;
    name: string;
    slug: string;
    plan: 'basic' | 'growth' | 'enterprise';
    settings: Record<string, any>;
    limits: {
        maxProperties: number;
        maxUsers: number;
    };
    license: {
        status: 'active' | 'suspended' | 'trial' | 'expired';
        validUntil: Date;
        maxUsers: number;
        storageLimit: number;
        storageUsed: number;
    };
    stats: {
        totalLogins: number;
        totalActiveSeconds: number;
        topTools: string[];
    };
    status: 'active' | 'suspended' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

export interface AuditLog {
    _id: string;
    tenantId?: string;
    userId: string;
    action: string;
    details: Record<string, any>;
    ipAddress?: string;
    createdAt: Date;
}

export interface Note {
    _id: string;
    title: string;
    content: string;
    authorId: string;
    tenantId: string;
    createdAt: Date;
}

export interface UploadedFile {
    _id: string;
    name: string;
    size: string;
    type: string;
    uploaderId: string;
    uploaderName: string;
    uploaderTemplateId?: string;
    tenantId: string;
    createdAt: Date;
}

export interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    type: 'buyer' | 'seller' | 'lead';
    tenantId: string;
    createdAt: Date;
}

export interface PermissionTemplate {
    _id: string;
    name: string;
    description: string;
    permissions: PermissionType[];
    targetRoles: Role[];
}

export interface EnvVar {
    id: string;
    key: string;
    value: string;
}
