import { DOCUMENT_GROUPS, DOCUMENT_SENSITIVITY, DOCUMENT_ACTIONS } from '/imports/api/files/constants';

// Internal functional roles for policy check
export const FUNCTIONAL_ROLES = {
    ADMIN: 'admin',
    MANDANTE: 'mandante',
    SERVICER: 'servicer',
    LEGAL: 'legal',
    PHONE: 'phone_collection',
    HOME: 'home_collection',
    INVESTIGATOR: 'investigator',
    VALUATOR: 'valuator',
    COMPLIANCE: 'compliance'
};

export class DocumentPolicy {

    /**
     * Determines the functional role of a user in the context of a practice/tenant
     */
    static getFunctionalRole(user, tenantId, practiceContext = null) {
        if (!user || !user.profile) return null;

        // 1. Admin Global
        if (user.profile.role === 'admin') return FUNCTIONAL_ROLES.ADMIN;

        // 2. Mandante (if practice context provided, or if user is Mandante Organization)
        // Assumption: Mandante users have 'mandante' role or org type
        if (practiceContext && practiceContext.creditorOrgId === user.profile.orgId) {
            return FUNCTIONAL_ROLES.MANDANTE;
        }
        if (user.profile.role === 'mandante') return FUNCTIONAL_ROLES.MANDANTE; // Fallback

        // 3. Servicer (Tenant Admin)
        if (user.profile.role === 'tenant-admin' && user.profile.tenantId === tenantId) {
            return FUNCTIONAL_ROLES.SERVICER;
        }

        // 4. Agents based on Job Title or specific Role tag
        const job = (user.profile.jobTitle || '').toLowerCase();

        if (job.includes('legale') || job.includes('avvocato')) return FUNCTIONAL_ROLES.LEGAL;
        if (job.includes('phone') || job.includes('recupero telefonico')) return FUNCTIONAL_ROLES.PHONE;
        if (job.includes('home') || job.includes('domiciliare')) return FUNCTIONAL_ROLES.HOME;
        if (job.includes('investigat')) return FUNCTIONAL_ROLES.INVESTIGATOR;
        if (job.includes('valuta') || job.includes('perito')) return FUNCTIONAL_ROLES.VALUATOR;
        if (job.includes('compliance')) return FUNCTIONAL_ROLES.COMPLIANCE;

        // Check agentRole field (from default agents)
        const agentRole = user.profile.agentRole;
        if (agentRole) {
            const roleMap = {
                'mandante': FUNCTIONAL_ROLES.MANDANTE,
                'servicer': FUNCTIONAL_ROLES.SERVICER,
                'phone_collection': FUNCTIONAL_ROLES.PHONE,
                'home_collection': FUNCTIONAL_ROLES.HOME,
                'legal': FUNCTIONAL_ROLES.LEGAL,
                'investigator': FUNCTIONAL_ROLES.INVESTIGATOR,
                'valuator': FUNCTIONAL_ROLES.VALUATOR
            };
            if (roleMap[agentRole]) return roleMap[agentRole];
        }

        // Default fallback
        return FUNCTIONAL_ROLES.PHONE;
    }

    /**
     * Returns the allowed actions for a user on a specific document type
     */
    static getActionsAllowed(user, docTypeConfig, tenantId, practiceContext = null) {
        const role = this.getFunctionalRole(user, tenantId, practiceContext);
        const group = docTypeConfig.group;
        const sensitivity = docTypeConfig.sensitivity;

        const actions = {
            [DOCUMENT_ACTIONS.VIEW]: false,
            [DOCUMENT_ACTIONS.PREVIEW]: false,
            [DOCUMENT_ACTIONS.DOWNLOAD]: false,
            [DOCUMENT_ACTIONS.UPLOAD]: false,
            [DOCUMENT_ACTIONS.REQUEST]: false,
            [DOCUMENT_ACTIONS.VALIDATE]: false
        };

        if (!role) return actions;

        // ADMIN / SERVICER -> Full Full
        if ([FUNCTIONAL_ROLES.ADMIN, FUNCTIONAL_ROLES.SERVICER].includes(role)) {
            Object.keys(actions).forEach(k => actions[k] = true);
            return actions;
        }

        // --- SENSITIVITY OVERLAY (Rule 4) ---
        // Block actions if sensitivity violation, even if group matches
        if (role === FUNCTIONAL_ROLES.PHONE && sensitivity === DOCUMENT_SENSITIVITY.L3_HIGH) {
            return actions; // Block all
        }
        if (role === FUNCTIONAL_ROLES.INVESTIGATOR && sensitivity === DOCUMENT_SENSITIVITY.L3_HIGH && group !== DOCUMENT_GROUPS.G5_THIRD_PARTY) {
            return actions; // Block L3 outside G5
        }

        // --- MATRIX LOGIC ---

        // A) MANDANTE
        if (role === FUNCTIONAL_ROLES.MANDANTE) {
            if (group !== DOCUMENT_GROUPS.G7_INTERNAL) {
                actions.view = true;
                actions.preview = true;
                actions.download = true;
                actions.upload = true;
                actions.request = false; // Receives requests
            } else {
                // G7: only "redacted" reports
                if (docTypeConfig.id === 'ai_strategy_report') {
                    actions.view = true;
                    actions.preview = true;
                    actions.download = true;
                }
            }
            return actions;
        }

        // C) LEGAL
        if (role === FUNCTIONAL_ROLES.LEGAL) {
            // Full access G1-G4 + G6/G7
            actions.view = true;
            actions.preview = true;
            actions.download = true;
            actions.upload = true;
            actions.validate = true;
            actions.request = true;
            return actions;
        }

        // D) PHONE COLLECTION
        if (role === FUNCTIONAL_ROLES.PHONE) {
            const deniedGroups = [DOCUMENT_GROUPS.G2_OWNERSHIP, DOCUMENT_GROUPS.G5_THIRD_PARTY, DOCUMENT_GROUPS.G4_COLLATERAL];

            if (deniedGroups.includes(group)) {
                // G4 partial? Policy: "Perizia integrale NO". 
                // If docType is 'valuation_report' (Perizia), block.
                return actions;
            }

            // Allowed: G1, G3, G7
            actions.view = true;
            actions.preview = true;
            actions.download = false; // NO DOWNLOAD
            actions.upload = true; // Operational attachments
            actions.request = true;
            actions.validate = false;

            return actions;
        }

        // D2) HOME COLLECTION (Recupero Domiciliare)
        if (role === FUNCTIONAL_ROLES.HOME) {
            // Similar to PHONE but can see G4 (Collateral) in preview mode
            const deniedGroups = [DOCUMENT_GROUPS.G2_OWNERSHIP, DOCUMENT_GROUPS.G5_THIRD_PARTY];

            if (deniedGroups.includes(group)) {
                return actions; // Blocked
            }

            // G4: Can see collateral but only preview (no download)
            if (group === DOCUMENT_GROUPS.G4_COLLATERAL) {
                actions.view = true;
                actions.preview = true;
                actions.download = false;
                return actions;
            }

            // Allowed: G1, G3, G7
            actions.view = true;
            actions.preview = true;
            actions.download = false; // NO DOWNLOAD
            actions.upload = true; // Operational attachments
            actions.request = true;
            actions.validate = false;

            return actions;
        }

        // E) INVESTIGATOR
        if (role === FUNCTIONAL_ROLES.INVESTIGATOR) {
            if (group === DOCUMENT_GROUPS.G5_THIRD_PARTY) {
                actions.view = true;
                actions.preview = true;
                actions.download = true;
                actions.upload = true;
            }
            // G1 min info (Read)
            if (group === DOCUMENT_GROUPS.G1_CREDIT) {
                actions.view = true;
                actions.preview = true;
            }
            // G4 partial (Read - Sintesi)
            if (group === DOCUMENT_GROUPS.G4_COLLATERAL && sensitivity !== DOCUMENT_SENSITIVITY.L3_HIGH) {
                actions.view = true;
                actions.preview = true;
            }
            return actions;
        }

        // F) VALUATOR
        if (role === FUNCTIONAL_ROLES.VALUATOR) {
            if (group === DOCUMENT_GROUPS.G4_COLLATERAL) {
                actions.view = true;
                actions.preview = true;
                actions.download = true;
                actions.upload = true;
            }
            if (group === DOCUMENT_GROUPS.G1_CREDIT || group === DOCUMENT_GROUPS.G5_THIRD_PARTY) {
                actions.view = true;
                actions.preview = true;
            }
            if (group === DOCUMENT_GROUPS.G7_INTERNAL && docTypeConfig.id === 'ai_strategy_report') {
                actions.view = true; // Report sezione economica
            }
            return actions;
        }

        // G) COMPLIANCE
        if (role === FUNCTIONAL_ROLES.COMPLIANCE) {
            actions.view = true;
            actions.preview = true;
            actions.download = true;
            if (group === DOCUMENT_GROUPS.G6_COMPLIANCE) {
                actions.validate = true;
            }
            return actions;
        }

        return actions;
    }

    /**
     * Returns a MongoDB query selector to filter documents visible to the user
     */
    static getVisibleDocumentsQuery(user, tenantId) {
        const role = this.getFunctionalRole(user, tenantId);

        // Admin / Servicer / Legal -> See All
        if ([FUNCTIONAL_ROLES.ADMIN, FUNCTIONAL_ROLES.SERVICER, FUNCTIONAL_ROLES.LEGAL].includes(role)) {
            return {};
        }

        // Mandante -> All except G7 (Internal)
        if (role === FUNCTIONAL_ROLES.MANDANTE) {
            return {
                $or: [
                    { group: { $ne: DOCUMENT_GROUPS.G7_INTERNAL } },
                    { docTypeId: 'ai_strategy_report' } // Exception for Report
                ]
            };
        }

        // Phone -> Denied G2, G5, G4(Full). No L3.
        if (role === FUNCTIONAL_ROLES.PHONE) {
            return {
                group: {
                    $nin: [DOCUMENT_GROUPS.G2_OWNERSHIP, DOCUMENT_GROUPS.G5_THIRD_PARTY, DOCUMENT_GROUPS.G4_COLLATERAL]
                },
                sensitivity: { $ne: DOCUMENT_SENSITIVITY.L3_HIGH } // Rule 4: Never L3
            };
        }

        // Home Collection -> Same as Phone but with G4 allowed (preview only)
        if (role === FUNCTIONAL_ROLES.HOME) {
            return {
                group: {
                    $nin: [DOCUMENT_GROUPS.G2_OWNERSHIP, DOCUMENT_GROUPS.G5_THIRD_PARTY]
                },
                sensitivity: { $ne: DOCUMENT_SENSITIVITY.L3_HIGH }
            };
        }

        // Investigator -> Only G5 + G1(Read) + G4(Sintesi). 
        // Rule 4: L3 ONLY on G5.
        if (role === FUNCTIONAL_ROLES.INVESTIGATOR) {
            return {
                $or: [
                    { group: DOCUMENT_GROUPS.G5_THIRD_PARTY }, // Can see L3 here
                    {
                        group: { $in: [DOCUMENT_GROUPS.G1_CREDIT, DOCUMENT_GROUPS.G4_COLLATERAL] },
                        sensitivity: { $ne: DOCUMENT_SENSITIVITY.L3_HIGH }
                    }
                ]
            };
        }

        // Valuator -> G4 and G1
        if (role === FUNCTIONAL_ROLES.VALUATOR) {
            return {
                group: { $in: [DOCUMENT_GROUPS.G4_COLLATERAL, DOCUMENT_GROUPS.G1_CREDIT, DOCUMENT_GROUPS.G5_THIRD_PARTY] },
                // Maybe filter sensitive G5?
            };
        }

        // Compliance -> See All
        if (role === FUNCTIONAL_ROLES.COMPLIANCE) return {};

        // Default (Safety) -> Only L1?
        return { sensitivity: DOCUMENT_SENSITIVITY.L1_LOW };
    }
}
