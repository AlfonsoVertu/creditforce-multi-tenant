import React, { useState } from 'react';
import { Settings, Lock, CreditCard, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { TenantsCollection } from '/imports/api/core/tenant/TenantsCollection';
import { PermissionTemplatesCollection } from '/imports/api/roles/PermissionTemplatesCollection';
import { PERMISSIONS_REGISTRY } from '/imports/api/core/permissions/registry';

// --- TENANT SETTINGS (For Tenant Admin) ---
export const TenantSettings = ({ tenant, currentUser }) => {
    // If tenant isn't loaded yet
    if (!tenant) return <div>Loading...</div>;

    const [formData, setFormData] = useState({ name: tenant.name, plan: tenant.plan });

    // Subscribe to templates to show plan details
    const { templates, isLoadingTemplates } = useTracker(() => {
        const sub = Meteor.subscribe('roles.templates');
        return {
            templates: PermissionTemplatesCollection.find().fetch(),
            isLoadingTemplates: !sub.ready()
        };
    }, []);

    // Restriction: Only Super Admin can change plans. Tenant Admin sees read-only.
    // In our app, currentUser.profile.role determines this.
    const isSuperAdmin = currentUser.profile?.role === 'admin';
    const canEditPlan = isSuperAdmin;

    const handleSave = () => {
        // In a real app, this would call a method
        // Meteor.call('tenants.update', { tenantId: tenant._id, ...formData });
        alert('Salvataggio impostazioni simulato: ' + JSON.stringify(formData));
    };

    // Find the template corresponding to the current (or selected) plan
    // Assuming plan names map to template names or IDs roughly
    // The select values are 'basic', 'growth', 'enterprise'
    // The templates in seedData are 'Plan Basic', 'Plan Growth', 'Plan Enterprise'
    const currentPlanTemplate = templates.find(t =>
        t.name.toLowerCase().includes(formData.plan.toLowerCase()) &&
        t.targetRoles.includes('tenant-admin')
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                        <Settings size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Impostazioni Organizzazione</h2>
                        <p className="text-slate-500">Configura i dettagli del tuo ambiente di lavoro.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nome Organizzazione</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700">Piano Sottoscrizione</label>
                            {!canEditPlan && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1"><Lock size={10} /> Gestito da Admin</span>}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {['basic', 'growth', 'enterprise'].map(plan => (
                                <button
                                    key={plan}
                                    disabled={!canEditPlan}
                                    onClick={() => setFormData({ ...formData, plan: plan })}
                                    className={`p-3 border rounded-lg text-sm font-medium capitalize flex flex-col items-center gap-2 transition-all ${formData.plan === plan
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                                        : canEditPlan ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <CreditCard size={18} />
                                    {plan}
                                </button>
                            ))}
                        </div>
                        {!canEditPlan && <p className="text-xs text-slate-400 mt-2">Contatta il supporto per effettuare l'upgrade del piano.</p>}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                            <Save size={18} /> Salva Modifiche
                        </button>
                    </div>
                </div>
            </div>

            {/* PLAN DETAILS SIDE PANEL */}
            <div className="lg:col-span-1">
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 h-full">
                    <div className="flex items-center gap-2 mb-4 text-indigo-800">
                        <ShieldCheck size={20} />
                        <h3 className="font-bold text-lg">Dettagli Piano</h3>
                    </div>

                    {isLoadingTemplates ? (
                        <div className="text-center text-slate-400 py-4">Caricamento dettagli...</div>
                    ) : currentPlanTemplate ? (
                        <div className="space-y-4">
                            <div className="text-sm text-slate-600">
                                Il piano <strong className="capitalize text-slate-900">{formData.plan}</strong> include accesso alle seguenti funzionalità:
                            </div>

                            <div className="space-y-2">
                                {Object.values(PERMISSIONS_REGISTRY).map(perm => {
                                    const hasPerm = currentPlanTemplate.permissions.includes(perm.id);
                                    if (!hasPerm) return null;

                                    return (
                                        <div key={perm.id} className="flex items-start gap-2 text-sm p-2 bg-white rounded border border-slate-100 shadow-sm">
                                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <div>
                                                <div className="font-bold text-slate-800">{perm.label}</div>
                                                <div className="text-[10px] text-slate-400 leading-tight">{perm.description}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-400 italic">
                                Questi permessi definiscono le funzionalità massime che puoi assegnare ai tuoi agenti.
                            </div>
                        </div>
                    ) : (
                        <div className="text-amber-600 bg-amber-50 p-4 rounded text-sm border border-amber-100">
                            Nessun template trovato per il piano selezionato ({formData.plan}).
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
