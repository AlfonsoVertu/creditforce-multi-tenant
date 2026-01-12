import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Layout, Users, FileText, ArrowLeft, Plus, ClipboardList } from 'lucide-react';
import { PracticesCollection } from '/imports/api/practices/PracticesCollection';
import { PracticeAssignments } from './PracticeAssignments';
import { PracticeDocuments } from './PracticeDocuments';
import { PracticeDocumentChecklist } from './PracticeDocumentChecklist';

const OverviewTab = ({ practice }) => (
    <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-2">Dati Debitore</h3>
            <p className="text-sm text-slate-500">Nome: <span className="font-medium text-slate-800">{practice.debtorName}</span></p>
            <p className="text-sm text-slate-500">Creditor Org: <span className="font-medium text-slate-800">{practice.creditorOrgId}</span></p>
        </div>
        {/* Statistics or Activity Log here */}
    </div>
);

export const PracticeDetail = ({ practiceId, currentUser, onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const { practice, isLoading } = useTracker(() => {
        const sub = Meteor.subscribe('practices.detail', practiceId);
        return {
            isLoading: !sub.ready(),
            practice: PracticesCollection.findOne(practiceId)
        };
    });

    if (isLoading) return <div>Caricamento dettaglio pratica...</div>;
    if (!practice) return <div>Pratica non trovata.</div>;

    const tabs = [
        { id: 'overview', label: 'Riepilogo', icon: Layout },
        { id: 'checklist', label: 'Checklist', icon: ClipboardList },
        { id: 'assignments', label: 'Team', icon: Users },
        { id: 'documents', label: 'Documenti', icon: FileText },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">{practice.code}</h1>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">{practice.status}</span>
                        </div>
                        <p className="text-slate-500">{practice.debtorName}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white px-6 border-b border-slate-200 flex gap-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && <OverviewTab practice={practice} />}
                {activeTab === 'checklist' && <PracticeDocumentChecklist practiceId={practice._id} practice={practice} />}
                {activeTab === 'assignments' && <PracticeAssignments practiceId={practice._id} />}
                {activeTab === 'documents' && <PracticeDocuments practiceId={practice._id} currentUser={currentUser} />}
            </div>
        </div>
    );
};
