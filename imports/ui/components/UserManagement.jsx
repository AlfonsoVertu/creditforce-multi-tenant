import React, { useState } from 'react';
import { UserPlus, Lock, UserCog, Trash2, X, AlertTriangle } from 'lucide-react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { PERMISSIONS_REGISTRY } from '/imports/api/core/permissions/registry';
import { PermissionTemplatesCollection } from '/imports/api/roles/PermissionTemplatesCollection';

const CreateUserModal = ({ tenantId, onClose }) => {
    const [formData, setFormData] = useState({ email: '', role: 'agent' });

    const handleSubmit = (e) => {
        e.preventDefault();
        Meteor.call('user.invite', {
            email: formData.email,
            role: formData.role,
            tenantId: tenantId
        }, (err) => {
            if (err) alert(err.message);
            else onClose();
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">Aggiungi Membro</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                        <input required type="email" className="w-full p-2 border border-slate-200 rounded-lg" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ruolo</label>
                        <select className="w-full p-2 border border-slate-200 rounded-lg" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                            <option value="agent">Agente (Agent)</option>
                            <option value="tenant-admin">Amministratore (Manager)</option>
                        </select>
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium">Annulla</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold">Invia Invito</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- PermissionsManagementModal ---
const PermissionsManagementModal = ({
    user, templates, currentUser, onClose
}) => {
    const [localPerms, setLocalPerms] = useState(user.permissions || []);
    const [selectedTemplateId, setSelectedTemplateId] = useState(user.profile?.assignedTemplateId || "");
    const [availableTemplates, setAvailableTemplates] = useState([]);

    // Filter templates on mount
    React.useEffect(() => {
        // Filter based on target role of the user we are editing
        const userRole = user.profile?.role || 'agent';
        const filtered = templates.filter(t => t.targetRoles.includes(userRole));
        setAvailableTemplates(filtered);
    }, [user, templates]);

    const handleToggle = (permId) => {
        if (localPerms.includes(permId)) {
            setLocalPerms(localPerms.filter(p => p !== permId));
        } else {
            setLocalPerms([...localPerms, permId]);
        }
    };

    const handleTemplateChange = (templateId) => {
        setSelectedTemplateId(templateId);
        if (!templateId) return; // Custom mode

        const template = templates.find(t => t._id === templateId);
        if (template) {
            let newPerms = template.permissions;
            // Tenant Admin cannot grant permissions they don't have themselves
            if (currentUser.profile?.role === 'tenant-admin') {
                newPerms = newPerms.filter(p => currentUser.permissions?.includes(p));
            }
            setLocalPerms(newPerms);
        }
    };

    const handleSave = () => {
        Meteor.call('users.updatePermissions', {
            targetUserId: user._id,
            permissions: localPerms,
            templateId: selectedTemplateId || null
        }, (err) => {
            if (err) alert(err.message);
            else onClose();
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Gestione Permessi</h3>
                        <p className="text-sm text-slate-500">{user.profile?.name} <span className="text-xs bg-slate-200 px-2 py-0.5 rounded ml-2 uppercase font-bold">{user.profile?.role}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
                </div>

                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Applica Template</label>
                    <div className="flex gap-2">
                        <select
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-white"
                            onChange={(e) => handleTemplateChange(e.target.value)}
                            value={selectedTemplateId}
                        >
                            <option value="">-- Personalizzato --</option>
                            {availableTemplates.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    {Object.values(PERMISSIONS_REGISTRY).filter(p => p.id.startsWith('page') || p.id.startsWith('tool')).map((perm) => { // Crude filter to show items
                        const hasPerm = localPerms.includes(perm.id);
                        // Hierarchy Check
                        const canGrant = currentUser.profile?.role === 'admin' || currentUser.permissions?.includes(perm.id);

                        return (
                            <div key={perm.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${!canGrant ? 'opacity-50 bg-slate-100 border-slate-100 cursor-not-allowed' : 'border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30'}`}>
                                <button
                                    disabled={!canGrant}
                                    onClick={() => handleToggle(perm.id)}
                                    className={`mt-0.5 w-10 h-6 rounded-full p-1 transition-colors flex items-center ${hasPerm ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'} ${!canGrant ? 'cursor-not-allowed' : ''}`}
                                >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                </button>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{perm.label || perm.id}</div>
                                    <div className="text-xs text-slate-500">{perm.description || 'Permesso sistema'}</div>
                                    {!canGrant && <div className="text-[10px] text-red-500 font-bold mt-1">Non possiedi questo permesso</div>}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-bold">Annulla</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 transition-all">Salva Modifiche</button>
                </div>
            </div>
        </div>
    )
}

export const UserManagement = ({ currentUser }) => {
    const [showUserModal, setShowUserModal] = useState(false);
    const [permModalUser, setPermModalUser] = useState(null);

    useTracker(() => {
        if (currentUser.profile && currentUser.profile.role === 'admin') {
            Meteor.subscribe('users.all');
            Meteor.subscribe('roles.templates');
        } else {
            Meteor.subscribe('users.byTenant', currentUser.profile.tenantId);
            Meteor.subscribe('roles.templates');
        }
    });

    const { users, templates } = useTracker(() => {
        const query = {};
        if (currentUser?.profile?.tenantId) {
            query['profile.tenantId'] = currentUser.profile.tenantId;
        }
        return {
            users: Meteor.users.find(query).fetch(),
            templates: PermissionTemplatesCollection.find().fetch()
        };
    });

    const handleDelete = (id) => {
        if (confirm('Disabilitare utente?')) {
            Meteor.call('user.disable', { targetUserId: id, tenantId: currentUser.profile.tenantId });
        }
    };

    const handleImpersonate = (id) => {
        // Token-based impersonation for robust session handling
        // 1. Store the CURRENT token (Admin) so we can switch back
        const currentToken = Meteor._localStorage.getItem('Meteor.loginToken');
        if (currentToken) {
            localStorage.setItem('originalLoginToken', currentToken);
            localStorage.setItem('originalUserId', Meteor.userId());
        }

        Meteor.call('admin.impersonate', id, (err, res) => {
            if (err) {
                alert(err.message);
                return;
            }
            if (res && res.token) {
                // 2. Login with the NEW token (Target User)
                Meteor.loginWithToken(res.token, (err) => {
                    if (err) {
                        alert('Login failed: ' + err.message);
                    } else {
                        // Success! Reload to refresh full context if needed, or let Meteor reactivity handle it
                        window.location.reload();
                    }
                });
            }
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Utenti & Permessi</h2>
                    <p className="text-slate-500">Gestisci l'accesso al sistema.</p>
                </div>
                <button onClick={() => setShowUserModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <UserPlus size={18} /> Nuovo Utente
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map(u => (
                    <div key={u._id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                {u.emails?.[0].address.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                    {u.profile?.name || 'Utente'}
                                    {u._id === currentUser._id && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase">YOU</span>}
                                </div>
                                <div className="text-xs text-slate-500">{u.profile?.role} &bull; {u.profile?.jobTitle || 'N/A'}</div>
                                <div className="text-xs text-slate-400 mt-1">{u.emails?.[0].address}</div>
                                <div className="mt-2 flex gap-3 text-xs text-slate-500 font-mono border-t border-slate-100 pt-2 bg-slate-50 rounded-b px-2 -mx-0.5 pb-1">
                                    <span title="Ultimo Accesso" className="flex items-center gap-1">🕒 <span className="font-semibold">{u.stats?.lastLogin ? new Date(u.stats.lastLogin).toLocaleDateString() : '-'}</span></span>
                                    <span title="Sessioni Totali" className="flex items-center gap-1">🚪 <span className="font-semibold">{u.stats?.totalSessions || 0}</span></span>
                                    <span title="Tempo Attivo" className="flex items-center gap-1">⚡ <span className="font-semibold">{u.stats?.activeSeconds ? Math.round(u.stats.activeSeconds / 60) + 'm' : '0m'}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setPermModalUser(u)} className="p-2 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600" title="Gestisci Permessi">
                                <Lock size={16} />
                            </button>
                            {u._id !== currentUser._id && (
                                <button onClick={() => handleImpersonate(u._id)} className="p-2 hover:bg-slate-100 rounded text-slate-500 hover:text-amber-600" title="Impersonifica">
                                    <UserCog size={16} />
                                </button>
                            )}
                            <button onClick={() => handleDelete(u._id)} className="p-2 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600" title="Elimina">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showUserModal && (
                <CreateUserModal
                    tenantId={currentUser.profile.tenantId}
                    onClose={() => setShowUserModal(false)}
                />
            )}

            {permModalUser && (
                <PermissionsManagementModal
                    user={permModalUser}
                    templates={templates}
                    currentUser={currentUser}
                    onClose={() => setPermModalUser(null)}
                />
            )}
        </div>
    );
};
