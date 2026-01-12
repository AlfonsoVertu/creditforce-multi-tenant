import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { TenantsCollection } from '../../api/core/tenant/TenantsCollection';
import { RolesCollection } from '../../api/roles/RolesCollection';
import { NotesCollection } from '../../api/notes/NotesCollection';
import { FilesCollection } from '../../api/files/FilesCollection';
import { ContactsCollection } from '../../api/contacts/ContactsCollection';
import { createDefaultAgents } from '../../api/agents/methods';
import {
    INITIAL_TENANTS,
    INITIAL_USERS,
    INITIAL_TEMPLATES,
    INITIAL_NOTES,
    INITIAL_FILES,
    INITIAL_CONTACTS
} from './constants';

export const seedDatabase = async () => {
    console.log('🌱 Starting database seeding...');

    // 1. Check if already seeded
    const existingTenants = await TenantsCollection.find({}).countAsync();
    if (existingTenants > 0) {
        console.log('✓ Database already seeded, skipping...');
        return;
    }

    try {
        // 2. Create Tenants
        console.log('Creating tenants...');
        const tenantIdMap = {};
        for (const tenant of INITIAL_TENANTS) {
            const { id, ...tenantData } = tenant;
            const tenantId = await TenantsCollection.insertAsync({
                ...tenantData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            tenantIdMap[id] = tenantId;
            console.log(`  ✓ Created tenant: ${tenant.name} (${tenantId})`);
        }

        // 3. Create Permission Templates
        console.log('Creating permission templates...');
        const templateIdMap = {};
        for (const template of INITIAL_TEMPLATES) {
            const { id, ...templateData } = template;
            const templateId = await RolesCollection.insertAsync({
                ...templateData,
                createdAt: new Date()
            });
            templateIdMap[id] = templateId;
            console.log(`  ✓ Created template: ${template.name}`);
        }

        // 4. Create Roles in alanning:roles
        console.log('Creating global roles...');
        const rolesToCreate = ['admin', 'tenant-admin', 'agent', 'viewer', 'member'];
        for (const roleName of rolesToCreate) {
            await Roles.createRoleAsync(roleName, { unlessExists: true });
        }

        // 5. Create Users
        console.log('Creating users...');
        const userIdMap = {};
        for (const userData of INITIAL_USERS) {
            const { email, name, role, tenantId, jobTitle, assignedTemplateId, permissions } = userData;

            // Create user account
            const userId = await Accounts.createUserAsync({
                email,
                password: 'password123',
                profile: {
                    name,
                    role, // CRITICAL: Store role in profile for UI visibility
                    tenantId: tenantId ? tenantIdMap[tenantId] : null,
                    jobTitle,
                    assignedTemplateId: assignedTemplateId ? templateIdMap[assignedTemplateId] : null,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                }
            });

            // Set stats
            await Meteor.users.updateAsync(userId, {
                $set: {
                    permissions,
                    stats: {
                        lastLogin: new Date(),
                        totalSessions: 0,
                        pagesVisited: 0,
                        activeSeconds: 0,
                        toolsUsed: {}
                    }
                }
            });

            // Assign roles
            if (role === 'admin') {
                // Global admin
                await Roles.addUsersToRolesAsync(userId, ['admin'], Roles.GLOBAL_GROUP);
            } else {
                // Tenant-scoped roles
                const actualTenantId = tenantIdMap[tenantId];
                if (actualTenantId) {
                    await Roles.addUsersToRolesAsync(userId, [role, 'member'], actualTenantId);
                }

                // SPECIAL CASE: Multi-Tenant Agent
                if (email === 'multi.agent@demo.com') {
                    const secondaryTenantId = tenantIdMap['t-beta'];
                    if (secondaryTenantId) {
                        console.log(`    + Adding secondary context for ${email} in Beta Estate`);
                        await Roles.addUsersToRolesAsync(userId, ['agent', 'member'], secondaryTenantId);
                    }
                }
            }

            userIdMap[email] = userId;
            console.log(`  ✓ Created user: ${name} (${email}) - ${role}`);

            // NEW: Create default agents for each tenant admin
            if (role === 'tenant-admin' && tenantId) {
                const actualTenantId = tenantIdMap[tenantId];
                const tenant = INITIAL_TENANTS.find(t => t.id === tenantId);
                if (actualTenantId && tenant) {
                    console.log(`  🤖 Creating default agents for ${tenant.name}...`);
                    await createDefaultAgents(actualTenantId, tenant.slug, permissions);
                }
            }
        }

        // 6. Create Notes
        console.log('Creating notes...');
        const marcoId = userIdMap['marco.rossi@provider.xyz'];
        for (const note of INITIAL_NOTES) {
            await NotesCollection.insertAsync({
                ...note,
                authorId: marcoId,
                tenantId: tenantIdMap[note.tenantId],
                createdAt: new Date()
            });
        }
        console.log(`  ✓ Created ${INITIAL_NOTES.length} notes`);

        // 7. Create Files
        console.log('Creating files...');
        for (const file of INITIAL_FILES) {
            await FilesCollection.insertAsync({
                ...file,
                uploaderId: marcoId,
                uploaderTemplateId: templateIdMap[file.uploaderTemplateId],
                tenantId: tenantIdMap[file.tenantId],
                createdAt: new Date()
            });
        }
        console.log(`  ✓ Created ${INITIAL_FILES.length} files`);

        // 8. Create Contacts
        console.log('Creating contacts...');
        for (const contact of INITIAL_CONTACTS) {
            await ContactsCollection.insertAsync({
                ...contact,
                tenantId: tenantIdMap[contact.tenantId],
                createdAt: new Date()
            });
        }
        console.log(`  ✓ Created ${INITIAL_CONTACTS.length} contacts`);

        console.log('✅ Database seeding completed successfully!');
        console.log('\n📧 Login Credentials (password: password123):');
        console.log('   - admin@system.core (Super Admin)');
        console.log('   - manager@tenant-alpha.com (Tenant Manager - Alpha)');
        console.log('   - marco.rossi@provider.xyz (Senior Agent - Alpha)');
        console.log('   - manager@beta-estate.com (Tenant Manager - Beta)');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
};
