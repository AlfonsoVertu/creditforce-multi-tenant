import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PracticesCollection = new Mongo.Collection('practices');

const PracticeSchema = new SimpleSchema({
    code: {
        type: String,
        label: 'Codice Pratica (es. P-2024-001)'
    },
    status: {
        type: String,
        allowedValues: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'BLOCKED', 'CLOSED', 'ARCHIVED'],
        defaultValue: 'NEW'
    },
    // Mandante Owner (Rule 3.1)
    creditorOrgId: {
        type: String,
        label: 'ID Organizzazione Mandante'
    },
    // Main Servicer (Orchestrator)
    servicerOrgId: {
        type: String,
        label: 'ID Organizzazione Servicer',
        optional: true
    },
    debtorName: {
        type: String,
        label: 'Nome Debitore'
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) return new Date();
        }
    }
});

// PracticesCollection.attachSchema(PracticeSchema);

export const PracticeAssignmentsCollection = new Mongo.Collection('practice_assignments');

const AssignmentSchema = new SimpleSchema({
    practiceId: {
        type: String
    },
    userId: {
        type: String,
        label: 'Assegnato a Utente'
    },
    scope: {
        type: String,
        allowedValues: ['FULL', 'READONLY', 'LIMITED'], // Rule 2.3
        defaultValue: 'FULL'
    },
    roleOverride: {
        type: String,
        optional: true,
        label: 'Ruolo specifico per questa pratica (es. "legal_specialist")'
    },
    assignedAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) return new Date();
        }
    }
});

// PracticeAssignmentsCollection.attachSchema(AssignmentSchema);

if (Meteor.isServer) {
    PracticesCollection.createIndexAsync({ creditorOrgId: 1 });
    PracticesCollection.createIndexAsync({ servicerOrgId: 1 });
    PracticeAssignmentsCollection.createIndexAsync({ practiceId: 1 });
    PracticeAssignmentsCollection.createIndexAsync({ userId: 1 }); // Fundamental for "My Practices"
}
