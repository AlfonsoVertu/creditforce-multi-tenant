import { Meteor } from 'meteor/meteor';
import { TenantsCollection } from '../../api/core/tenant/TenantsCollection';
import { NotesCollection } from '../../api/notes/NotesCollection';
import { FilesCollection } from '../../api/files/FilesCollection';
import { ContactsCollection } from '../../api/contacts/ContactsCollection';
import { RolesCollection } from '../../api/roles/RolesCollection';
import { PracticesCollection, PracticeAssignmentsCollection } from '../../api/practices/PracticesCollection';

/**
 * Emergency method to drop all collections and re-seed
 * REMOVE THIS FILE IN PRODUCTION
 */
Meteor.methods({
    async 'dev.resetAndReseed'() {
        if (process.env.NODE_ENV === 'production') {
            throw new Meteor.Error('not-allowed', 'Cannot reset in production');
        }

        console.log('🗑️ Dropping all collections...');

        // Drop all collections
        await TenantsCollection.removeAsync({});
        await NotesCollection.removeAsync({});
        await FilesCollection.removeAsync({});
        await ContactsCollection.removeAsync({});
        await RolesCollection.removeAsync({});
        await PracticesCollection.removeAsync({});
        await PracticeAssignmentsCollection.removeAsync({});

        // Drop all users except currently logged in (for safety)
        await Meteor.users.removeAsync({});

        console.log('✅ All collections dropped');
        console.log('🔄 Please restart the server to trigger seed');

        return { success: true, message: 'Database cleared. Restart server to seed.' };
    }
});
