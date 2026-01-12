import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { FilesCollection } from './FilesCollection';
import { PERMISSIONS } from '/imports/api/core/permissions/registry';

import { DOCUMENT_TYPES } from './constants';

Meteor.methods({
    async 'files.create'({ name, size, type, docTypeId, uploaderTemplateId }) {
        check(name, String);
        check(size, String);
        if (docTypeId) check(docTypeId, String);

        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');
        const user = await Meteor.userAsync();

        // Resolve Metadata
        let group = 'g7_internal'; // Default fallback
        let sensitivity = 'l2_medium';
        let docTypeLabel = 'File Generico';

        if (docTypeId && DOCUMENT_TYPES[docTypeId]) {
            const config = DOCUMENT_TYPES[docTypeId];
            group = config.group;
            sensitivity = config.sensitivity;
            docTypeLabel = config.label;
        } else if (docTypeId) {
            // Provided but not found in constants (maybe dynamic?)
            // Keep default
        }

        const fileId = await FilesCollection.insertAsync({
            name,
            size,
            type,
            docTypeId, // persistence
            group,
            sensitivity,
            uploaderId: this.userId,
            uploaderName: user.profile?.name || user.emails[0].address,
            uploaderTemplateId: uploaderTemplateId || user.profile?.assignedTemplateId,
            tenantId: user.profile?.tenantId,
            createdAt: new Date()
        });

        return fileId;
    },

    async 'files.delete'({ fileId }) {
        check(fileId, String);
        if (!this.userId) throw new Meteor.Error('401', 'Unauthorized');
        const user = await Meteor.userAsync();

        const file = await FilesCollection.findOneAsync(fileId);
        if (!file) throw new Meteor.Error('404', 'File not found');

        // Permission: Can delete own OR if Tenant Admin
        const isOwner = file.uploaderId === this.userId;
        const isTenantAdmin = user.profile?.role === 'tenant-admin' && file.tenantId === user.profile.tenantId;

        if (!isOwner && !isTenantAdmin) {
            throw new Meteor.Error('403', 'Permission denied');
        }

        await FilesCollection.removeAsync(fileId);
        return true;
    }
});
