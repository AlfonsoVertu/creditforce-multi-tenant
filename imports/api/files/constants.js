export const DOCUMENT_SENSITIVITY = {
    L1_LOW: 'l1_low',       // Operational data (payments, balance)
    L2_MEDIUM: 'l2_medium', // Contracts, official docs
    L3_HIGH: 'l3_high'      // Sensitive, third-party, legal mandates
};

export const DOCUMENT_GROUPS = {
    G1_CREDIT: 'g1_credit',
    G2_OWNERSHIP: 'g2_ownership',
    G3_COMMUNICATION: 'g3_communication',
    G4_COLLATERAL: 'g4_collateral',
    G5_THIRD_PARTY: 'g5_third_party',
    G6_COMPLIANCE: 'g6_compliance',
    G7_INTERNAL: 'g7_internal'
};

export const DOCUMENT_TYPES = {
    // G1 - Existenza Credito
    CONTRACT_ORIGINAL: { id: 'contract_original', group: DOCUMENT_GROUPS.G1_CREDIT, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Contratto Originario' },
    DISBURSEMENT_PROOF: { id: 'disbursement_proof', group: DOCUMENT_GROUPS.G1_CREDIT, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Prova Erogazione' },
    BANK_STATEMENTS: { id: 'bank_statements', group: DOCUMENT_GROUPS.G1_CREDIT, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Estratti Conto' },
    PAYMENT_HISTORY: { id: 'payment_history', group: DOCUMENT_GROUPS.G1_CREDIT, sensitivity: DOCUMENT_SENSITIVITY.L1_LOW, label: 'Storico Pagamenti' },

    // G2 - Titolarità
    TITLE_CHAIN: { id: 'title_chain', group: DOCUMENT_GROUPS.G2_OWNERSHIP, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Catena Titolarità' },
    ASSIGNMENT_CONTRACT: { id: 'assignment_contract', group: DOCUMENT_GROUPS.G2_OWNERSHIP, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Contratto Cessione' },
    POWER_OF_ATTORNEY: { id: 'power_of_attorney', group: DOCUMENT_GROUPS.G2_OWNERSHIP, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Procura / Deleghe' },

    // G3 - Comunicazioni
    FORMAL_NOTICE: { id: 'formal_notice', group: DOCUMENT_GROUPS.G3_COMMUNICATION, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Diffida / Messa in Mora' },
    LEGAL_MAIL_RECEIPT: { id: 'legal_mail_receipt', group: DOCUMENT_GROUPS.G3_COMMUNICATION, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Ricevuta PEC/Raccomandata' },
    PAYMENT_INTIMATION: { id: 'payment_intimation', group: DOCUMENT_GROUPS.G3_COMMUNICATION, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Intimazione Pagamento' },

    // G4 - Garanzie
    MORTGAGE_DEED: { id: 'mortgage_deed', group: DOCUMENT_GROUPS.G4_COLLATERAL, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Atto Ipotecario' },
    CADASTRAL_SURVEY: { id: 'cadastral_survey', group: DOCUMENT_GROUPS.G4_COLLATERAL, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Visura Catastale' },
    VALUATION_REPORT: { id: 'valuation_report', group: DOCUMENT_GROUPS.G4_COLLATERAL, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Perizia Valutativa' },
    SURETY_BOND: { id: 'surety_bond', group: DOCUMENT_GROUPS.G4_COLLATERAL, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Fideiussione' },

    // G5 - Terze Parti
    VEHICLE_REGISTRY: { id: 'vehicle_registry', group: DOCUMENT_GROUPS.G5_THIRD_PARTY, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Visura PRA' },
    INVESTIGATION_REPORT: { id: 'investigation_report', group: DOCUMENT_GROUPS.G5_THIRD_PARTY, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Report Investigativo' },
    TRACING_RESULT: { id: 'tracing_result', group: DOCUMENT_GROUPS.G5_THIRD_PARTY, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Esito Rintraccio' },

    // G6 - Compliance
    PRIVACY_CONSENT: { id: 'privacy_consent', group: DOCUMENT_GROUPS.G6_COMPLIANCE, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Consenso Privacy' },
    AUDIT_LOG: { id: 'audit_log', group: DOCUMENT_GROUPS.G6_COMPLIANCE, sensitivity: DOCUMENT_SENSITIVITY.L3_HIGH, label: 'Audit Log File' },

    // G7 - Interno
    INTERNAL_NOTE: { id: 'internal_note', group: DOCUMENT_GROUPS.G7_INTERNAL, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Nota Interna' },
    CALL_SCRIPT: { id: 'call_script', group: DOCUMENT_GROUPS.G7_INTERNAL, sensitivity: DOCUMENT_SENSITIVITY.L1_LOW, label: 'Script Call' },
    RECOVERY_PLAN: { id: 'recovery_plan', group: DOCUMENT_GROUPS.G7_INTERNAL, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Piano di Rientro' },
    AI_STRATEGY_REPORT: { id: 'ai_strategy_report', group: DOCUMENT_GROUPS.G7_INTERNAL, sensitivity: DOCUMENT_SENSITIVITY.L2_MEDIUM, label: 'Report Strategia AI' }
};

export const DOCUMENT_ACTIONS = {
    VIEW: 'view',
    PREVIEW: 'preview',
    DOWNLOAD: 'download',
    UPLOAD: 'upload',
    REQUEST: 'request',
    VALIDATE: 'validate'
};
