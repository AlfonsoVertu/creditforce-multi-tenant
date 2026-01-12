import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import '/imports/api/core/tenant/TenantsCollection';
import '/imports/api/core/tenant/methods';
import '/imports/api/users/usersExtensions';
import '/imports/api/roles/RolesCollection';
import '/imports/api/audit/AuditLogsCollection';
import '/imports/api/notes/NotesCollection';
import '/imports/api/files/FilesCollection';
import '/imports/api/contacts/ContactsCollection';
import '/imports/api/properties/PropertiesCollection';
// Practice Management (Pratica Tool)
import '/imports/api/practices/PracticesCollection';
import '/imports/api/practices/methods';
import '/imports/api/practices/publications';
// Dev tools (REMOVE IN PRODUCTION)
import '/imports/startup/server/devReset';

Meteor.startup(async () => {
    console.log('🚀 CreditForce Server Started');
    console.log('📦 MongoDB URL:', process.env.MONGO_URL);
    console.log('🌐 Root URL:', process.env.ROOT_URL || Meteor.absoluteUrl());
});
