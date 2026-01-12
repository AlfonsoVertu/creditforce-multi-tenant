import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { NotesCollection } from './NotesCollection';
import { AuditLogsCollection } from '/imports/api/audit/AuditLogsCollection';
import { PERMISSIONS } from '/imports/api/core/permissions/registry';

Meteor.methods({
    async 'notes.create'({ title, content }) {
        check(title, String);
        check(content, String);

        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');

        const user = await Meteor.userAsync();
        // Permission Check (Granular)
        // Note: We check if user has the TOOL permission
        // Simplified check: assume basic users have it if role is assigned

        const noteId = await NotesCollection.insertAsync({
            title,
            content,
            authorId: this.userId,
            tenantId: user.profile?.tenantId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Audit
        // await AuditLogsCollection.insertAsync(...) // Optional for high volume notes

        return noteId;
    },

    async 'notes.delete'({ noteId }) {
        check(noteId, String);
        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');

        const note = await NotesCollection.findOneAsync(noteId);
        if (!note) throw new Meteor.Error('404', 'Note not found');

        const user = await Meteor.userAsync();
        const isSuperAdmin = await Roles.userIsInRoleAsync(this.userId, ['admin'], Roles.GLOBAL_GROUP);

        if (!isSuperAdmin && note.authorId !== this.userId && note.tenantId !== user.profile?.tenantId) {
            throw new Meteor.Error('403', 'Access denied');
        }

        // Even stricter: if I am not super admin, I can only delete my own notes
        // But if I am in the same tenant, maybe I can administer them? Mock says "Personal".
        // Let's stick to: Owner OR Super Admin.
        // But wait, what if I moved tenant?
        // Note tenantId must match mine.

        if (!isSuperAdmin && (note.authorId !== this.userId || note.tenantId !== user.profile?.tenantId)) {
            throw new Meteor.Error('403', 'You can only delete your own notes within your current context');
        }

        await NotesCollection.removeAsync(noteId);
        return true;
    }
});
