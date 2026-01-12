import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {
    CheckCircle,
    Clock,
    AlertCircle,
    Upload,
    FileText,
    ChevronDown,
    ChevronRight,
    Info,
    SendHorizontal
} from 'lucide-react';
import {
    DOCUMENT_TYPES,
    DOC_STATUS,
    getRequiredDocuments,
    getUploadableDocuments,
    canPerformAction
} from '/imports/api/files/documentTypes';
import { FilesCollection } from '/imports/api/files/FilesCollection';

/**
 * PracticeDocumentChecklist - Shows required documents for agent role
 * with status indicators and contextual instructions
 */
export const PracticeDocumentChecklist = ({ practiceId, practice }) => {
    const [expandedType, setExpandedType] = useState(null);
    const [uploading, setUploading] = useState(null);

    // Get current user's agent role
    const { user, agentRole, documents, isLoading } = useTracker(() => {
        const user = Meteor.user();
        const agentRole = user?.profile?.agentRole || user?.profile?.role || 'agent';

        // Subscribe to practice documents
        const handle = Meteor.subscribe('files.byPractice', practiceId);
        const docs = FilesCollection.find({ practiceId }).fetch();

        return {
            user,
            agentRole,
            documents: docs,
            isLoading: !handle.ready()
        };
    }, [practiceId]);

    // Get documents this role should provide
    const requiredDocs = getRequiredDocuments(agentRole);
    const uploadableDocs = getUploadableDocuments(agentRole);

    // Calculate status for each required document type
    const getDocumentStatus = (docTypeId) => {
        const existingDoc = documents.find(d => d.docType === docTypeId);
        if (!existingDoc) return DOC_STATUS.MISSING;
        if (existingDoc.status === 'validated') return DOC_STATUS.VALIDATED;
        if (existingDoc.status === 'pending_validation') return DOC_STATUS.PENDING_VALIDATION;
        return DOC_STATUS.UPLOADED;
    };

    // Handle simulated upload
    const handleUpload = (docType) => {
        setUploading(docType.id);

        Meteor.call('files.create', {
            name: `${docType.label}_${Date.now()}.pdf`,
            type: 'application/pdf',
            size: 1024000,
            practiceId: practiceId,
            docType: docType.id,
            group: docType.group,
            sensitivity: docType.sensitivity
        }, (err, result) => {
            setUploading(null);
            if (err) {
                console.error('Upload error:', err);
            } else {
                console.log('Document uploaded:', result);
            }
        });
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const config = {
            [DOC_STATUS.MISSING]: {
                icon: AlertCircle,
                color: 'text-red-500 bg-red-50',
                label: 'Mancante'
            },
            [DOC_STATUS.REQUESTED]: {
                icon: Clock,
                color: 'text-orange-500 bg-orange-50',
                label: 'Richiesto'
            },
            [DOC_STATUS.UPLOADED]: {
                icon: Clock,
                color: 'text-blue-500 bg-blue-50',
                label: 'Caricato'
            },
            [DOC_STATUS.PENDING_VALIDATION]: {
                icon: Clock,
                color: 'text-yellow-500 bg-yellow-50',
                label: 'Da Validare'
            },
            [DOC_STATUS.VALIDATED]: {
                icon: CheckCircle,
                color: 'text-green-500 bg-green-50',
                label: 'Validato'
            }
        };

        const { icon: Icon, color, label } = config[status] || config[DOC_STATUS.MISSING];

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {label}
            </span>
        );
    };

    if (isLoading) {
        return <div className="text-gray-500">Caricamento checklist...</div>;
    }

    // Calculate completion stats
    const totalRequired = requiredDocs.length;
    const completedDocs = requiredDocs.filter(
        doc => [DOC_STATUS.UPLOADED, DOC_STATUS.VALIDATED, DOC_STATUS.PENDING_VALIDATION]
            .includes(getDocumentStatus(doc.id))
    ).length;
    const completionPercent = totalRequired > 0 ? Math.round((completedDocs / totalRequired) * 100) : 0;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header with progress */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                        Documenti Richiesti
                    </h3>
                    <span className="text-sm text-gray-500">
                        {completedDocs}/{totalRequired} completati
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${completionPercent === 100 ? 'bg-green-500' : 'bg-indigo-600'
                            }`}
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>

                {/* Role context */}
                <p className="mt-2 text-sm text-gray-500">
                    In base al tuo ruolo ({agentRole}), ecco i documenti che devi fornire:
                </p>
            </div>

            {/* Document list */}
            <div className="divide-y divide-gray-100">
                {requiredDocs.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        Nessun documento richiesto per il tuo ruolo
                    </div>
                ) : (
                    requiredDocs.map((docType) => {
                        const status = getDocumentStatus(docType.id);
                        const isExpanded = expandedType === docType.id;
                        const canUpload = canPerformAction(agentRole, docType.id, 'upload');

                        return (
                            <div key={docType.id} className="hover:bg-gray-50">
                                {/* Main row */}
                                <div
                                    className="p-4 flex items-center cursor-pointer"
                                    onClick={() => setExpandedType(isExpanded ? null : docType.id)}
                                >
                                    <div className="flex-shrink-0 mr-3">
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-900">
                                                {docType.label}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-400 uppercase">
                                                {docType.group}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <StatusBadge status={status} />

                                        {canUpload && status === DOC_STATUS.MISSING && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpload(docType);
                                                }}
                                                disabled={uploading === docType.id}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                <Upload className="w-4 h-4 mr-1" />
                                                {uploading === docType.id ? 'Caricamento...' : 'Carica'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded instructions */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 pl-12">
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex items-start">
                                                <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-blue-800 font-medium">
                                                        Istruzioni
                                                    </p>
                                                    <p className="text-sm text-blue-700 mt-1">
                                                        {docType.instructions}
                                                    </p>
                                                    <div className="mt-2 flex items-center text-xs text-blue-600">
                                                        <span className="mr-3">
                                                            Sensibilità: <strong>{docType.sensitivity}</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Also show other uploadable documents */}
            {uploadableDocs.filter(d => !requiredDocs.includes(d)).length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-500 mb-2">
                        Altri documenti che puoi caricare:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {uploadableDocs
                            .filter(d => !requiredDocs.find(r => r.id === d.id))
                            .map(docType => (
                                <button
                                    key={docType.id}
                                    onClick={() => handleUpload(docType)}
                                    disabled={uploading === docType.id}
                                    className="inline-flex items-center px-2 py-1 bg-white border border-gray-300 text-xs rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <Upload className="w-3 h-3 mr-1" />
                                    {docType.label}
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default PracticeDocumentChecklist;
