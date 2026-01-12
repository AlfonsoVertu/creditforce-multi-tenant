import { Meteor } from 'meteor/meteor';
import { NotesCollection } from './NotesCollection';

Meteor.publish('notes.byTenant', async function () {
    if (!this.userId) return this.ready();

    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user || !user.profile?.tenantId) return this.ready();

    // Notes are personal in this system (per mock "Note Personali")
    // But scoped to Tenant datastore logic
    return NotesCollection.find({
        tenantId: user.profile.tenantId,
        authorId: this.userId
    });
});
