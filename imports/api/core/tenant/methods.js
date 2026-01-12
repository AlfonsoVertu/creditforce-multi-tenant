import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { TenantsCollection } from './TenantsCollection';

Meteor.methods({
    /**
     * Update tenant license - SUPERADMIN ONLY
     * @param {Object} params - { tenantId, status, validUntil, maxUsers }
     */
    async 'license.update'({ tenantId, status, validUntil, maxUsers }) {
        // Check if user is superadmin
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in');
        }

        const isAdmin = await Roles.userIsInRoleAsync(this.userId, 'admin');
        if (!isAdmin) {
            throw new Meteor.Error('not-authorized', 'Only super admin can update licenses');
        }

        check(tenantId, String);
        check(status, Match.Maybe(String));
        check(validUntil, Match.Maybe(Date));
        check(maxUsers, Match.Maybe(Number));

        const updateFields = {};

        if (status) {
            if (!['active', 'suspended', 'trial', 'expired'].includes(status)) {
                throw new Meteor.Error('invalid-status', 'Invalid license status');
            }
            updateFields['license.status'] = status;
        }

        if (validUntil) {
            updateFields['license.validUntil'] = validUntil;
        }

        if (maxUsers !== undefined && maxUsers !== null) {
            updateFields['license.maxUsers'] = maxUsers;
        }

        if (Object.keys(updateFields).length === 0) {
            throw new Meteor.Error('no-updates', 'No fields to update');
        }

        const result = await TenantsCollection.updateAsync(
            { _id: tenantId },
            { $set: updateFields }
        );

        console.log(`[License] Updated tenant ${tenantId}:`, updateFields);

        return { success: true, modified: result };
    }
});
