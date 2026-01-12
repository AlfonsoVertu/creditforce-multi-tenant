import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PropertiesCollection } from './PropertiesCollection';
import { validateTenantContext } from '../core/server/context';
import { Roles } from 'meteor/alanning:roles';

/**
 * Publication: Lista proprietà del tenant corrente
 * Filtrata automaticamente per tenantId
 */
Meteor.publish('properties.byTenant', async function (tenantId) {
    check(tenantId, String);

    if (!this.userId) {
        return this.ready();
    }

    try {
        // Validate context
        await validateTenantContext(this.userId, tenantId);

        // Return properties for this tenant
        return PropertiesCollection.find({ tenantId });
    } catch (e) {
        console.error('Error in properties.byTenant publication:', e);
        return this.ready();
    }
});

/**
 * Publication: Proprietà specifiche di un agente
 * Utile per gli agenti che vogliono vedere solo le loro
 */
Meteor.publish('properties.byAgent', async function (agentId) {
    check(agentId, String);

    if (!this.userId) {
        return this.ready();
    }

    try {
        const user = await Meteor.users.findOneAsync(this.userId);
        if (!user) return this.ready();

        // Gli agenti possono vedere solo le proprie, admin/tenant-admin vedono tutte quelle richieste
        const canViewAll = await Roles.userIsInRoleAsync(
            this.userId,
            ['admin', 'tenant-admin'],
            user.profile?.tenantId || Roles.GLOBAL_GROUP
        );

        if (!canViewAll && this.userId !== agentId) {
            return this.ready();
        }

        const property = await PropertiesCollection.findOne({ agentId });
        if (!property) return this.ready();

        // Validate tenant context
        await validateTenantContext(this.userId, property.tenantId);

        return PropertiesCollection.find({ agentId });
    } catch (e) {
        console.error('Error in properties.byAgent publication:', e);
        return this.ready();
    }
});

/**
 * Publication: Singola proprietà per dettaglio
 */
Meteor.publish('properties.single', async function (propertyId) {
    check(propertyId, String);

    if (!this.userId) {
        return this.ready();
    }

    try {
        const property = await PropertiesCollection.findOneAsync(propertyId);
        if (!property) return this.ready();

        // Validate tenant context
        await validateTenantContext(this.userId, property.tenantId);

        return PropertiesCollection.find({ _id: propertyId });
    } catch (e) {
        console.error('Error in properties.single publication:', e);
        return this.ready();
    }
});
