import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PracticesCollection, PracticeAssignmentsCollection } from './PracticesCollection';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
    /**
     * Creates a new Practice (Fascicolo)
     * Security: Admin, Servicer, or Mandante (for self)
     */
    async 'practices.create'({ code, debtorName, creditorOrgId }) {
        check(code, String);
        check(debtorName, String);
        check(creditorOrgId, String); // Mandatory: Who owns this debt?

        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');
        const user = await Meteor.userAsync();

        // 1. Permission Check
        const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);
        // Is user part of the Creditor Org?
        const isMandanteOwner = user.profile.tenantId === creditorOrgId;
        // Is user a Servicer? (Needs specific permission to create on behalf of others)
        const isServicer = user.profile.role === 'tenant-admin' || user.profile.role === 'servicer';

        if (!isSuperAdmin && !isMandanteOwner && !isServicer) {
            throw new Meteor.Error('403', 'Permission denied');
        }

        // 2. Create
        const practiceId = await PracticesCollection.insertAsync({
            code,
            debtorName,
            creditorOrgId, // The "Mandante"
            servicerOrgId: isServicer ? user.profile.tenantId : null, // If Servicer created it, claim it
            status: 'NEW',
            createdAt: new Date(),
            createdBy: this.userId
        });

        return practiceId;
    },

    /**
     * Assigns a User to a Practice (Rule 2.3)
     * Security: Servicer or Admin
     */
    async 'practices.assign'({ practiceId, targetUserId, scope, roleOverride }) {
        check(practiceId, String);
        check(targetUserId, String);
        check(scope, String); // FULL, READONLY, LIMITED

        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');

        // 1. Verify Access to Manage
        const practice = await PracticesCollection.findOneAsync(practiceId);
        if (!practice) throw new Meteor.Error('404', 'Practice not found');

        const user = await Meteor.userAsync();
        const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);
        // Only Servicer (Servicer Org) or Admin can assign agents
        // What about Mandante? Usually Mandante doesn't manage Servicer's agents.
        const isPracticeServicer = practice.servicerOrgId === user.profile.tenantId;

        if (!isSuperAdmin && !isPracticeServicer) {
            throw new Meteor.Error('403', 'Only the Service Manager can assign agents');
        }

        // 2. Perform Assignment
        // Upsert to avoid duplicates
        await PracticeAssignmentsCollection.updateAsync(
            { practiceId, userId: targetUserId },
            {
                $set: {
                    scope,
                    roleOverride,
                    assignedAt: new Date(),
                    assignedBy: this.userId
                }
            },
            { upsert: true }
        );

        // 3. Notification (Stub - Rule 4.1)
        // createNotification('PRACTICE_ASSIGNED', targetUserId, { practiceId });

        return true;
    },

    /**
     * Helper to get my assignments (for UI)
     */
    async 'practices.getMyAssignments'() {
        if (!this.userId) return [];
        return PracticeAssignmentsCollection.find({ userId: this.userId }).fetchAsync();
    }
});
