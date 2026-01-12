import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PracticesCollection } from '/imports/api/practices/PracticesCollection';
import { Plus, Briefcase, Search, AlertCircle, FileText, User } from 'lucide-react';

export const PracticesDashboard = ({ currentUser, onSelect }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newPractice, setNewPractice] = useState({ code: '', debtorName: '', creditorOrgId: '' });
    const [error, setError] = useState(null);

    const { practices, isLoading, assignments } = useTracker(() => {
        const sub = Meteor.subscribe('practices.list');
        const assignmentsSub = Meteor.subscribe('practices.assignments', 'MY_CONTEXT'); // Stub or implicit?

        return {
            isLoading: !sub.ready(),
            practices: PracticesCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
            assignments: [] // TODO: Fetch assignments count if needed
        };
    });

    const handleCreate = (e) => {
        e.preventDefault();
        setError(null);

        // Auto-set creditorOrgId to current User's Tenant if they are Mandante/Admin
        const payload = {
            ...newPractice,
            creditorOrgId: newPractice.creditorOrgId || currentUser.profile.tenantId
        };

        Meteor.call('practices.create', payload, (err) => {
            if (err) {
                setError(err.reason);
            } else {
                setIsCreating(false);
                setNewPractice({ code: '', debtorName: '', creditorOrgId: '' });
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Caricamento pratiche...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestione Pratiche</h2>
                    <p className="text-slate-500">Visualizza e gestisci i fascicoli assegnati</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} /> Nuova Pratica
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Briefcase size={20} className="text-indigo-600" /> Dati Nuova Pratica</h3>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm flex gap-2"><AlertCircle size={16} /> {error}</div>}
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Codice Pratica</label>
                            <input
                                type="text"
                                value={newPractice.code}
                                onChange={e => setNewPractice({ ...newPractice, code: e.target.value })}
                                className="w-full p-2 border rounded bg-slate-50 focus:bg-white transition"
                                placeholder="es. P-2024-001"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Debitore (NDG/Nome)</label>
                            <input
                                type="text"
                                value={newPractice.debtorName}
                                onChange={e => setNewPractice({ ...newPractice, debtorName: e.target.value })}
                                className="w-full p-2 border rounded bg-slate-50 focus:bg-white transition"
                                placeholder="Mario Rossi"
                                required
                            />
                        </div>
                        {/* If Admin/Servicer, maybe allow selecting Creditor Org? For now, imply Current Tenant */}

                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Annulla</button>
                            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">Crea Pratica</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practices.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-400 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                        <Briefcase size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Nessuna pratica trovata nel contesto corrente.</p>
                    </div>
                ) : practices.map(practice => (
                    <div key={practice._id} onClick={() => onSelect(practice._id)} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">{practice.code}</h3>
                                <p className="text-sm text-slate-500">{practice.debtorName}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${practice.status === 'NEW' ? 'bg-blue-50 text-blue-600' :
                                practice.status === 'ASSIGNED' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {practice.status}
                            </span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400 border-t pt-3 mt-2">
                            <div className="flex items-center gap-1"><User size={14} /> {practice.creditorOrgId === currentUser.profile.tenantId ? 'Proprietario' : 'Assegnato'}</div>
                            <div className="flex items-center gap-1"><FileText size={14} /> 0 Doc</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
