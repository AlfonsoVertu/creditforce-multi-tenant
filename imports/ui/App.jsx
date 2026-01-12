import React, { useState, useEffect } from 'react';
import {
    DollarSign, Eye, Download, Filter, Hourglass, Briefcase, Layout,
    ShieldCheck, AlertCircle, Building2, StickyNote, FolderOpen,
    UserCog, Shield, Globe, FileCode, LogOut, Users
} from 'lucide-react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { TenantsCollection } from '/imports/api/core/tenant/TenantsCollection';
import { PERMISSIONS_REGISTRY } from '/imports/api/core/permissions/registry';
import { NotesCollection } from '/imports/api/notes/NotesCollection';
import { FilesCollection } from '/imports/api/files/FilesCollection';
import { ContactsCollection } from '/imports/api/contacts/ContactsCollection';
import { RolesCollection } from '/imports/api/roles/RolesCollection';

import { SystemSettingsCollection } from '/imports/api/core/settings/SystemSettingsCollection';

// Components
import { ImpersonationBanner } from './components/ImpersonationBanner';
import { Dashboard } from './pages/Dashboard';
import { NotesView } from './components/NotesView';
import { FilesView } from './components/FilesView';
import { ContactsView } from './components/ContactsView';
import { UserManagement } from './components/UserManagement';
import { TenantSettings } from './components/TenantSettings';
import { TemplatesView } from './components/TemplatesView';
import { TenantsList, GlobalSettings } from './components/GlobalAdmin';
import { PracticesDashboard } from './components/PracticesDashboard';
import { PracticeDetail } from './components/PracticeDetail';

const LoginScreen = ({ error, projectName = 'CreditForce' }) => {
    const [email, setEmail] = useState('admin@system.core');
    const [password, setPassword] = useState('password123');
    const [localError, setLocalError] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        Meteor.loginWithPassword(email, password, (err) => {
            if (err) setLocalError(err.reason);
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-center mb-6 text-indigo-600"><ShieldCheck size={48} /></div>
                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">{projectName} Login</h1>
                <p className="text-center text-slate-500 mb-6">Portale Gestione Immobiliare SaaS</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    {(error || localError) && <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center gap-2"><AlertCircle size={16} /> {error || localError}</div>}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg bg-slate-50" placeholder="admin@system.core" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-lg bg-slate-50" placeholder="password123" />
                    </div>
                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">Accedi</button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-4 text-center">Demo Profiles</p>
                    <div className="space-y-2">
                        <button onClick={() => { setEmail('admin@system.core'); setPassword('password123'); }} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center gap-3 text-xs">
                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><ShieldCheck size={14} /></div>
                            <div><div className="font-bold text-slate-700">System Admin</div><div className="text-slate-400">Global Admin</div></div>
                        </button>
                        <button onClick={() => { setEmail('manager@tenant-alpha.com'); setPassword('password123'); }} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center gap-3 text-xs">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Building2 size={14} /></div>
                            <div><div className="font-bold text-slate-700">Laura Alpha</div><div className="text-slate-400">Tenant Manager</div></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { useTimeTracker } from './hooks/useTimeTracker';

export const App = () => {
    const [view, setView] = useState('dashboard');
    const [selectedPracticeId, setSelectedPracticeId] = useState(null);

    const handlePracticeSelect = (id) => {
        setSelectedPracticeId(id);
        setView('practice_detail');
    };

    // Reactive Data from Meteor
    const { currentUser, isLoading, tenant, tenantsForAdmin, myTenants, notes, files, contacts, templates, users, projectName } = useTracker(() => {
        // Subscribe to public settings globally
        Meteor.subscribe('system.settings.public');
        const projectSetting = SystemSettingsCollection.findOne({ key: 'PROJECT_NAME' });
        const projectName = projectSetting?.value || 'CreditForce';

        const user = Meteor.user();
        if (!user) return { currentUser: null, isLoading: false, projectName };

        // Subscriptions
        Meteor.subscribe('users.current');
        Meteor.subscribe('notes.byTenant');
        Meteor.subscribe('files.byTenant');
        Meteor.subscribe('contacts.byTenant');
        Meteor.subscribe('roles.templates');
        Meteor.subscribe('tenants.myContexts'); // NEW: Get all my tenants

        let subTenants;
        if (user.profile?.tenantId) {
            Meteor.subscribe('tenants.current', user.profile.tenantId);
        }
        if (user.profile?.role === 'admin') {
            subTenants = Meteor.subscribe('tenants.all');
            Meteor.subscribe('users.all'); // Admin sees all users
        } else if (user.profile?.tenantId) {
            Meteor.subscribe('users.all'); // Tenant Admin sees tenant users (filtered on server)
        }

        // Contexts logic
        // We want all tenants the user has access to.
        // The publication 'tenants.myContexts' returns exactly that.
        // We filter out the current one for display purposes if needed, or show all with current highlighted.
        const myTenants = TenantsCollection.find({}, { sort: { name: 1 } }).fetch();

        return {
            currentUser: user,
            isLoading: false,
            tenant: TenantsCollection.findOne(user.profile?.tenantId),
            tenantsForAdmin: TenantsCollection.find().fetch(),
            myTenants, // Pass to component
            notes: NotesCollection.find({}).fetch(),
            files: FilesCollection.find({}).fetch(),
            contacts: ContactsCollection.find({}).fetch(),
            templates: RolesCollection.find({}).fetch(),
            users: Meteor.users.find({}).fetch(),
            projectName
        };
    }, []);

    const logout = () => Meteor.logout();

    const handleSwitchTenant = (tenantId) => {
        Meteor.call('users.switchTenant', { tenantId }, (err) => {
            if (err) alert(err.reason);
            // Meteor reactivity will handle the rest (user profile updates -> subscriptions re-run)
        });
    };

    // Track active time
    useTimeTracker(currentUser?._id);

    if (isLoading) return <div className="flex items-center justify-center h-screen bg-slate-50 font-bold text-slate-400">Loading {projectName}...</div>;
    if (!currentUser) return <LoginScreen projectName={projectName} />;

    // Permissions helper
    const hasPerm = (permId) => currentUser.permissions?.includes(permId) || currentUser.profile?.role === 'admin';
    const isAdmin = currentUser.profile?.role === 'admin';
    const isTenantAdmin = currentUser.profile?.role === 'tenant-admin' || isAdmin;

    // Check if user has multiple contexts
    const showContextSwitcher = myTenants && myTenants.length > 1;

    const handleManageTenant = (tenantId, targetView) => {
        Meteor.call('users.switchTenant', { tenantId }, (err) => {
            if (err) {
                alert(err.reason || err.message);
            } else {
                if (targetView) setView(targetView);
            }
        });
    };

    // Render Logic
    const renderContent = () => {
        switch (view) {
            case 'dashboard': return <Dashboard currentUser={currentUser} tenant={tenant} />;
            case 'contacts': return <ContactsView contacts={contacts} currentUser={currentUser} />;
            case 'notes': return <NotesView notes={notes} currentUser={currentUser} />;
            case 'files': return <FilesView files={files} templates={templates} tenants={tenantsForAdmin} currentUser={currentUser} />;
            case 'users': return <UserManagement currentUser={currentUser} />;
            case 'templates': return <TemplatesView currentUser={currentUser} />;
            case 'settings': return <TenantSettings tenant={tenant} currentUser={currentUser} />;
            case 'practices': return <PracticesDashboard currentUser={currentUser} onSelect={handlePracticeSelect} />;
            case 'practice_detail': return <PracticeDetail practiceId={selectedPracticeId} currentUser={currentUser} onBack={() => setView('practices')} />;
            case 'admin_tenants': return <TenantsList tenants={tenantsForAdmin} users={users} onViewTenant={handleManageTenant} />;
            case 'admin_env': return <GlobalSettings />;
            default: return <div>Not Found</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 transition-all">
                <div className="p-6 flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-900/50">{projectName.substring(0, 1)}</div>
                    <span className="font-bold text-lg tracking-tight">{projectName}</span>
                </div>

                {/* Context Switcher */}
                {showContextSwitcher && (
                    <div className="px-4 mb-2">
                        <div className="bg-slate-800 rounded-xl p-1 shadow-inner">
                            {myTenants.map(t => (
                                <button
                                    key={t._id}
                                    onClick={() => handleSwitchTenant(t._id)}
                                    className={`w-full text-left p-2 rounded-lg flex items-center gap-3 mb-1 transition-all ${t._id === currentUser.profile?.tenantId ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-700 text-slate-400'}`}
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                                        {t.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-bold truncate">{t.name}</div>
                                        <div className="text-[10px] opacity-70 truncate">ID: {t._id}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
                    <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'dashboard' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                        <Layout size={18} /> Dashboard
                    </button>

                    <div className="pt-4 pb-2 px-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Moduli</div>

                    <button onClick={() => setView('practices')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'practices' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                        <Briefcase size={18} /> Pratiche
                    </button>

                    {/* HIDDEN PROPERTIES MODULE PER MOCK REQUEST  */}

                    {hasPerm(PERMISSIONS_REGISTRY.PAGE_CONTACTS?.id) && (
                        <button onClick={() => setView('contacts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'contacts' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                            <Users size={18} /> Contatti
                        </button>
                    )}
                    {hasPerm(PERMISSIONS_REGISTRY.PAGE_NOTES?.id) && (
                        <button onClick={() => setView('notes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'notes' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                            <StickyNote size={18} /> Note Personali
                        </button>
                    )}
                    {hasPerm(PERMISSIONS_REGISTRY.PAGE_FILES?.id) && (
                        <button onClick={() => setView('files')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'files' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                            <FolderOpen size={18} /> Documenti
                        </button>
                    )}

                    {/* Admin Section */}
                    {isTenantAdmin && (
                        <>
                            <div className="pt-4 pb-2 px-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Amministrazione</div>
                            <button onClick={() => setView('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'users' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                                <UserCog size={18} /> Utenti & Ruoli
                            </button>
                            <button onClick={() => setView('templates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'templates' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                                <Shield size={18} /> Templates
                            </button>
                            <button onClick={() => setView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'settings' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                                <Building2 size={18} /> Organizzazione
                            </button>
                        </>
                    )}

                    {/* Super Admin Section */}
                    {isAdmin && (
                        <>
                            <div className="pt-4 pb-2 px-2 text-xs font-bold uppercase text-slate-500 tracking-wider">System</div>
                            <button onClick={() => setView('admin_tenants')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'admin_tenants' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                                <Globe size={18} /> Tenants
                            </button>
                            <button onClick={() => setView('admin_env')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${view === 'admin_env' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
                                <FileCode size={18} /> Env Variables
                            </button>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors font-bold">
                        <LogOut size={18} /> Disconnetti
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Impersonation Banner logic */}
                {localStorage.getItem('originalUserId') && currentUser._id !== localStorage.getItem('originalUserId') && (
                    <ImpersonationBanner
                        originalUserId={localStorage.getItem('originalUserId')}
                        currentName={currentUser.profile?.name || currentUser.emails[0].address}
                    />
                )}

                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>Bentornato,</span>
                        <span className="font-bold text-slate-900">{currentUser.profile?.name || currentUser.emails[0].address}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {tenant && <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide border border-indigo-100">{tenant.name}</span>}
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-500">
                            {currentUser.emails?.[0].address.substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
