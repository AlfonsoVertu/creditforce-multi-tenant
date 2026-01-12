import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('users.all', async function () {
    if (!this.userId) return this.ready();

    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user) return this.ready();

    const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);

    if (isSuperAdmin) {
        // Super Admin vede tutti
        return Meteor.users.find({}, {
            fields: {
                emails: 1,
                profile: 1,
                permissions: 1,
                stats: 1,
                createdAt: 1,
                roles: 1
            }
        });
    }

    // Tenant Admin vede solo utenti del proprio tenant
    if (user.profile?.tenantId) {
        return Meteor.users.find(
            { 'profile.tenantId': user.profile.tenantId },
            {
                fields: {
                    emails: 1,
                    profile: 1,
                    permissions: 1,
                    stats: 1,
                    createdAt: 1,
                    roles: 1
                }
            }
        );
    }

    return this.ready();
});

Meteor.publish('users.current', function () {
    if (!this.userId) return this.ready();
    return Meteor.users.find(this.userId, {
        fields: {
            emails: 1,
            profile: 1,
            permissions: 1,
            stats: 1,
            createdAt: 1,
            roles: 1
        }
    });
});
