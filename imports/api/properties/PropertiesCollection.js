import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PropertiesCollection = new Mongo.Collection('properties');

// Schema per le proprietà immobiliari
const PropertySchema = new SimpleSchema({
    tenantId: {
        type: String,
        label: 'ID Tenant (Agenzia)'
    },
    agentId: {
        type: String,
        label: 'ID Agente Responsabile',
        optional: true
    },
    title: {
        type: String,
        label: 'Titolo Annuncio'
    },
    description: {
        type: String,
        label: 'Descrizione Completa',
        optional: true
    },
    type: {
        type: String,
        label: 'Tipologia',
        allowedValues: ['appartamento', 'villa', 'ufficio', 'negozio', 'terreno', 'box'],
        defaultValue: 'appartamento'
    },
    status: {
        type: String,
        label: 'Stato',
        allowedValues: ['bozza', 'pubblicato', 'venduto', 'ritirato', 'in_trattativa'],
        defaultValue: 'bozza'
    },
    price: {
        type: Number,
        label: 'Prezzo (€)',
        min: 0
    },
    address: {
        type: Object,
        label: 'Indirizzo'
    },
    'address.street': {
        type: String,
        label: 'Via'
    },
    'address.city': {
        type: String,
        label: 'Città'
    },
    'address.province': {
        type: String,
        label: 'Provincia',
        optional: true
    },
    'address.postalCode': {
        type: String,
        label: 'CAP',
        optional: true
    },
    'address.country': {
        type: String,
        label: 'Nazione',
        defaultValue: 'Italia'
    },
    coordinates: {
        type: Object,
        label: 'Coordinate GPS',
        optional: true
    },
    'coordinates.lat': {
        type: Number,
        optional: true
    },
    'coordinates.lng': {
        type: Number,
        optional: true
    },
    features: {
        type: Object,
        label: 'Caratteristiche',
        optional: true
    },
    'features.bedrooms': {
        type: SimpleSchema.Integer,
        label: 'Camere da letto',
        optional: true,
        min: 0
    },
    'features.bathrooms': {
        type: SimpleSchema.Integer,
        label: 'Bagni',
        optional: true,
        min: 0
    },
    'features.sqm': {
        type: Number,
        label: 'Superficie (mq)',
        optional: true,
        min: 0
    },
    'features.floor': {
        type: SimpleSchema.Integer,
        label: 'Piano',
        optional: true
    },
    'features.energyClass': {
        type: String,
        label: 'Classe Energetica',
        optional: true,
        allowedValues: ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G']
    },
    images: {
        type: Array,
        label: 'Immagini',
        optional: true,
        defaultValue: []
    },
    'images.$': {
        type: String,
        label: 'URL Immagine'
    },
    publishedAt: {
        type: Date,
        label: 'Data Pubblicazione',
        optional: true
    },
    createdAt: {
        type: Date,
        label: 'Data Creazione'
    },
    updatedAt: {
        type: Date,
        label: 'Ultimo Aggiornamento'
    }
});

// Attach schema (commentato per compatibilità Meteor 3.0)
// PropertiesCollection.attachSchema(PropertySchema);

// Deny all client-side operations
if (Meteor.isServer) {
    PropertiesCollection.deny({
        insert: () => true,
        update: () => true,
        remove: () => true
    });

    // Create indexes for performance
    Meteor.startup(async () => {
        try {
            // Compound index for tenant-filtered queries
            await PropertiesCollection.createIndexAsync({ tenantId: 1, status: 1, price: -1 });
            await PropertiesCollection.createIndexAsync({ tenantId: 1, createdAt: -1 });
            await PropertiesCollection.createIndexAsync({ agentId: 1 });

            // Geospatial index for location-based queries
            await PropertiesCollection.createIndexAsync({ 'coordinates': '2dsphere' });

            console.log('✓ Properties indexes created');
        } catch (e) {
            console.error('Error creating properties indexes:', e);
        }
    });
}

export { PropertySchema };
