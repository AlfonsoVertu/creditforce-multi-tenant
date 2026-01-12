import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

// This collection stores DYNAMIC environment configuration
// It does not overwrite process.env but provides a config layer
export const SystemSettingsCollection = new Mongo.Collection('system_settings');

const SettingSchema = new SimpleSchema({
    key: { type: String },
    value: { type: String },
    description: { type: String, optional: true },
    isSecret: { type: Boolean, defaultValue: false }, // If true, value is hidden in client
    updatedAt: { type: Date }
});

// SystemSettingsCollection.attachSchema(SettingSchema);

if (Meteor.isServer) {
    Meteor.publish('system.settings', async function () {
        if (!this.userId) return this.ready();
        const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);
        if (!isSuperAdmin) return this.ready();

        return SystemSettingsCollection.find({}, {
            // If we had secret handling we'd filter fields here
        });
    });

    // Public settings publication (accessible by everyone, even logged out)
    Meteor.publish('system.settings.public', function () {
        return SystemSettingsCollection.find({
            key: { $in: ['PROJECT_NAME'] },
            isSecret: false
        });
    });

    Meteor.methods({
        async 'settings.update'({ id, key, value }) {
            const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);
            if (!isSuperAdmin) throw new Meteor.Error('403', 'Forbidden');

            // If ID is provided, update, else insert (upsert logic handled by client call usually, but let's be explicit)
            if (id) {
                await SystemSettingsCollection.updateAsync(id, {
                    $set: { key, value, updatedAt: new Date() }
                });
            } else {
                // Check if key exists
                const exists = await SystemSettingsCollection.findOneAsync({ key });
                if (exists) throw new Meteor.Error('conflict', 'Key already exists');

                await SystemSettingsCollection.insertAsync({
                    key, value, updatedAt: new Date()
                });
            }
        },

        async 'settings.delete'({ id }) {
            const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);
            if (!isSuperAdmin) throw new Meteor.Error('403', 'Forbidden');
            await SystemSettingsCollection.removeAsync(id);
        }
    });

    // Seed initial settings if empty
    Meteor.startup(async () => {
        try {
            await SystemSettingsCollection.createIndexAsync({ key: 1 }, { unique: true });
        } catch (e) {
            console.error('Error creating settings index:', e);
        }

        if (await SystemSettingsCollection.find().countAsync() === 0) {
            await SystemSettingsCollection.insertAsync({ key: 'ROOT_URL', value: 'https://app.estatenexus.io', updatedAt: new Date() });
            await SystemSettingsCollection.insertAsync({ key: 'MAIL_URL', value: 'smtp://...', updatedAt: new Date() });
        }

        // Sync PROJECT_NAME from env
        const projectName = process.env.PROJECT_NAME || 'CreditForce';
        const existingProjectName = await SystemSettingsCollection.findOneAsync({ key: 'PROJECT_NAME' });

        if (existingProjectName) {
            if (existingProjectName.value !== projectName) {
                await SystemSettingsCollection.updateAsync(existingProjectName._id, { $set: { value: projectName, updatedAt: new Date() } });
                console.log(`[Config] Updated PROJECT_NAME to "${projectName}" from env`);
            }
        } else {
            await SystemSettingsCollection.insertAsync({ key: 'PROJECT_NAME', value: projectName, isSecret: false, updatedAt: new Date() });
            console.log(`[Config] Initialized PROJECT_NAME to "${projectName}"`);
        }
    });
}
