import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ContactsCollection } from './ContactsCollection';
import { PERMISSIONS } from '/imports/api/core/permissions/registry';

Meteor.methods({
    async 'contacts.create'({ name, email, phone, type }) {
        check(name, String);
        check(email, String);

        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');
        const user = await Meteor.userAsync();

        await ContactsCollection.insertAsync({
            name,
            email,
            phone,
            type, // buyer, seller, etc.
            tenantId: user.profile?.tenantId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return true;
    }
});
