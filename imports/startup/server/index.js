import { Meteor } from 'meteor/meteor';
import { seedDatabase } from './seedData';

// Import all server-side modules
import '../../api/core/tenant/TenantsCollection';
import '../../api/users/usersExtensions';
import '../../api/roles/RolesCollection';
import '../../api/audit/AuditLogsCollection';
import '../../api/notes/NotesCollection';
import '../../api/files/FilesCollection';
import '../../api/contacts/ContactsCollection';
import '../../api/core/settings/SystemSettingsCollection';
import '../../api/properties/PropertiesCollection';

// Import methods and publications
import '../../api/users/methods';
import '../../api/users/impersonation';
import '../../api/notes/methods';
import '../../api/files/methods';
import '../../api/contacts/methods';
import '../../api/roles/methods';
import '../../api/properties/methods';

import '../../api/users/publications';
import '../../api/notes/publications';
import '../../api/files/publications';
import '../../api/contacts/publications';
import '../../api/core/tenant/publications';
import '../../api/properties/publications';

import './syncPermissions'; // Sync permissions on startup
import './loginHooks'; // Track login stats

Meteor.startup(async () => {
    console.log('🚀 CreditForce - Server Startup');

    // Seed database with initial data
    await seedDatabase();

    console.log('✅ Server startup complete');
});
