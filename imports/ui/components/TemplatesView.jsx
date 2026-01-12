import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PermissionTemplatesCollection } from '/imports/api/roles/PermissionTemplatesCollection';
import { PERMISSIONS_REGISTRY } from '/imports/api/core/permissions/registry';
import { Shield, Plus, X, AlertTriangle, Trash2 } from 'lucide-react';

const CreateTemplateModal = ({ onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPerms, setSelectedPerms] = useState([]);
    const [targetRoles, setTargetRoles] = useState(['agent']);

    const togglePerm = (id) => {
        if (selectedPerms.includes(id)) setSelectedPerms(selectedPerms.filter(p => p !== id));
        else setSelectedPerms([...selectedPerms, id]);
    };

    const toggleRole = (role) => {
        if (targetRoles.includes(role)) setTargetRoles(targetRoles.filter(r => r !== role));
        else setTargetRoles([...targetRoles, role]);
    };

    const handleSave = () => {
        if (!name || targetRoles.length === 0) return;
        Meteor.call('roles.createTemplate', { name, description, permissions: selectedPerms, targetRoles }, (err) => {
            if (err) alert(err.message);
            else onClose();
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">Crea Template Permessi</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <input placeholder="Nome Template" className="w-full p-2 border rounded font-bold" value={name} onChange={e => setName(e.target.value)} />
                    <input placeholder="Descrizione" className="w-full p-2 border rounded" value={description} onChange={e => setDescription(e.target.value)} />

                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Applicabile a</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={targetRoles.includes('agent')} onChange={() => toggleRole('agent')} />
                                <span className="text-sm">Agenti</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={targetRoles.includes('tenant-admin')} onChange={() => toggleRole('tenant-admin')} />
                                <span className="text-sm">Manager/Tenant</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Permessi Inclusi</label>
                        <div className="space-y-2">
                            {Object.values(PERMISSIONS_REGISTRY).map(perm => (
                                <label key={perm.id} className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" checked={selectedPerms.includes(perm.id)} onChange={() => togglePerm(perm.id)} />
                                    <span className="text-sm font-medium">{perm.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Annulla</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">Salva Template</button>
                </div>
            </div>
        </div>
    );
};

export const TemplatesView = ({ currentUser }) => {
    const [showModal, setShowModal] = useState(false);
    const templates = useTracker(() => PermissionTemplatesCollection.find().fetch());

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Templates Permessi</h2>
                    <p className="text-slate-500">Gestisci profili di accesso predefiniti per i ruoli.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Plus size={18} /> Nuovo Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(t => (
                    <div key={t._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Shield size={24} />
                            </div>
                            {t.tenantId ? (
                                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded uppercase">Tenant</span>
                            ) : (
                                <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-bold rounded uppercase">Global</span>
                            )}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{t.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{t.description || 'Nessuna descrizione'}</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">Target Roles</span>
                                <span className="font-mono text-slate-700">{t.targetRoles.join(', ')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">Permessi</span>
                                <span className="font-bold text-indigo-600">{t.permissions.length} attivi</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors">Modifica</button>
                            <button className="p-2 border border-slate-200 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && <CreateTemplateModal onClose={() => setShowModal(false)} />}
        </div>
    );
};
