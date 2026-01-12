import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FilesCollection } from '/imports/api/files/FilesCollection';
import { Eye, Download, Upload, FileText, AlertTriangle } from 'lucide-react';
import { DOCUMENT_TYPES, DOCUMENT_GROUPS } from '/imports/api/files/constants';
import { DocumentPolicy } from '/imports/api/core/policy/DocumentPolicy';

export const PracticeDocuments = ({ practiceId, currentUser }) => {
    // 1. Fetch Files (Already filtered by Policy on Server!)
    const { files, isLoading } = useTracker(() => {
        Meteor.subscribe('files.byTenant', practiceId);
        return {
            isLoading: false,
            files: FilesCollection.find({}).fetch()
        };
    });

    const [isUploading, setIsUploading] = useState(false);

    // 2. Helper for permissions
    const getActions = (file) => {
        // Construct a "config" object from file metadata that resembles the constant structure
        const docConfig = {
            id: file.docTypeId || 'generic',
            group: file.group,
            sensitivity: file.sensitivity || 'l2_medium'
        };
        // Use Policy Engine (Client Side Calculation)
        // Ensure to pass tenantId from profile
        return DocumentPolicy.getActionsAllowed(currentUser, docConfig, currentUser.profile.tenantId);
    };

    const handleSimulateUpload = () => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            Meteor.call('files.create', {
                name: `Doc_Caricato_${Date.now()}.pdf`,
                size: '1.2 MB',
                type: 'PDF', // Generic Type
                docTypeId: 'generic_doc',
                // In real app, we pass practiceId here to link it strictly
            }, (err) => {
                setIsUploading(false);
                if (err) alert(err.message);
            });
        }, 1200);
    };

    // Helper to get group label
    const getGroupLabel = (groupCode) => {
        const map = {
            [DOCUMENT_GROUPS.G1_CREDIT]: 'G1 - Credito',
            [DOCUMENT_GROUPS.G2_OWNERSHIP]: 'G2 - Titolarità',
            [DOCUMENT_GROUPS.G3_CALL_ACTION]: 'G3 - Call Action',
            [DOCUMENT_GROUPS.G4_COLLATERAL]: 'G4 - Collateral',
            [DOCUMENT_GROUPS.G5_THIRD_PARTY]: 'G5 - Terze Parti',
            [DOCUMENT_GROUPS.G6_COMPLIANCE]: 'G6 - Compliance',
            [DOCUMENT_GROUPS.G7_INTERNAL]: 'G7 - Interno'
        };
        return map[groupCode] || groupCode;
    };

    if (isLoading) return <div className="p-4 text-center text-slate-400">Caricamento documenti...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Documenti del Fascicolo</h3>
                <button
                    onClick={handleSimulateUpload}
                    disabled={isUploading}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-bold text-xs shadow-sm"
                >
                    {isUploading ? <Upload size={14} className="animate-spin" /> : <Upload size={14} />}
                    {isUploading ? 'Caricamento...' : 'Carica Documento'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {files.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
                        <FileText size={32} className="mx-auto mb-2 opacity-50" />
                        Nessun documento visibile in questo fascicolo.
                    </div>
                ) : files.map(file => {
                    const actions = getActions(file);

                    return (
                        <div key={file._id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-100 transition">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{file.name}</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px] uppercase">{getGroupLabel(file.group)}</span>
                                        <span>{file.size}</span>
                                        {file.sensitivity === 'l3_high' && <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-100 font-bold"><AlertTriangle size={10} /> Riservato</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Actions Buttons - Driven by Client-Side Policy Calculation */}
                                {actions.preview && (
                                    <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition" title="Anteprima">
                                        <Eye size={18} />
                                    </button>
                                )}
                                {actions.download && (
                                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-transparent hover:border-indigo-100 transition" title="Scarica">
                                        <Download size={18} />
                                    </button>
                                )}
                                {!actions.download && (
                                    <span className="text-xs text-slate-300 italic px-2">No Download</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
