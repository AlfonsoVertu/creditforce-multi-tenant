import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from './ContactsCollection';

Meteor.publish('contacts.byTenant', async function () {
    if (!this.userId) return this.ready();

    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user || !user.profile?.tenantId) return this.ready();

    return ContactsCollection.find({
        tenantId: user.profile.tenantId
    });
});
