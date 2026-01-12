export const PERMISSIONS = {
    // ==========================================
    // PERMESSI PAGINA (Navigazione UI)
    // ==========================================
    PAGES: {
        DASHBOARD: 'page.dashboard.view',
        PROPERTIES_LIST: 'page.properties.list',
        PROPERTIES_DETAIL: 'page.properties.detail',
        USER_MANAGEMENT: 'page.users.view',
        AUDIT_LOGS: 'page.audit.view',
        BILLING: 'page.billing.view',
        DOCS: 'page.documentation.view',
        CONTACTS: 'page.contacts.view',
        NOTES: 'page.notes.view',
        FILES: 'page.files.view',
        TEMPLATES: 'page.templates.view',
    },

    // ==========================================
    // PERMESSI TOOL (Azioni CRUD/Backend)
    // ==========================================
    TOOLS: {
        PROPERTY_CREATE: 'tool.property.create',
        PROPERTY_EDIT: 'tool.property.edit',
        PROPERTY_DELETE: 'tool.property.delete',
        PROPERTY_PUBLISH: 'tool.property.publish',

        USER_INVITE: 'tool.user.invite',
        USER_UPDATE_ROLE: 'tool.user.role.update',
        USER_DISABLE: 'tool.user.disable',

        TENANT_SETTINGS: 'tool.tenant.settings.update',
        IMPERSONATE: 'tool.admin.impersonate',
        EXPORT_DATA: 'tool.data.export',

        // Notes
        NOTES_CREATE: 'tool.notes.create',
        NOTES_DELETE: 'tool.notes.delete',
        NOTES_EXPORT: 'tool.notes.export',

        // Files
        FILES_UPLOAD: 'tool.files.upload',
        FILES_DELETE: 'tool.files.delete',

        // Contacts
        CONTACTS_CREATE: 'tool.contacts.create',
        CONTACTS_EDIT: 'tool.contacts.edit',
        CONTACTS_DELETE: 'tool.contacts.delete'
    }
};

export const ALL_PERMISSIONS = [
    ...Object.values(PERMISSIONS.PAGES),
    ...Object.values(PERMISSIONS.TOOLS)
];

// Keep backwards compatibility for existing code momentarily
export const PERMISSIONS_REGISTRY = {
    // Combine all for flat usage if needed, or alias
    ...Object.values(PERMISSIONS.PAGES).reduce((acc, val) => ({ ...acc, [val]: { id: val, label: val } }), {}),
    ...Object.values(PERMISSIONS.TOOLS).reduce((acc, val) => ({ ...acc, [val]: { id: val, label: val } }), {}),
    // Explicit mappings for old keys used in code
    PAGE_DASHBOARD: { id: PERMISSIONS.PAGES.DASHBOARD },
    PAGE_PROPERTIES_LIST: { id: PERMISSIONS.PAGES.PROPERTIES_LIST },
    PAGE_CONTACTS: { id: PERMISSIONS.PAGES.CONTACTS },
    PAGE_NOTES: { id: PERMISSIONS.PAGES.NOTES },
    PAGE_FILES: { id: PERMISSIONS.PAGES.FILES },
    PAGE_USERS: { id: PERMISSIONS.PAGES.USER_MANAGEMENT },
    PAGE_TEMPLATES: { id: PERMISSIONS.PAGES.TEMPLATES },
    PAGE_BILLING: { id: PERMISSIONS.PAGES.BILLING },
    TOOL_PROPERTY_CREATE: { id: PERMISSIONS.TOOLS.PROPERTY_CREATE },
    TOOL_USER_INVITE: { id: PERMISSIONS.TOOLS.USER_INVITE },
    TOOL_USER_UPDATE_ROLE: { id: PERMISSIONS.TOOLS.USER_UPDATE_ROLE },
    TOOL_NOTES_CREATE: { id: PERMISSIONS.TOOLS.NOTES_CREATE },
    TOOL_NOTES_DELETE: { id: PERMISSIONS.TOOLS.NOTES_DELETE },
    TOOL_NOTES_EXPORT: { id: PERMISSIONS.TOOLS.NOTES_EXPORT },
    TOOL_FILES_UPLOAD: { id: PERMISSIONS.TOOLS.FILES_UPLOAD },
    TOOL_FILES_DELETE: { id: PERMISSIONS.TOOLS.FILES_DELETE },
    TOOL_CONTACTS_CREATE: { id: PERMISSIONS.TOOLS.CONTACTS_CREATE },
    TOOL_CONTACTS_EDIT: { id: PERMISSIONS.TOOLS.CONTACTS_EDIT },
    TOOL_CONTACTS_DELETE: { id: PERMISSIONS.TOOLS.CONTACTS_DELETE },
    TOOL_PROPERTY_EDIT: { id: PERMISSIONS.TOOLS.PROPERTY_EDIT },
    TOOL_PROPERTY_DELETE: { id: PERMISSIONS.TOOLS.PROPERTY_DELETE },
};

export const DEFAULT_ROLE_PERMISSIONS = {
    'admin': [
        // All permissions
        ...Object.values(PERMISSIONS.PAGES),
        ...Object.values(PERMISSIONS.TOOLS)
    ],
    'tenant-admin': [
        PERMISSIONS.PAGES.DASHBOARD,
        PERMISSIONS.PAGES.PROPERTIES_LIST,
        PERMISSIONS.PAGES.CONTACTS,
        PERMISSIONS.PAGES.NOTES,
        PERMISSIONS.PAGES.FILES,
        PERMISSIONS.PAGES.USER_MANAGEMENT,
        PERMISSIONS.PAGES.TEMPLATES,
        PERMISSIONS.PAGES.BILLING,

        PERMISSIONS.TOOLS.PROPERTY_CREATE,
        PERMISSIONS.TOOLS.PROPERTY_EDIT,
        PERMISSIONS.TOOLS.PROPERTY_DELETE,
        PERMISSIONS.TOOLS.USER_INVITE,
        PERMISSIONS.TOOLS.USER_UPDATE_ROLE,
        PERMISSIONS.TOOLS.USER_DISABLE,
        PERMISSIONS.TOOLS.TENANT_SETTINGS,
        PERMISSIONS.TOOLS.NOTES_CREATE,
        PERMISSIONS.TOOLS.NOTES_DELETE,
        PERMISSIONS.TOOLS.NOTES_EXPORT,
        PERMISSIONS.TOOLS.FILES_UPLOAD,
        PERMISSIONS.TOOLS.FILES_DELETE,
        PERMISSIONS.TOOLS.CONTACTS_CREATE,
        PERMISSIONS.TOOLS.CONTACTS_EDIT,
        PERMISSIONS.TOOLS.CONTACTS_DELETE
    ],
    'agent': [
        PERMISSIONS.PAGES.DASHBOARD,
        PERMISSIONS.PAGES.PROPERTIES_LIST,
        PERMISSIONS.PAGES.CONTACTS,
        PERMISSIONS.PAGES.NOTES,
        PERMISSIONS.PAGES.FILES,

        PERMISSIONS.TOOLS.PROPERTY_CREATE,
        PERMISSIONS.TOOLS.PROPERTY_EDIT,

        PERMISSIONS.TOOLS.NOTES_CREATE,
        PERMISSIONS.TOOLS.NOTES_DELETE, // Only own
        PERMISSIONS.TOOLS.NOTES_EXPORT,

        PERMISSIONS.TOOLS.FILES_UPLOAD,

        PERMISSIONS.TOOLS.CONTACTS_CREATE
    ]
};
