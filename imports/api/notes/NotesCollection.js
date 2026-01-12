import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

export const NotesCollection = new Mongo.Collection('notes');

const NoteSchema = new SimpleSchema({
    title: {
        type: String,
        label: 'Titolo Nota'
    },
    content: {
        type: String,
        label: 'Contenuto'
    },
    authorId: {
        type: String,
        label: 'ID Autore'
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

// NotesCollection.attachSchema( // Validazione commentataNoteSchema);

if (Meteor.isServer) {
    NotesCollection.deny({
        insert: () => true,
        update: () => true,
        remove: () => true
    });

    Meteor.startup(async () => {
        try {
            await NotesCollection.createIndexAsync({ tenantId: 1, authorId: 1 });
            console.log('✓ Notes indexes created');
        } catch (e) {
            console.error('Error creating notes indexes:', e);
        }
    });
}
