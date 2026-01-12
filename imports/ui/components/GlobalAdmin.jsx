import React, { useState } from 'react';
import { FileCode, Database, Plus, Trash2, Globe, Building2, Eye, Save, Users, BarChart2 } from 'lucide-react';
import { useTracker } from 'meteor/react-meteor-data';
import { SystemSettingsCollection } from '/imports/api/core/settings/SystemSettingsCollection';
import { Meteor } from 'meteor/meteor';
import { TenantsCollection } from '/imports/api/core/tenant/TenantsCollection';

// --- GLOBAL SETTINGS (ENV EDITOR) ---
export const GlobalSettings = () => {
    // Smart Component Logic
    const { envVars, isLoading } = useTracker(() => {
        const sub = Meteor.subscribe('system.settings');
        return {
            envVars: SystemSettingsCollection.find().fetch(),
            isLoading: !sub.ready()
        };
    }, []);

    const handleUpdate = (id, key, value) => {
        Meteor.call('settings.update', { id, key, value });
    };

    const handleCreate = () => {
        Meteor.call('settings.update', { key: 'NEW_KEY_' + Date.now(), value: 'value' });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this variable?')) Meteor.call('settings.delete', { id });
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-600 border border-slate-200">
                    <FileCode size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Configurazione Variabili d'Ambiente</h2>
                    <p className="text-slate-500">Gestione bidirezionale del file <code>.env</code> di progetto.</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-mono">
                        <Database size={16} />
                        <span>PROJECT_ENV_CONFIG</span>
                    </div>
                    <button onClick={handleCreate} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
                        <Plus size={14} /> Nuova Variabile
                    </button>
                </div>
                <div className="p-6 space-y-3">
                    {envVars.map((env) => (
                        <div key={env._id} className="flex items-center gap-3 group">
                            <div className="text-slate-500 font-mono text-xs w-6 text-right select-none">VAR</div>
                            <input
                                type="text"
                                defaultValue={env.key} // Use defaultValue for free editing, blur to save
                                onBlur={(e) => handleUpdate(env._id, e.target.value, env.value)}
                                className="bg-slate-950 text-indigo-400 font-mono text-sm px-3 py-2 rounded border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-1/3 transition-all"
                                placeholder="KEY"
                            />
                            <span className="text-slate-600">=</span>
                            <input
                                type="text"
                                defaultValue={env.value}
                                onBlur={(e) => handleUpdate(env._id, env.key, e.target.value)}
                                className="bg-slate-950 text-emerald-400 font-mono text-sm px-3 py-2 rounded border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none flex-1 transition-all"
                                placeholder="VALUE"
                            />
                            <button onClick={() => handleDelete(env._id)} className="text-slate-600 hover:text-red-500 p-2 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {envVars.length === 0 && <div className="text-slate-600 text-center py-8 font-mono text-sm">// Nessuna variabile configurata.</div>}
                </div>
                <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Sync Live: Active
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- TENANTS LIST (For Super Admin) ---
export const TenantsList = ({ tenants, users, onViewTenant }) => {
    const [editingTenant, setEditingTenant] = useState(null);
    const [licenseForm, setLicenseForm] = useState({ status: '', validUntil: '', maxUsers: '' });
    const [saving, setSaving] = useState(false);

    const openLicenseEditor = (tenant) => {
        setEditingTenant(tenant);
        setLicenseForm({
            status: tenant.license?.status || 'trial',
            validUntil: tenant.license?.validUntil ? new Date(tenant.license.validUntil).toISOString().split('T')[0] : '',
            maxUsers: tenant.license?.maxUsers || 5
        });
    };

    const closeLicenseEditor = () => {
        setEditingTenant(null);
        setLicenseForm({ status: '', validUntil: '', maxUsers: '' });
    };

    const saveLicense = () => {
        if (!editingTenant) return;
        setSaving(true);

        Meteor.call('license.update', {
            tenantId: editingTenant._id,
            status: licenseForm.status,
            validUntil: licenseForm.validUntil ? new Date(licenseForm.validUntil) : null,
            maxUsers: parseInt(licenseForm.maxUsers) || 5
        }, (err, res) => {
            setSaving(false);
            if (err) {
                alert('Errore: ' + err.reason);
            } else {
                closeLicenseEditor();
            }
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* License Editor Modal */}
            {editingTenant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Modifica Licenza: {editingTenant.name}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Stato Licenza</label>
                                <select
                                    value={licenseForm.status}
                                    onChange={(e) => setLicenseForm({ ...licenseForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="active">Attiva</option>
                                    <option value="trial">Trial</option>
                                    <option value="suspended">Sospesa</option>
                                    <option value="expired">Scaduta</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Data Scadenza</label>
                                <input
                                    type="date"
                                    value={licenseForm.validUntil}
                                    onChange={(e) => setLicenseForm({ ...licenseForm, validUntil: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Utenti</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={licenseForm.maxUsers}
                                    onChange={(e) => setLicenseForm({ ...licenseForm, maxUsers: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeLicenseEditor}
                                className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={saveLicense}
                                disabled={saving}
                                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? 'Salvando...' : <><Save size={16} /> Salva</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Lista Tenant</h2>
                    <p className="text-slate-500">Monitoraggio globale delle organizzazioni registrate.</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Nuovo Tenant
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenants.map(tenant => {
                    // Stats aggregation
                    const tenantUsers = users ? users.filter(u => u.profile?.tenantId === tenant._id) : [];
                    const count = tenantUsers.length;
                    const isActive = tenant.license?.status === 'active';
                    const validUntil = tenant.license?.validUntil ? new Date(tenant.license.validUntil).toLocaleDateString('it-IT') : 'Non impostata';

                    return (
                        <div key={tenant._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <button
                                    onClick={() => openLicenseEditor(tenant)}
                                    className={`px-2 py-1 text-xs font-bold uppercase rounded cursor-pointer hover:opacity-80 ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
                                    title="Clicca per modificare licenza"
                                >
                                    {tenant.license?.status || 'unknown'}
                                </button>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 mb-1">{tenant.name}</h3>
                            <p className="text-xs text-slate-500 mb-2 font-mono">ID: {tenant._id}</p>

                            {/* License Expiration */}
                            <p className="text-xs text-slate-600 mb-4">
                                <span className="font-medium">Scadenza:</span> {validUntil}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div>
                                    <div className="text-slate-500 text-xs">Utenti</div>
                                    <div className="font-bold text-slate-800">{count} / {tenant.license?.maxUsers || 5}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs">Piano</div>
                                    <div className="font-bold text-slate-800 capitalize">{tenant.plan}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 text-xs border-t border-slate-100 pt-4 bg-slate-50 p-3 rounded-lg mx-1">
                                <div>
                                    <div className="text-slate-500 uppercase font-bold text-[10px] tracking-wider mb-1">Tempo Attivo</div>
                                    <div className="font-mono text-lg font-bold text-indigo-600">
                                        {Math.round(tenantUsers.reduce((acc, u) => acc + (u.stats?.activeSeconds || 0), 0) / 60)}m
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 uppercase font-bold text-[10px] tracking-wider mb-1">Sessioni Tot.</div>
                                    <div className="font-mono text-lg font-bold text-indigo-600">
                                        {tenantUsers.reduce((acc, u) => acc + (u.stats?.totalSessions || 0), 0)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onViewTenant(tenant._id, 'dashboard')}
                                    className="flex-1 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <BarChart2 size={16} /> Stats
                                </button>
                                <button
                                    onClick={() => onViewTenant(tenant._id, 'users')}
                                    className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Users size={16} /> Utenti
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
