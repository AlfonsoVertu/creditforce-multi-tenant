import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { createAuditLog } from '../audit/AuditLogsCollection';
import { PERMISSIONS_REGISTRY } from '../core/permissions/registry';

Meteor.methods({
    async 'users.invite'({ email, role, tenantId, jobTitle }) {
        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized');

        // Verify permission
        const user = await Meteor.userAsync();
        if (!user.permissions.includes(PERMISSIONS_REGISTRY.TOOL_USER_INVITE.id)) {
            throw new Meteor.Error('permission-denied');
        }

        // Security: Ensure Tenant Admin can only invite to their own tenant
        const isSuperAdmin = await Roles.userIsInRoleAsync(userId, ['admin'], Roles.GLOBAL_GROUP);
        if (!isSuperAdmin && user.profile?.tenantId !== tenantId) {
            throw new Meteor.Error('403', 'Cannot invite to another tenant');
        }

        // Check if user exists
        let targetUser = await Accounts.findUserByEmailAsync(email);
        let targetUserId;
        let isNew = false;

        if (!targetUser) {
            // Create new user
            targetUserId = await Accounts.createUserAsync({
                email,
                profile: {
                    name: email.split('@')[0],
                    tenantId,
                    jobTitle,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                },
                permissions: [],
                stats: {
                    lastLogin: new Date(),
                    totalSessions: 0,
                    pagesVisited: 0,
                    activeSeconds: 0,
                    toolsUsed: {}
                }
            });
            await Accounts.sendEnrollmentEmailAsync(targetUserId);
            isNew = true;
        } else {
            targetUserId = targetUser._id;
        }

        // Assign role
        await Roles.addUsersToRolesAsync(targetUserId, [role, 'member'], tenantId);

        // Log action
        await createAuditLog({
            userId,
            action: 'USER_INVITE',
            details: { email, role, isNew },
            tenantId,
            ipAddress: this.connection?.clientAddress
        });

        return targetUserId;
    },

    async 'users.updatePermissions'({ targetUserId, permissions, templateId }) {
        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized');

        const user = await Meteor.userAsync();
        if (!user.permissions.includes(PERMISSIONS_REGISTRY.TOOL_USER_UPDATE_ROLE.id)) {
            throw new Meteor.Error('permission-denied');
        }

        const targetUser = await Meteor.users.findOneAsync(targetUserId);
        if (!targetUser) throw new Meteor.Error('404', 'User not found');

        // Security: Tenant Isolation
        const isSuperAdmin = await Roles.userIsInRoleAsync(userId, ['admin'], Roles.GLOBAL_GROUP);
        if (!isSuperAdmin && targetUser.profile?.tenantId !== user.profile?.tenantId) {
            throw new Meteor.Error('403', 'Access denied to this user');
        }

        await Meteor.users.updateAsync(targetUserId, {
            $set: {
                permissions,
                'profile.assignedTemplateId': templateId
            }
        });

        await createAuditLog({
            userId,
            action: 'USER_PERMISSIONS_UPDATE',
            details: { targetUserId, templateId },
            tenantId: user.profile?.tenantId
        });

        return true;
    },

    async 'users.delete'({ targetUserId }) {
        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized');

        const user = await Meteor.userAsync();
        if (!user.permissions.includes(PERMISSIONS_REGISTRY.TOOL_USER_DISABLE.id)) {
            throw new Meteor.Error('permission-denied');
        }

        const targetUser = await Meteor.users.findOneAsync(targetUserId);
        if (!targetUser) throw new Meteor.Error('404', 'User not found');

        // Security: Tenant Isolation
        const isSuperAdmin = await Roles.userIsInRoleAsync(userId, ['admin'], Roles.GLOBAL_GROUP);
        if (!isSuperAdmin && targetUser.profile?.tenantId !== user.profile?.tenantId) {
            throw new Meteor.Error('403', 'Access denied to this user');
        }

        await Meteor.users.removeAsync(targetUserId);

        await createAuditLog({
            userId,
            action: 'USER_DELETE',
            details: { targetUserId },
            tenantId: user.profile?.tenantId
        });

        return true;
    },



    async 'users.trackAction'({ actionType, detail }) {
        const userId = this.userId;
        if (!userId) return;

        if (actionType === 'login') {
            await Meteor.users.updateAsync(userId, {
                $set: { 'stats.lastLogin': new Date() },
                $inc: { 'stats.totalSessions': 1 }
            });
        } else if (actionType === 'page_view') {
            await Meteor.users.updateAsync(userId, {
                $inc: { 'stats.pagesVisited': 1 }
            });
        } else if (actionType === 'tool_use' && detail) {
            await Meteor.users.updateAsync(userId, {
                $inc: { [`stats.toolsUsed.${detail}`]: 1 }
            });
        } else if (actionType === 'heartbeat') {
            // Increment active time by 30 seconds for each heartbeat
            await Meteor.users.updateAsync(userId, {
                $inc: { 'stats.activeSeconds': 30 }
            });
        }

        return true;
    },

    async 'users.switchTenant'({ tenantId }) {
        const userId = this.userId;
        if (!userId) throw new Meteor.Error('not-authorized');

        // Verify user has access to this tenant
        // Super Admin has access to ALL contexts
        const isSuperAdmin = await Roles.userIsInRoleAsync(userId, ['admin'], Roles.GLOBAL_GROUP);

        let hasAccess = isSuperAdmin;
        if (!hasAccess) {
            hasAccess = await Roles.userIsInRoleAsync(userId, ['admin', 'tenant-admin', 'agent', 'member'], tenantId);
        }

        if (!hasAccess) {
            throw new Meteor.Error('403', 'Accesso negato al contesto richiesto.');
        }

        // Update profile
        await Meteor.users.updateAsync(userId, {
            $set: { 'profile.tenantId': tenantId }
        });

        return true;
    }
});
