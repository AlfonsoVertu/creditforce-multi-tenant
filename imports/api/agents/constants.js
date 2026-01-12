import { PERMISSIONS } from '/imports/api/core/permissions/registry';
import { DOCUMENT_GROUPS, DOCUMENT_SENSITIVITY } from '/imports/api/files/constants';

/**
 * Default Agent Roles for Practice Management
 * Each tenant will have these 7 agents auto-created
 */

export const AGENT_ROLES = {
    MANDANTE: 'mandante',
    SERVICER: 'servicer',
    PHONE_COLLECTION: 'phone_collection',
    HOME_COLLECTION: 'home_collection',
    LEGAL: 'legal',
    INVESTIGATOR: 'investigator',
    VALUATOR: 'valuator'
};

/**
 * Default Agent Definitions
 * Used when auto-creating agents for a new tenant
 */
export const DEFAULT_AGENTS = [
    {
        role: AGENT_ROLES.MANDANTE,
        name: 'Banca / Mandante',
        jobTitle: 'Mandante Creditor',
        emailSuffix: 'mandante',
        description: 'Controlla pratiche proprie, carica documenti richiesti, monitora avanzamento.',
        documentGroups: [
            DOCUMENT_GROUPS.G1_CREDIT,
            DOCUMENT_GROUPS.G2_OWNERSHIP,
            DOCUMENT_GROUPS.G3_COMMUNICATION,
            DOCUMENT_GROUPS.G4_COLLATERAL,
            DOCUMENT_GROUPS.G6_COMPLIANCE
        ],
        sensitivityMax: DOCUMENT_SENSITIVITY.L3_HIGH, // Vede L3 solo dei propri fascicoli
        actions: ['view', 'preview', 'download', 'upload'],
        defaultPermissions: [
            PERMISSIONS.PAGES.DASHBOARD,
            PERMISSIONS.PAGES.FILES,
            PERMISSIONS.TOOLS.FILES_UPLOAD
        ]
    },
    {
        role: AGENT_ROLES.SERVICER,
        name: 'Master / Specialist Servicer',
        jobTitle: 'Servicer Specialist',
        emailSuffix: 'servicer',
        description: 'Gestisce pipeline, assegna utenti, richiede documenti, avanzamento step.',
        documentGroups: Object.values(DOCUMENT_GROUPS), // All
        sensitivityMax: DOCUMENT_SENSITIVITY.L3_HIGH,
        actions: ['view', 'preview', 'download', 'upload', 'request', 'validate'],
        defaultPermissions: [
            PERMISSIONS.PAGES.DASHBOARD,
            PERMISSIONS.PAGES.CONTACTS,
            PERMISSIONS.PAGES.NOTES,
            PERMISSIONS.PAGES.FILES,
            PERMISSIONS.PAGES.USER_MANAGEMENT,
            PERMISSIONS.TOOLS.USER_INVITE,
            PERMISSIONS.TOOLS.FILES_UPLOAD,
            PERMISSIONS.TOOLS.FILES_DELETE,
            PERMISSIONS.TOOLS.NOTES_CREATE,
            PERMISSIONS.TOOLS.CONTACTS_CREATE
        ]
    },
    {
        role: AGENT_ROLES.PHONE_COLLECTION,
        name: 'Recupero Telefonico',
        jobTitle: 'Phone Collection Agent',
        emailSuffix: 'phone',
        description: 'Negoziazione, call action, gestione contatti e piano rientro.',
        documentGroups: [
            DOCUMENT_GROUPS.G1_CREDIT,
            DOCUMENT_GROUPS.G3_COMMUNICATION,
            DOCUMENT_GROUPS.G7_INTERNAL
        ],
        sensitivityMax: DOCUMENT_SENSITIVITY.L2_MEDIUM, // MAI L3
        actions: ['view', 'preview', 'upload', 'request'],
        defaultPermissions: [
            PERMISSIONS.PAGES.DASHBOARD,
            PERMISSIONS.PAGES.CONTACTS,
            PERMISSIONS.PAGES.NOTES,
            PERMISSIONS.TOOLS.NOTES_CREATE,
            PERMISSIONS.TOOLS.CONTACTS_CREATE
        ]
    },
    {
        role: AGENT_ROLES.HOME_COLLECTION,
        name: 'Recupero Domiciliare',
        jobTitle: 'Home Collection Agent',
        emailSuffix: 'home',
        description: 'Visite domiciliari, verifica asset, negoziazione in loco.',
        documentGroups: [
            DOCUMENT_GROUPS.G1_CREDIT,
            DOCUMENT_GROUPS.G3_COMMUNICATION,
            DOCUMENT_GROUPS.G4_COLLATERAL, // Può vedere perizie sintetiche
            DOCUMENT_GROUPS.G7_INTERNAL
        ],
        sensitivityMax: DOCUMENT_SENSITIVITY.L2_MEDIUM, // MAI L3
        actions: ['view', 'preview', 'upload', 'request'],
        defaultPermissions: [
            PERMISSIONS.PAGES.DASHBOARD,
            PERMISSIONS.PAGES.CONTACTS,
            PERMISSIONS.PAGES.NOTES,
            PERMISSIONS.TOOLS.NOTES_CREATE,
            PERMISSIONS.TOOLS.CONTACTS_CREATE,
            PERMISSIONS.TOOLS.FILES_UPLOAD
        ]
    },
    {
        role: AGENT_ROLES.LEGAL,
        name: 'Ufficio Legale',
        jobTitle: 'Legal Specialist',
        emailSuffix: 'legal',
        description: 'Rende fascicolo agibile e avvia azioni legali/notifiche.',
        documentGroups: [
            DOCUMENT_GROUPS.G1_CREDIT,
            DOCUMENT_GROUPS.G2_OWNERSHIP,
            DOCUMENT_GROUPS.G3_COMMUNICATION,
            DOCUMENT_GROUPS.G4_COLLATERAL,
            DOCUMENT_GROUPS.G6_COMPLIANCE,
            DOCUMENT_GROUPS.G7_INTERNAL
        ],
        sensitivityMax: DOCUMENT_SENSITIVITY.L3_HIGH,
        actions: ['view', 'preview', 'download', 'upload', 'request', 'validate'],
        defaultPermissions: [
            PERMISSIONS.PAGES.DASHBOARD,
            PERMISSIONS.PAGES.CONTACTS,
            PERMISSIONS.PAGES.NOTES,
            PERMISSIONS.PAGES.FILES,
            PERMISSIONS.TOOLS.FILES_UPLOAD,
            PERMISSIONS.TOOLS.NOTES_CREATE,
            PERMISSIONS.TOOLS.CONTACTS_CREATE
        ]
    },
    {
        role: AGENT_ROLES.INVESTIGATOR,
        name: 'Investigatore',
        jobTitle: 'Investigator',
        emailSuffix: 'investigator',
        description: 'Reperibilità, asset tracing, segnali e prove.',
        documentGroups: [
            DOCUMENT_GROUPS.G1_CREDIT, // Anagrafica minima
            DOCUMENT_GROUPS.G4_COLLATERAL, // Sintesi
            DOCUMENT_GROUPS.G5_THIRD_PARTY // Full access
        ],
        sensitivityMax: DOCUMENT_SENSITIVITY.L3_HIGH, // L3 only on G5
        actions: ['view', 'preview', 'download', 'upload'],
        defaultPermissions: [
            PERMISSIONS.PAGES.DASHBOARD,
            PERMISSIONS.PAGES.FILES,
            PERMISSIONS.TOOLS.FILES_UPLOAD
        ]
    },
    {
        role: AGENT_ROLES.VALUATOR,
        name: 'Valutatore',
        jobTitle: 'Valuator / Perito',
        emailSuffix: 'valuator',
        description: 'Stima realizzo collateral, ROI, tempi asta.',
        documentGroups: [
            DOCUMENT_GROUPS.G1_CREDIT, // Importi e anzianità
            DOCUMENT_GROUPS.G4_COLLATERAL, // Full
            DOCUMENT_GROUPS.G5_THIRD_PARTY, // Evidenze utili
            DOCUMENT_GROUPS.G7_INTERNAL // Report sezione economica
        ],
        sensitivityMax: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        actions: ['view', 'preview', 'download', 'upload'],
        defaultPermissions: [
            PERMISSIONS.PAGES.DASHBOARD,
            PERMISSIONS.PAGES.FILES,
            PERMISSIONS.TOOLS.FILES_UPLOAD
        ]
    }
];

/**
 * Generate email for default agent
 * @param {string} tenantSlug - Tenant identifier slug
 * @param {string} agentEmailSuffix - Agent email suffix
 * @returns {string} Generated email
 */
export const generateAgentEmail = (tenantSlug, agentEmailSuffix) => {
    const sanitizedSlug = tenantSlug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${agentEmailSuffix}@${sanitizedSlug}.internal`;
};

/**
 * Get agent definition by role
 * @param {string} role 
 * @returns {object|null}
 */
export const getAgentDefinition = (role) => {
    return DEFAULT_AGENTS.find(a => a.role === role) || null;
};
