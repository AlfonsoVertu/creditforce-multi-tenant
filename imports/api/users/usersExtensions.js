import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

/**
 * Estensione schema Meteor.users per campi custom
 * Compatible with Meteor 3.0
 */

const UserProfileSchema = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    tenantId: {
        type: String,
        optional: true,
        label: 'Default Tenant ID'
    },
    jobTitle: {
        type: String,
        optional: true,
        label: 'Titolo Professionale'
    },
    avatar: {
        type: String,
        optional: true,
        label: 'URL Avatar'
    },
    assignedTemplateId: {
        type: String,
        optional: true,
        label: 'ID Template Permessi Assegnato'
    }
});

const UserStatsSchema = new SimpleSchema({
    lastLogin: {
        type: Date,
        optional: true
    },
    totalSessions: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    pagesVisited: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    activeSeconds: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    toolsUsed: {
        type: Object,
        blackbox: true,
        optional: true,
        defaultValue: {}
    }
});

const UserSchema = new SimpleSchema({
    emails: {
        type: Array,
        optional: true
    },
    'emails.$': {
        type: Object
    },
    'emails.$.address': {
        type: String,
        regEx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    'emails.$.verified': {
        type: Boolean,
        defaultValue: false
    },
    createdAt: {
        type: Date,
        optional: true
    },
    profile: {
        type: UserProfileSchema,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    permissions: {
        type: Array,
        optional: true,
        label: 'Array of permission IDs'
    },
    'permissions.$': {
        type: String
    },
    stats: {
        type: UserStatsSchema,
        optional: true
    }
});

// Meteor.users.attachSchema(UserSchema); // Validazione commentata per compatibilità


if (Meteor.isServer) {
    // Deny client-side user modifications
    Meteor.users.deny({
        insert: () => true,
        update: () => true,
        remove: () => true
    });

    // Create indexes
    Meteor.startup(async () => {
        try {
            await Meteor.users.createIndexAsync({ 'profile.tenantId': 1 });
            await Meteor.users.createIndexAsync({ 'emails.address': 1 });
            await Meteor.users.createIndexAsync({ 'profile.assignedTemplateId': 1 });
            console.log('✓ Users indexes created');
        } catch (e) {
            console.error('Error creating users indexes:', e);
        }
    });
}
