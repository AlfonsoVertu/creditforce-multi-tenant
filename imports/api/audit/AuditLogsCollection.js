import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

export const AuditLogsCollection = new Mongo.Collection('audit_logs');

// Schema Audit Log (Immutabile - Append Only)
const AuditLogSchema = new SimpleSchema({
    tenantId: {
        type: String,
        optional: true,
        label: 'ID Tenant (null per azioni globali)'
    },
    userId: {
        type: String,
        label: 'ID Utente che ha eseguito l\'azione'
    },
    action: {
        type: String,
        label: 'Tipo di azione (es. PROPERTY_CREATE, USER_INVITE)'
    },
    details: {
        type: Object,
        blackbox: true,
        optional: true,
        label: 'Dettagli aggiuntivi (snapshot before/after)'
    },
    ipAddress: {
        type: String,
        optional: true,
        label: 'IP Address del client'
    },
    userAgent: {
        type: String,
        optional: true,
        label: 'User Agent del browser'
    },
    impersonatorId: {
        type: String,
        optional: true,
        label: 'ID dell\'utente che sta impersonando (se applicabile)'
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            this.unset(); // Non permettere update di createdAt
        }
    }
});

// AuditLogsCollection.attachSchema( // Validazione commentataAuditLogSchema);

// DENY ALL CLIENT OPERATIONS - Audit logs are APPEND-ONLY from server
if (Meteor.isClient) {
    AuditLogsCollection.deny({
        insert: () => true,
        update: () => true,
        remove: () => true
    });
}

if (Meteor.isServer) {
    // Also deny updates/removes on server (only allow inserts)
    AuditLogsCollection.deny({
        update: () => true,
        remove: () => true
    });

    // Indici per query performanti
    Meteor.startup(async () => {
        try {
            await AuditLogsCollection.createIndexAsync({
                tenantId: 1,
                createdAt: -1
            });
            await AuditLogsCollection.createIndexAsync({
                userId: 1,
                action: 1
            });
            await AuditLogsCollection.createIndexAsync({
                createdAt: -1
            });
            console.log('✓ AuditLogs indexes created');
        } catch (e) {
            console.error('Error creating audit logs indexes:', e);
        }
    });
}

/**
 * Helper function per creare audit log entry
 * @param {string} userId 
 * @param {string} action 
 * @param {object} details 
 * @param {string} tenantId 
 * @param {string} ipAddress 
 * @param {string} impersonatorId 
 * @returns {Promise<string>}
 */
export const createAuditLog = async ({
    userId,
    action,
    details = {},
    tenantId = null,
    ipAddress = null,
    userAgent = null,
    impersonatorId = null
}) => {
    return await AuditLogsCollection.insertAsync({
        userId,
        action,
        details,
        tenantId,
        ipAddress,
        userAgent,
        impersonatorId,
        createdAt: new Date()
    });
};
