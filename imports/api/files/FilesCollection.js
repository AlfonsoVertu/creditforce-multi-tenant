import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

export const FilesCollection = new Mongo.Collection('files');

const FileSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Nome File'
    },
    size: {
        type: String,
        label: 'Dimensione (es. 2.5 MB)'
    },
    type: {
        type: String,
        label: 'Tipo File (PDF, JPG, etc.)'
    },
    uploaderId: {
        type: String,
        label: 'ID Utente caricatore'
    },
    uploaderName: {
        type: String,
        label: 'Nome Utente caricatore'
    },
    uploaderTemplateId: {
        type: String,
        optional: true,
        label: 'Template ID del caricatore (per visibility rules)'
    },
    tenantId: {
        type: String,
        label: 'ID Tenant'
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
        }
    }
});

// FilesCollection.attachSchema( // Validazione commentataFileSchema);

if (Meteor.isServer) {
    FilesCollection.deny({
        insert: () => true,
        update: () => true,
        remove: () => true
    });

    Meteor.startup(async () => {
        try {
            await FilesCollection.createIndexAsync({
                tenantId: 1,
                uploaderTemplateId: 1
            });
            await FilesCollection.createIndexAsync({ uploaderId: 1 });
            console.log('✓ Files indexes created');
        } catch (e) {
            console.error('Error creating files indexes:', e);
        }
    });
}
