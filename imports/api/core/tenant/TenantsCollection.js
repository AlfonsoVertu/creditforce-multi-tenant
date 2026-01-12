import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
// import 'meteor/aldeed:collection2/static';

export const TenantsCollection = new Mongo.Collection('tenants');

// Schema rigoroso per la configurazione del tenant
const TenantSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Nome Organizzazione'
    },
    slug: {
        type: String,
        label: 'Slug URL',
        regEx: /^[a-z0-9-]+$/
    },
    plan: {
        type: String,
        allowedValues: ['basic', 'growth', 'enterprise'],
        defaultValue: 'basic',
        label: 'Piano Subscription'
    },
    settings: {
        type: Object,
        blackbox: true,
        optional: true,
        label: 'Configurazioni Custom'
    },
    limits: {
        type: Object,
        optional: true,
        label: 'Limiti Utilizzo'
    },
    'limits.maxProperties': {
        type: SimpleSchema.Integer,
        defaultValue: 100
    },
    'limits.maxUsers': {
        type: SimpleSchema.Integer,
        defaultValue: 5
    },
    license: {
        type: Object,
        optional: true,
        label: 'Informazioni Licenza'
    },
    'license.status': {
        type: String,
        allowedValues: ['active', 'suspended', 'trial', 'expired'],
        defaultValue: 'trial'
    },
    'license.validUntil': {
        type: Date,
        optional: true
    },
    'license.maxUsers': {
        type: SimpleSchema.Integer,
        defaultValue: 5
    },
    'license.storageLimit': {
        type: Number,
        defaultValue: 10, // GB
        label: 'Limite Storage (GB)'
    },
    'license.storageUsed': {
        type: Number,
        defaultValue: 0,
        label: 'Storage Utilizzato (GB)'
    },
    stats: {
        type: Object,
        optional: true,
        label: 'Statistiche Aggregate'
    },
    'stats.totalLogins': {
        type: SimpleSchema.Integer,
        defaultValue: 0
    },
    'stats.totalActiveSeconds': {
        type: Number,
        defaultValue: 0
    },
    'stats.topTools': {
        type: Array,
        defaultValue: []
    },
    'stats.topTools.$': {
        type: String
    },
    status: {
        type: String,
        allowedValues: ['active', 'suspended', 'archived'],
        defaultValue: 'active'
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
});

// TenantsCollection.attachSchema(TenantSchema);


// Deny all client-side operations (only server methods)
if (Meteor.isServer) {
    TenantsCollection.deny({
        insert: () => true,
        update: () => true,
        remove: () => true
    });

    // Crea indici per performance
    Meteor.startup(async () => {
        try {
            await TenantsCollection.createIndexAsync({ slug: 1 }, { unique: true });
            await TenantsCollection.createIndexAsync({ status: 1 });
            console.log('✓ Tenants indexes created');
        } catch (e) {
            console.error('Error creating tenants indexes:', e);
        }
    });
}
