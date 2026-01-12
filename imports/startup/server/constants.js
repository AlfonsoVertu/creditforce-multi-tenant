/**
 * Constants e Seed Data per CreditForce
 * Sistema gestione crediti multi-tenant
 */

import { PERMISSIONS_REGISTRY, ALL_PERMISSIONS } from '../../api/core/permissions/registry';

// Tenant iniziali - Banche e Istituti di Recupero Crediti
export const INITIAL_TENANTS = [
    {
        id: 't-alpha',
        name: 'Banca Credito Centrale',
        slug: 'banca-credito-centrale',
        plan: 'enterprise',
        limits: { maxPractices: 500, maxUsers: 20 },
        license: {
            status: 'active',
            validUntil: new Date('2027-12-31'),
            maxUsers: 20,
            storageLimit: 100,
            storageUsed: 45.2
        },
        stats: {
            totalLogins: 142,
            totalActiveSeconds: 86400,
            topTools: ['tool.practice.create', 'tool.contacts.create']
        },
        status: 'active'
    },
    {
        id: 't-beta',
        name: 'Finanza Recuperi SpA',
        slug: 'finanza-recuperi',
        plan: 'growth',
        limits: { maxPractices: 200, maxUsers: 10 },
        license: {
            status: 'active',
            validUntil: new Date('2027-06-30'),
            maxUsers: 10,
            storageLimit: 50,
            storageUsed: 12.8
        },
        stats: {
            totalLogins: 64,
            totalActiveSeconds: 43200,
            topTools: ['tool.practice.edit']
        },
        status: 'active'
    },
    {
        id: 't-gamma',
        name: 'Credit Solutions Srl',
        slug: 'credit-solutions',
        plan: 'basic',
        limits: { maxPractices: 50, maxUsers: 5 },
        license: {
            status: 'active',
            validUntil: new Date('2026-12-31'),
            maxUsers: 5,
            storageLimit: 20,
            storageUsed: 5.5
        },
        stats: {
            totalLogins: 12,
            totalActiveSeconds: 5000,
            topTools: ['tool.practice.create']
        },
        status: 'active'
    }
];

// Permission templates
export const INITIAL_TEMPLATES = [
    {
        id: 'tpl-basic',
        name: 'Plan Basic',
        description: 'Piano base con funzionalità limitate',
        targetRoles: ['tenant-admin'],
        permissions: [
            PERMISSIONS_REGISTRY.PAGE_DASHBOARD.id,
            PERMISSIONS_REGISTRY.PAGE_CONTACTS.id,
            PERMISSIONS_REGISTRY.PAGE_NOTES.id,
            PERMISSIONS_REGISTRY.TOOL_NOTES_CREATE.id,
            PERMISSIONS_REGISTRY.TOOL_CONTACTS_CREATE.id
        ]
    },
    {
        id: 'tpl-growth',
        name: 'Plan Growth',
        description: 'Piano intermedio con strumenti avanzati',
        targetRoles: ['tenant-admin'],
        permissions: [
            PERMISSIONS_REGISTRY.PAGE_DASHBOARD.id,
            PERMISSIONS_REGISTRY.PAGE_CONTACTS.id,
            PERMISSIONS_REGISTRY.PAGE_NOTES.id,
            PERMISSIONS_REGISTRY.PAGE_FILES.id,
            PERMISSIONS_REGISTRY.PAGE_USERS.id,
            PERMISSIONS_REGISTRY.TOOL_PROPERTY_CREATE.id,
            PERMISSIONS_REGISTRY.TOOL_PROPERTY_EDIT.id,
            PERMISSIONS_REGISTRY.TOOL_USER_INVITE.id,
            PERMISSIONS_REGISTRY.TOOL_NOTES_CREATE.id,
            PERMISSIONS_REGISTRY.TOOL_NOTES_DELETE.id,
            PERMISSIONS_REGISTRY.TOOL_FILES_UPLOAD.id,
            PERMISSIONS_REGISTRY.TOOL_CONTACTS_CREATE.id
        ]
    },
    {
        id: 'tpl-enterprise',
        name: 'Plan Enterprise',
        description: 'Piano completo con tutte le funzionalità',
        targetRoles: ['tenant-admin'],
        permissions: ALL_PERMISSIONS.filter(p => !p.includes('admin.impersonate'))
    },
    {
        id: 'tpl-agent-junior',
        name: 'Operatore Junior',
        description: 'Operatore con permessi limitati',
        targetRoles: ['agent'],
        permissions: [
            PERMISSIONS_REGISTRY.PAGE_DASHBOARD.id,
            PERMISSIONS_REGISTRY.PAGE_CONTACTS.id,
            PERMISSIONS_REGISTRY.PAGE_NOTES.id,
            PERMISSIONS_REGISTRY.TOOL_NOTES_CREATE.id,
            PERMISSIONS_REGISTRY.TOOL_CONTACTS_CREATE.id
        ]
    },
    {
        id: 'tpl-agent-senior',
        name: 'Operatore Senior',
        description: 'Operatore con permessi completi',
        targetRoles: ['agent'],
        permissions: [
            PERMISSIONS_REGISTRY.PAGE_DASHBOARD.id,
            PERMISSIONS_REGISTRY.PAGE_CONTACTS.id,
            PERMISSIONS_REGISTRY.PAGE_NOTES.id,
            PERMISSIONS_REGISTRY.PAGE_FILES.id,
            PERMISSIONS_REGISTRY.TOOL_PROPERTY_CREATE.id,
            PERMISSIONS_REGISTRY.TOOL_PROPERTY_EDIT.id,
            PERMISSIONS_REGISTRY.TOOL_NOTES_CREATE.id,
            PERMISSIONS_REGISTRY.TOOL_NOTES_DELETE.id,
            PERMISSIONS_REGISTRY.TOOL_NOTES_EXPORT.id,
            PERMISSIONS_REGISTRY.TOOL_FILES_UPLOAD.id,
            PERMISSIONS_REGISTRY.TOOL_CONTACTS_CREATE.id
        ]
    }
];

// Utenti iniziali (passwords saranno "password123")
export const INITIAL_USERS = [
    {
        email: 'admin@system.core',
        name: 'System Administrator',
        role: 'admin',
        tenantId: null, // Global
        jobTitle: 'Super Admin',
        assignedTemplateId: null,
        permissions: ALL_PERMISSIONS
    },
    // TENANT ALPHA (Enterprise) - Banca Credito Centrale
    {
        email: 'manager@banca-centrale.it',
        name: 'Laura Martini',
        role: 'tenant-admin',
        tenantId: 't-alpha',
        jobTitle: 'Responsabile Recupero Crediti',
        assignedTemplateId: 'tpl-enterprise',
        permissions: INITIAL_TEMPLATES[2].permissions
    },
    {
        email: 'marco.rossi@banca-centrale.it',
        name: 'Marco Rossi',
        role: 'agent',
        tenantId: 't-alpha',
        jobTitle: 'Specialista NPL',
        assignedTemplateId: 'tpl-agent-senior',
        permissions: INITIAL_TEMPLATES[4].permissions
    },
    {
        email: 'giulia.verdi@banca-centrale.it',
        name: 'Giulia Verdi',
        role: 'agent',
        tenantId: 't-alpha',
        jobTitle: 'Operatore Junior',
        assignedTemplateId: 'tpl-agent-junior',
        permissions: INITIAL_TEMPLATES[3].permissions
    },
    {
        email: 'luca.bianchi@banca-centrale.it',
        name: 'Luca Bianchi',
        role: 'agent',
        tenantId: 't-alpha',
        jobTitle: 'Analista Crediti',
        assignedTemplateId: 'tpl-agent-senior',
        permissions: INITIAL_TEMPLATES[4].permissions
    },

    // TENANT BETA (Growth) - Finanza Recuperi SpA
    {
        email: 'manager@finanza-recuperi.it',
        name: 'Paolo Ferri',
        role: 'tenant-admin',
        tenantId: 't-beta',
        jobTitle: 'Direttore Operativo',
        assignedTemplateId: 'tpl-growth',
        permissions: INITIAL_TEMPLATES[1].permissions
    },
    {
        email: 'elena.neri@finanza-recuperi.it',
        name: 'Elena Neri',
        role: 'agent',
        tenantId: 't-beta',
        jobTitle: 'Responsabile Telefonia',
        assignedTemplateId: 'tpl-agent-senior',
        permissions: INITIAL_TEMPLATES[4].permissions
    },
    {
        email: 'giorgio.gialli@finanza-recuperi.it',
        name: 'Giorgio Gialli',
        role: 'agent',
        tenantId: 't-beta',
        jobTitle: 'Operatore Call Center',
        assignedTemplateId: 'tpl-agent-junior',
        permissions: INITIAL_TEMPLATES[3].permissions
    },
    {
        email: 'sara.rossi@finanza-recuperi.it',
        name: 'Sara Rossi',
        role: 'agent',
        tenantId: 't-beta',
        jobTitle: 'Legale',
        assignedTemplateId: 'tpl-agent-senior',
        permissions: INITIAL_TEMPLATES[4].permissions
    },

    // TENANT GAMMA (Basic) - Credit Solutions Srl
    {
        email: 'manager@credit-solutions.it',
        name: 'Roberto Conti',
        role: 'tenant-admin',
        tenantId: 't-gamma',
        jobTitle: 'Titolare',
        assignedTemplateId: 'tpl-basic',
        permissions: INITIAL_TEMPLATES[0].permissions
    },
    {
        email: 'lisa.viola@credit-solutions.it',
        name: 'Lisa Viola',
        role: 'agent',
        tenantId: 't-gamma',
        jobTitle: 'Operatore',
        assignedTemplateId: 'tpl-agent-junior',
        permissions: INITIAL_TEMPLATES[3].permissions
    },

    // MULTI-TENANT USER (Belongs to Alpha and Beta)
    {
        email: 'multi.agent@demo.com',
        name: 'Multi Agent',
        role: 'agent',
        tenantId: 't-alpha', // Default context
        jobTitle: 'Consulente Esterno',
        assignedTemplateId: 'tpl-agent-senior',
        permissions: INITIAL_TEMPLATES[4].permissions
    }
];

// Note iniziali - Recupero Crediti
export const INITIAL_NOTES = [
    {
        title: 'Contatto Debitore - Pratica NPL-2024-001',
        content: 'Effettuato contatto telefonico. Debitore disponibile a piano rientro in 12 rate.',
        authorId: null,
        tenantId: 't-alpha'
    },
    {
        title: 'Richiesta Documentazione',
        content: 'Inviata richiesta visura catastale e estratto conto aggiornato per posizione deteriorata.',
        authorId: null,
        tenantId: 't-alpha'
    }
];

// Files mock iniziali
export const INITIAL_FILES = [
    {
        name: 'Contratto_Finanziamento_2024.pdf',
        size: '1.2 MB',
        type: 'PDF',
        uploaderId: null,
        uploaderName: 'Marco Rossi',
        uploaderTemplateId: 'tpl-agent-senior',
        tenantId: 't-alpha'
    },
    {
        name: 'Piano_Rientro_Proposta.pdf',
        size: '340 KB',
        type: 'PDF',
        uploaderId: null,
        uploaderName: 'Laura Martini',
        uploaderTemplateId: 'tpl-enterprise',
        tenantId: 't-alpha'
    }
];

// Contatti iniziali - Debitori
export const INITIAL_CONTACTS = [
    {
        name: 'Mario Bianchi',
        email: 'mario.bianchi@email.com',
        phone: '+39 333 1234567',
        type: 'debitore',
        tenantId: 't-alpha'
    },
    {
        name: 'Anna Neri',
        email: 'anna.neri@email.com',
        phone: '+39 338 7654321',
        type: 'garante',
        tenantId: 't-alpha'
    },
    {
        name: 'Luca Rossi',
        email: 'luca.rossi@email.com',
        phone: '+39 340 9876543',
        type: 'debitore',
        tenantId: 't-beta'
    }
];
