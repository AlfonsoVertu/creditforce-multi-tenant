import { Meteor } from 'meteor/meteor';
import { FilesCollection } from './FilesCollection';
import { Roles } from 'meteor/alanning:roles';
import { DocumentPolicy } from '/imports/api/core/policy/DocumentPolicy';

Meteor.publish('files.byTenant', async function () {
    if (!this.userId) return this.ready();

    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user || !user.profile?.tenantId) return this.ready();

    const tenantId = user.profile.tenantId;

    // Use DocumentPolicy for visibility (supports G1-G7 matrix)
    const policyQuery = DocumentPolicy.getVisibleDocumentsQuery(user, tenantId);

    // Combine with Tenant Scope
    // Logic: Must be in Tenant AND allow by Policy
    return FilesCollection.find({
        tenantId,
        ...policyQuery
    });
});

// Publication for documents by practice ID with role-based filtering
Meteor.publish('files.byPractice', async function (practiceId) {
    if (!this.userId) return this.ready();
    if (!practiceId) return this.ready();

    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user) return this.ready();

    const tenantId = user.profile?.tenantId;

    // Use DocumentPolicy for visibility (supports G1-G7 matrix)
    const policyQuery = DocumentPolicy.getVisibleDocumentsQuery(user, tenantId);

    // Filter by practice AND policy
    return FilesCollection.find({
        practiceId,
        ...policyQuery
    });
});
