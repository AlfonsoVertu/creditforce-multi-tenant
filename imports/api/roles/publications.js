import { Meteor } from 'meteor/meteor';
import { PermissionTemplatesCollection } from './PermissionTemplatesCollection';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('roles.templates', async function () {
    if (!this.userId) return this.ready();

    const user = await Meteor.users.findOneAsync(this.userId);

    // 1. Super Admin sees ALL
    const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);
    if (isSuperAdmin) {
        return PermissionTemplatesCollection.find({});
    }

    // 2. Others see Global Templates OR Tenant Templates
    const tenantId = user.profile?.tenantId;
    return PermissionTemplatesCollection.find({
        $or: [
            { tenantId: null }, // Global
            { tenantId: tenantId } // Own Tenant
        ]
    });
});
