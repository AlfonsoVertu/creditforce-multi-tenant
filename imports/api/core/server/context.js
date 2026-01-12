import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

/**
 * Valida che l'utente corrente abbia accesso al tenant richiesto.
 * Utilizza le API Async di alanning:roles v4.
 * 
 * @param {string} userId - ID dell'utente autenticato
 * @param {string} tenantId - ID del tenant target
 * @returns {Promise<Object>} - Oggetto contesto validato
 */
export const validateTenantContext = async (userId, tenantId) => {
    if (!userId) throw new Meteor.Error('401', 'Autenticazione richiesta.');
    if (!tenantId) throw new Meteor.Error('400', 'Tenant ID mancante.');

    // Verifica appartenenza al gruppo (scope) del tenant
    // In v4, il secondo argomento è il ruolo, il terzo è lo scope (tenantId)
    // 'member' è il ruolo base implicito per l'accesso
    const hasAccess = await Roles.userIsInRoleAsync(userId, ['member', 'admin', 'agent', 'tenant-admin'], tenantId);

    // Backdoor per SuperAdmin globale (piattaforma SaaS)
    const isSuperAdmin = await Roles.userIsInRoleAsync(userId, ['admin'], Roles.GLOBAL_GROUP);

    if (!hasAccess && !isSuperAdmin) {
        throw new Meteor.Error('403', 'Accesso negato al tenant specificato.');
    }

    return { userId, tenantId, isSuperAdmin };
};
