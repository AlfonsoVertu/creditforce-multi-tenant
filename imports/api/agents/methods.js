import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { DEFAULT_AGENTS, generateAgentEmail } from './constants';

/**
 * Creates default agents for a tenant
 * Called when a new tenant is created
 * 
 * @param {string} tenantId - The tenant ID
 * @param {string} tenantSlug - The tenant slug (used for email generation)
 * @param {string[]} tenantAdminPermissions - Permissions of the tenant admin (ceiling)
 * @returns {Promise<string[]>} Array of created user IDs
 */
export const createDefaultAgents = async (tenantId, tenantSlug, tenantAdminPermissions = []) => {
    const createdUserIds = [];

    for (const agentDef of DEFAULT_AGENTS) {
        const email = generateAgentEmail(tenantSlug, agentDef.emailSuffix);

        // Check if user already exists (compatible method)
        const existingUser = await Meteor.users.findOneAsync({ 'emails.address': email });
        if (existingUser) {
            console.log(`  ⚠ Agent ${agentDef.name} already exists: ${email}`);
            createdUserIds.push(existingUser._id);
            continue;
        }

        // Apply permission ceiling: agent can only have permissions that tenant admin has
        const effectivePermissions = agentDef.defaultPermissions.filter(
            perm => tenantAdminPermissions.includes(perm)
        );

        try {
            // Create user account
            const userId = await Accounts.createUserAsync({
                email,
                password: 'password123', // Default password, should be changed
                profile: {
                    name: agentDef.name,
                    role: 'agent',
                    tenantId,
                    jobTitle: agentDef.jobTitle,
                    agentRole: agentDef.role, // Functional role for DocumentPolicy
                    isDefaultAgent: true, // Flag to identify auto-created agents
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                }
            });

            // Set permissions
            await Meteor.users.updateAsync(userId, {
                $set: {
                    permissions: effectivePermissions,
                    agentConfig: {
                        documentGroups: agentDef.documentGroups,
                        sensitivityMax: agentDef.sensitivityMax,
                        actions: agentDef.actions
                    },
                    stats: {
                        lastLogin: null,
                        totalSessions: 0,
                        activeSeconds: 0
                    }
                }
            });

            // Assign role in tenant scope
            await Roles.addUsersToRolesAsync(userId, ['agent', 'member'], tenantId);

            createdUserIds.push(userId);
            console.log(`  ✓ Created default agent: ${agentDef.name} (${email})`);

        } catch (error) {
            console.error(`  ✗ Failed to create agent ${agentDef.name}:`, error.message);
        }
    }

    return createdUserIds;
};

/**
 * Updates an agent's permissions, respecting the tenant admin ceiling
 * 
 * @param {string} agentUserId - The agent user ID
 * @param {string[]} newPermissions - Requested permissions
 * @param {string} tenantAdminId - The tenant admin user ID
 * @returns {Promise<{success: boolean, appliedPermissions?: string[], error?: string}>}
 */
export const updateAgentPermissions = async (agentUserId, newPermissions, tenantAdminId) => {
    // Get tenant admin's permissions (the ceiling)
    const tenantAdmin = await Meteor.users.findOneAsync(tenantAdminId);
    if (!tenantAdmin) {
        return { success: false, error: 'Tenant admin not found' };
    }

    const tenantAdminPerms = tenantAdmin.permissions || [];

    // Filter: agent can only have permissions the tenant admin has
    const allowedPermissions = newPermissions.filter(perm => tenantAdminPerms.includes(perm));

    // Update agent
    await Meteor.users.updateAsync(agentUserId, {
        $set: { permissions: allowedPermissions }
    });

    return {
        success: true,
        appliedPermissions: allowedPermissions,
        requestedButDenied: newPermissions.filter(p => !allowedPermissions.includes(p))
    };
};
