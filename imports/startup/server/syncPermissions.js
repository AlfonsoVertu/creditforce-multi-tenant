import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { DEFAULT_ROLE_PERMISSIONS } from '../../api/core/permissions/registry';

Meteor.startup(async () => {
    console.log('🔄 Syncing user permissions based on roles...');

    const users = await Meteor.users.find({}).fetchAsync();

    for (const user of users) {
        let role = user.profile?.role;

        // If role not in profile, try to infer from Roles package
        if (!role) {
            const roles = await Roles.getRolesForUserAsync(user._id);
            if (roles && roles.length > 0) {
                role = roles[0]; // Take first role
            }
        }

        if (role && DEFAULT_ROLE_PERMISSIONS[role]) {
            const permissions = DEFAULT_ROLE_PERMISSIONS[role];

            // Update user permissions
            await Meteor.users.updateAsync(user._id, {
                $set: { permissions: permissions }
            });
            console.log(`✅ Updated permissions for user ${user.emails?.[0]?.address} (Role: ${role})`);
        } else {
            console.warn(`⚠️ No default permissions found for user ${user.emails?.[0]?.address} with role ${role}`);
        }
    }

    console.log('✅ Permission sync complete.');
});
