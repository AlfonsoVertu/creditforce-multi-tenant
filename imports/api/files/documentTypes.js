/**
 * Document Types Registry
 * Defines all document types with visibility policies, required roles, and instructions
 */

import { DOCUMENT_GROUPS, DOCUMENT_SENSITIVITY } from './constants';
import { AGENT_ROLES } from '/imports/api/agents/constants';

// Document status enum
export const DOC_STATUS = {
    MISSING: 'missing',
    REQUESTED: 'requested',
    UPLOADED: 'uploaded',
    PENDING_VALIDATION: 'pending_validation',
    VALIDATED: 'validated',
    REJECTED: 'rejected'
};

/**
 * Complete Document Types Registry
 * Each document type includes:
 * - group: G1-G7 classification
 * - sensitivity: L1-L3 level
 * - allowedRoles: who can VIEW this document
 * - uploadableBy: who can UPLOAD this document
 * - requiredFrom: who is EXPECTED to provide this document
 * - canValidate: who can VALIDATE this document
 * - canRequest: who can REQUEST this document
 * - instructions: guidance text for the uploader
 */
export const DOCUMENT_TYPES = {
    // ============================================
    // G1 - ESISTENZA DEL CREDITO (Core)
    // ============================================
    CONTRATTO_ORIGINARIO: {
        id: 'CONTRATTO_ORIGINARIO',
        label: 'Contratto Originario',
        group: DOCUMENT_GROUPS.G1_CREDIT,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.MANDANTE, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        canRequest: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        instructions: 'Carica il contratto di finanziamento originale firmato dal debitore. Assicurati che tutte le pagine siano leggibili.'
    },
    PROVA_EROGAZIONE: {
        id: 'PROVA_EROGAZIONE',
        label: 'Prova Erogazione',
        group: DOCUMENT_GROUPS.G1_CREDIT,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.MANDANTE],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica la documentazione che prova l\'erogazione del credito (bonifico, contabile bancaria).'
    },
    ESTRATTO_CONTO: {
        id: 'ESTRATTO_CONTO',
        label: 'Estratto Conto / Scalare Interessi',
        group: DOCUMENT_GROUPS.G1_CREDIT,
        sensitivity: DOCUMENT_SENSITIVITY.L1_LOW,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE, AGENT_ROLES.PHONE_COLLECTION, AGENT_ROLES.VALUATOR],
        uploadableBy: [AGENT_ROLES.MANDANTE, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica l\'estratto conto aggiornato con lo scalare interessi e il saldo attuale.'
    },
    STORICO_PAGAMENTI: {
        id: 'STORICO_PAGAMENTI',
        label: 'Storico Pagamenti / Insoluti',
        group: DOCUMENT_GROUPS.G1_CREDIT,
        sensitivity: DOCUMENT_SENSITIVITY.L1_LOW,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE, AGENT_ROLES.PHONE_COLLECTION, AGENT_ROLES.HOME_COLLECTION],
        uploadableBy: [AGENT_ROLES.MANDANTE],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica lo storico dei pagamenti con evidenza delle rate insolute.'
    },

    // ============================================
    // G2 - TITOLARITÀ E LEGITTIMAZIONE
    // ============================================
    CATENA_TITOLARITA: {
        id: 'CATENA_TITOLARITA',
        label: 'Catena Titolarità / Cessione',
        group: DOCUMENT_GROUPS.G2_OWNERSHIP,
        sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.MANDANTE, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.LEGAL, AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        instructions: 'Carica la documentazione che attesta la catena di titolarità del credito.'
    },
    CONTRATTO_CESSIONE: {
        id: 'CONTRATTO_CESSIONE',
        label: 'Contratto di Cessione',
        group: DOCUMENT_GROUPS.G2_OWNERSHIP,
        sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        uploadableBy: [AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.SERVICER],
        canValidate: [AGENT_ROLES.LEGAL],
        canRequest: [AGENT_ROLES.LEGAL],
        instructions: 'Carica il contratto di cessione del credito se applicabile.'
    },
    PROCURA_DELEGHE: {
        id: 'PROCURA_DELEGHE',
        label: 'Procura / Deleghe Operatore',
        group: DOCUMENT_GROUPS.G2_OWNERSHIP,
        sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        uploadableBy: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        requiredFrom: [AGENT_ROLES.SERVICER],
        canValidate: [AGENT_ROLES.LEGAL],
        canRequest: [AGENT_ROLES.LEGAL],
        instructions: 'Carica le procure e deleghe che autorizzano l\'operatività sul credito.'
    },

    // ============================================
    // G3 - COMUNICAZIONI E NOTIFICA (Call Action)
    // ============================================
    DIFFIDA_MORA: {
        id: 'DIFFIDA_MORA',
        label: 'Diffida / Messa in Mora',
        group: DOCUMENT_GROUPS.G3_COMMUNICATION,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE, AGENT_ROLES.PHONE_COLLECTION],
        uploadableBy: [AGENT_ROLES.LEGAL, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.LEGAL],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica la lettera di diffida/messa in mora inviata al debitore.'
    },
    PEC_RACCOMANDATA: {
        id: 'PEC_RACCOMANDATA',
        label: 'PEC / Raccomandata A/R',
        group: DOCUMENT_GROUPS.G3_COMMUNICATION,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.LEGAL, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.LEGAL],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica la ricevuta PEC o l\'avviso di ricevimento della raccomandata.'
    },
    PREAVVISO_DBT: {
        id: 'PREAVVISO_DBT',
        label: 'Preavviso / DBT / Intimazione',
        group: DOCUMENT_GROUPS.G3_COMMUNICATION,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.LEGAL],
        requiredFrom: [AGENT_ROLES.LEGAL],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica il preavviso o l\'intimazione formale inviata.'
    },

    // ============================================
    // G4 - GARANZIE E COLLATERAL
    // ============================================
    IPOTECA: {
        id: 'IPOTECA',
        label: 'Ipoteca / Note Iscrizione',
        group: DOCUMENT_GROUPS.G4_COLLATERAL,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE, AGENT_ROLES.VALUATOR],
        uploadableBy: [AGENT_ROLES.MANDANTE, AGENT_ROLES.LEGAL],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.LEGAL],
        canRequest: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        instructions: 'Carica la nota di iscrizione ipotecaria e relative annotazioni.'
    },
    VISURA_CATASTALE: {
        id: 'VISURA_CATASTALE',
        label: 'Visura Catastale / Ipotecaria',
        group: DOCUMENT_GROUPS.G4_COLLATERAL,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.VALUATOR, AGENT_ROLES.INVESTIGATOR],
        uploadableBy: [AGENT_ROLES.LEGAL, AGENT_ROLES.INVESTIGATOR, AGENT_ROLES.VALUATOR],
        requiredFrom: [AGENT_ROLES.INVESTIGATOR],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica la visura catastale o ipotecaria aggiornata del bene.'
    },
    FIDEIUSSIONE: {
        id: 'FIDEIUSSIONE',
        label: 'Fideiussione / Pegno',
        group: DOCUMENT_GROUPS.G4_COLLATERAL,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.MANDANTE],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.LEGAL],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica le fideiussioni o i pegni a garanzia del credito.'
    },
    PERIZIA_VALUTAZIONE: {
        id: 'PERIZIA_VALUTAZIONE',
        label: 'Perizia / Valutazione',
        group: DOCUMENT_GROUPS.G4_COLLATERAL,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.VALUATOR, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.VALUATOR],
        requiredFrom: [AGENT_ROLES.VALUATOR],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica la perizia di stima del bene con valutazione del realizzo.'
    },

    // ============================================
    // G5 - TERZE PARTI (OSINT)
    // ============================================
    RAPPORTO_INVESTIGATIVO: {
        id: 'RAPPORTO_INVESTIGATIVO',
        label: 'Rapporto Investigativo',
        group: DOCUMENT_GROUPS.G5_THIRD_PARTY,
        sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.INVESTIGATOR],
        uploadableBy: [AGENT_ROLES.INVESTIGATOR],
        requiredFrom: [AGENT_ROLES.INVESTIGATOR],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica il rapporto investigativo con esiti reperibilità e asset tracing.'
    },
    VISURA_PRA: {
        id: 'VISURA_PRA',
        label: 'Visura PRA Veicoli',
        group: DOCUMENT_GROUPS.G5_THIRD_PARTY,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.INVESTIGATOR],
        uploadableBy: [AGENT_ROLES.INVESTIGATOR],
        requiredFrom: [AGENT_ROLES.INVESTIGATOR],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica la visura PRA dei veicoli intestati al debitore.'
    },
    VISURA_CCIAA: {
        id: 'VISURA_CCIAA',
        label: 'Visura CCIAA',
        group: DOCUMENT_GROUPS.G5_THIRD_PARTY,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.INVESTIGATOR],
        uploadableBy: [AGENT_ROLES.INVESTIGATOR],
        requiredFrom: [AGENT_ROLES.INVESTIGATOR],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica la visura camerale del debitore.'
    },

    // ============================================
    // G6 - COMPLIANCE E PRIVACY
    // ============================================
    INFORMATIVA_PRIVACY: {
        id: 'INFORMATIVA_PRIVACY',
        label: 'Informativa Privacy / Consensi',
        group: DOCUMENT_GROUPS.G6_COMPLIANCE,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL, AGENT_ROLES.MANDANTE],
        uploadableBy: [AGENT_ROLES.MANDANTE, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.MANDANTE],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [AGENT_ROLES.SERVICER],
        instructions: 'Carica l\'informativa privacy firmata e i consensi del debitore.'
    },

    // ============================================
    // G7 - OPERATIVO E STRATEGICO (Interno)
    // ============================================
    NOTE_CHIAMATA: {
        id: 'NOTE_CHIAMATA',
        label: 'Note Chiamata',
        group: DOCUMENT_GROUPS.G7_INTERNAL,
        sensitivity: DOCUMENT_SENSITIVITY.L1_LOW,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.PHONE_COLLECTION, AGENT_ROLES.HOME_COLLECTION],
        uploadableBy: [AGENT_ROLES.PHONE_COLLECTION, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.PHONE_COLLECTION],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [],
        instructions: 'Inserisci le note relative alle chiamate effettuate al debitore.'
    },
    PIANO_RIENTRO: {
        id: 'PIANO_RIENTRO',
        label: 'Piano Rientro Proposto',
        group: DOCUMENT_GROUPS.G7_INTERNAL,
        sensitivity: DOCUMENT_SENSITIVITY.L1_LOW,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.PHONE_COLLECTION, AGENT_ROLES.HOME_COLLECTION, AGENT_ROLES.LEGAL],
        uploadableBy: [AGENT_ROLES.PHONE_COLLECTION, AGENT_ROLES.HOME_COLLECTION, AGENT_ROLES.SERVICER],
        requiredFrom: [AGENT_ROLES.PHONE_COLLECTION],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [],
        instructions: 'Carica la proposta di piano di rientro concordata con il debitore.'
    },
    REPORT_VISITA: {
        id: 'REPORT_VISITA',
        label: 'Report Visita Domiciliare',
        group: DOCUMENT_GROUPS.G7_INTERNAL,
        sensitivity: DOCUMENT_SENSITIVITY.L1_LOW,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.HOME_COLLECTION, AGENT_ROLES.LEGAL],
        uploadableBy: [AGENT_ROLES.HOME_COLLECTION],
        requiredFrom: [AGENT_ROLES.HOME_COLLECTION],
        canValidate: [AGENT_ROLES.SERVICER],
        canRequest: [],
        instructions: 'Carica il report della visita domiciliare con foto e note sul sopralluogo.'
    },
    REPORT_AI: {
        id: 'REPORT_AI',
        label: 'Report AI / Strategia',
        group: DOCUMENT_GROUPS.G7_INTERNAL,
        sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM,
        allowedRoles: [AGENT_ROLES.SERVICER, AGENT_ROLES.LEGAL],
        uploadableBy: [AGENT_ROLES.SERVICER],
        requiredFrom: [],
        canValidate: [],
        canRequest: [],
        instructions: 'Report generato automaticamente dal sistema AI.'
    }
};

/**
 * Get documents required from a specific role
 * @param {string} agentRole - The agent role
 * @returns {Array} List of document type objects
 */
export const getRequiredDocuments = (agentRole) => {
    return Object.values(DOCUMENT_TYPES).filter(
        doc => doc.requiredFrom.includes(agentRole)
    );
};

/**
 * Get documents visible to a specific role
 * @param {string} agentRole - The agent role
 * @returns {Array} List of document type objects
 */
export const getVisibleDocuments = (agentRole) => {
    return Object.values(DOCUMENT_TYPES).filter(
        doc => doc.allowedRoles.includes(agentRole)
    );
};

/**
 * Get documents uploadable by a specific role
 * @param {string} agentRole - The agent role
 * @returns {Array} List of document type objects
 */
export const getUploadableDocuments = (agentRole) => {
    return Object.values(DOCUMENT_TYPES).filter(
        doc => doc.uploadableBy.includes(agentRole)
    );
};

/**
 * Check if a role can perform an action on a document type
 * @param {string} agentRole 
 * @param {string} docTypeId 
 * @param {string} action - 'view', 'upload', 'validate', 'request'
 * @returns {boolean}
 */
export const canPerformAction = (agentRole, docTypeId, action) => {
    const docType = DOCUMENT_TYPES[docTypeId];
    if (!docType) return false;

    switch (action) {
        case 'view':
            return docType.allowedRoles.includes(agentRole);
        case 'upload':
            return docType.uploadableBy.includes(agentRole);
        case 'validate':
            return docType.canValidate.includes(agentRole);
        case 'request':
            return docType.canRequest.includes(agentRole);
        default:
            return false;
    }
};
