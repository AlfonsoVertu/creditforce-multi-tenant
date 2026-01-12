import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PermissionTemplatesCollection = new Mongo.Collection('permission_templates');

const PermissionTemplateSchema = new SimpleSchema({
    name: { type: String },
    description: { type: String, optional: true },
    targetRoles: { type: Array },
    'targetRoles.$': { type: String, allowedValues: ['agent', 'tenant-admin'] },
    permissions: { type: Array },
    'permissions.$': { type: String },
    tenantId: { type: String, optional: true }, // Optional: if null, it's a GLOBAL template (e.g. Plan Enterprise)
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

// PermissionTemplatesCollection.attachSchema(PermissionTemplateSchema);
