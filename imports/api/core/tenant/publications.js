import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { TenantsCollection } from './TenantsCollection';
import { RolesCollection } from '../../roles/RolesCollection';

Meteor.publish('tenants.all', async function () {
    if (!this.userId) return this.ready();

    const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);

    if (isSuperAdmin) {
        // Super Admin sees all tenants
        return [
            TenantsCollection.find({}),
            RolesCollection.find({})
        ];
    }

    // Tenant users see only their own tenant
    const user = await Meteor.users.findOneAsync(this.userId);
    if (user?.profile?.tenantId) {
        return [
            TenantsCollection.find({ _id: user.profile.tenantId }),
            RolesCollection.find({})
        ];
    }

    return this.ready();
});

Meteor.publish('roles.templates', function () {
    if (!this.userId) return this.ready();
    return RolesCollection.find({});
});

Meteor.publish('tenants.myContexts', async function () {
    if (!this.userId) return this.ready();

    // 1. Get all scopes (tenantIds) where the user has any role
    const assignments = await Meteor.roleAssignment.find({ 'user._id': this.userId }).fetchAsync();
    const myTenantIds = [...new Set(assignments.map(a => a.scope).filter(scope => scope))]; // Filter out null (GLOBAL)

    // 2. Return those tenants
    return TenantsCollection.find({ _id: { $in: myTenantIds } });
});
