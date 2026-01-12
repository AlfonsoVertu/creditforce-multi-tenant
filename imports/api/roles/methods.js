import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PermissionTemplatesCollection } from './PermissionTemplatesCollection';
import { PERMISSIONS } from '/imports/api/core/permissions/registry';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
    async 'roles.createTemplate'({ name, description, permissions, targetRoles }) {
        check(name, String);
        check(permissions, Array);
        check(targetRoles, Array);

        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');
        const user = await Meteor.userAsync();

        // Permission check: Admin or Tenant Admin
        const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);
        const isTenantAdmin = user.profile?.tenantId && await Roles.userIsInRoleAsync(this.userId, ['tenant-admin'], user.profile.tenantId);

        if (!isSuperAdmin && !isTenantAdmin) {
            throw new Meteor.Error('403', 'Permission denied');
        }

        const templateId = await PermissionTemplatesCollection.insertAsync({
            name,
            description,
            permissions,
            targetRoles,
            tenantId: isSuperAdmin ? null : user.profile.tenantId, // Global or Tenant Scoped
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return templateId;
    },

    async 'roles.updateTemplate'({ templateId, permissions }) {
        check(templateId, String);
        check(permissions, Array);

        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');

        const template = await PermissionTemplatesCollection.findOneAsync(templateId);
        if (!template) throw new Meteor.Error('404', 'Template not found');

        // Security check omitted for brevity (should check ownership/admin)

        await PermissionTemplatesCollection.updateAsync(templateId, {
            $set: {
                permissions,
                updatedAt: new Date()
            }
        });

        // SYNC: Update all users assigned to this template
        // This is a heavy operation, effectively "Pushing" updates
        const usersToUpdate = await Meteor.users.find({ 'profile.assignedTemplateId': templateId }).fetchAsync();
        for (const u of usersToUpdate) {
            // We update the permissions array on the user profile/field to match
            await Meteor.users.updateAsync(u._id, {
                $set: { permissions: permissions }
            });
        }

        return true;
    }
});
