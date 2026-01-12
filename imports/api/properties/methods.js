import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PropertiesCollection } from './PropertiesCollection';
import { validateTenantContext } from '../core/server/context';
import { AuditLogsCollection } from '../audit/AuditLogsCollection';
import { TenantsCollection } from '../core/tenant/TenantsCollection';
import { PERMISSIONS_REGISTRY } from '../core/permissions/registry';

/**
 * Helper to check usage limits before creating properties
 */
const checkPropertyLimit = async (tenantId) => {
    const tenant = await TenantsCollection.findOneAsync(tenantId);
    if (!tenant) throw new Meteor.Error('tenant-not-found', 'Tenant non trovato');

    const currentCount = await PropertiesCollection.find({ tenantId }).countAsync();

    // Define limits per plan
    const limits = {
        basic: 50,
        growth: 200,
        enterprise: 1000
    };

    const maxProperties = limits[tenant.plan] || 50;

    if (currentCount >= maxProperties) {
        throw new Meteor.Error(
            'limit-exceeded',
            `Limite proprietà raggiunto (${maxProperties} per piano ${tenant.plan}). Effettua l'upgrade.`
        );
    }

    return true;
};

/**
 * Helper for audit logging
 */
const auditLog = async (userId, action, details, tenantId) => {
    await AuditLogsCollection.insertAsync({
        tenantId,
        userId,
        action,
        details,
        ipAddress: null, // Could be extracted from this.connection in method context
        createdAt: new Date()
    });
};

Meteor.methods({
    /**
     * Crea una nuova proprietà immobiliare
     */
    async 'properties.create'(propertyData) {
        check(propertyData, Object);

        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized', 'Login richiesto');

        // Validate tenant context
        const context = await validateTenantContext(userId, propertyData.tenantId);

        // Check permission
        const user = await Meteor.users.findOneAsync(userId);
        if (!user.permissions.includes(PERMISSIONS_REGISTRY.TOOL_PROPERTY_CREATE.id)) {
            throw new Meteor.Error('permission-denied', 'Permesso CREATE mancante');
        }

        // Check usage limits
        await checkPropertyLimit(context.tenantId);

        // Create property
        const propertyId = await PropertiesCollection.insertAsync({
            ...propertyData,
            tenantId: context.tenantId,
            agentId: userId, // Assigner current user as agent
            status: 'bozza',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Audit log
        await auditLog(userId, 'PROPERTY_CREATE', { propertyId, title: propertyData.title }, context.tenantId);

        // Update tenant stats (denormalization for performance)
        await TenantsCollection.updateAsync(context.tenantId, {
            $inc: { 'stats.propertiesCount': 1 }
        });

        return propertyId;
    },

    /**
     * Aggiorna una proprietà esistente
     */
    async 'properties.update'(propertyId, updates) {
        check(propertyId, String);
        check(updates, Object);

        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized', 'Login richiesto');

        // Get property
        const property = await PropertiesCollection.findOneAsync(propertyId);
        if (!property) throw new Meteor.Error('not-found', 'Proprietà non trovata');

        // Validate tenant context
        await validateTenantContext(userId, property.tenantId);

        // Check permission
        const user = await Meteor.users.findOneAsync(userId);
        if (!user.permissions.includes(PERMISSIONS_REGISTRY.TOOL_PROPERTY_EDIT.id)) {
            throw new Meteor.Error('permission-denied', 'Permesso EDIT mancante');
        }

        // Update
        await PropertiesCollection.updateAsync(propertyId, {
            $set: {
                ...updates,
                updatedAt: new Date()
            }
        });

        // Audit log
        await auditLog(userId, 'PROPERTY_UPDATE', { propertyId, updates }, property.tenantId);

        return propertyId;
    },

    /**
     * Pubblica una proprietà (cambia status a 'pubblicato')
     */
    async 'properties.publish'(propertyId) {
        check(propertyId, String);

        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized', 'Login richiesto');

        const property = await PropertiesCollection.findOneAsync(propertyId);
        if (!property) throw new Meteor.Error('not-found', 'Proprietà non trovata');

        await validateTenantContext(userId, property.tenantId);

        const user = await Meteor.users.findOneAsync(userId);
        if (!user.permissions.includes(PERMISSIONS_REGISTRY.TOOL_PROPERTY_PUBLISH.id)) {
            throw new Meteor.Error('permission-denied', 'Permesso PUBLISH mancante');
        }

        await PropertiesCollection.updateAsync(propertyId, {
            $set: {
                status: 'pubblicato',
                publishedAt: new Date(),
                updatedAt: new Date()
            }
        });

        await auditLog(userId, 'PROPERTY_PUBLISH', { propertyId }, property.tenantId);

        return true;
    },

    /**
     * Elimina una proprietà
     */
    async 'properties.delete'(propertyId) {
        check(propertyId, String);

        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized', 'Login richiesto');

        const property = await PropertiesCollection.findOneAsync(propertyId);
        if (!property) throw new Meteor.Error('not-found', 'Proprietà non trovata');

        await validateTenantContext(userId, property.tenantId);

        const user = await Meteor.users.findOneAsync(userId);
        if (!user.permissions.includes(PERMISSIONS_REGISTRY.TOOL_PROPERTY_DELETE.id)) {
            throw new Meteor.Error('permission-denied', 'Permesso DELETE mancante');
        }

        await PropertiesCollection.removeAsync(propertyId);

        // Update tenant stats
        await TenantsCollection.updateAsync(property.tenantId, {
            $inc: { 'stats.propertiesCount': -1 }
        });

        await auditLog(userId, 'PROPERTY_DELETE', { propertyId, title: property.title }, property.tenantId);

        return true;
    }
});
