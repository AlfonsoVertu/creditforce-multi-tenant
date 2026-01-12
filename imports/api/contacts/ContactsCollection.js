import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

export const ContactsCollection = new Mongo.Collection('contacts');

const ContactSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Nome Completo'
    },
    email: {
        type: String,
        regEx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        label: 'Email'
    },
    phone: {
        type: String,
        label: 'Telefono'
    },
    type: {
        type: String,
        allowedValues: ['buyer', 'seller', 'lead'],
        label: 'Tipo Contatto'
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

// ContactsCollection.attachSchema( // Validazione commentataContactSchema);

if (Meteor.isServer) {
    ContactsCollection.deny({
        insert: () => true,
        update: () => true,
        remove: () => true
    });

    Meteor.startup(async () => {
        try {
            await ContactsCollection.createIndexAsync({ tenantId: 1, type: 1 });
            console.log('✓ Contacts indexes created');
        } catch (e) {
            console.error('Error creating contacts indexes:', e);
        }
    });
}
