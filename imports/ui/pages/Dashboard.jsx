import React from 'react';

const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

export const Dashboard = ({ currentUser, tenant }) => {
    // Stats (mocked or from currentUser)
    const stats = currentUser.stats || {};
    const lastLogin = stats.lastLogin || new Date();
    const activeSeconds = stats.activeSeconds || 0;
    const sessions = stats.totalSessions || 0;
    const toolsUsed = stats.toolsUsed || {};

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Ultimo Login</div>
                    <div className="text-xl font-bold text-slate-800">{new Date(lastLogin).toLocaleDateString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Tempo Attivo</div>
                    <div className="text-xl font-bold text-indigo-600">{formatDuration(activeSeconds)}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Sessioni Totali</div>
                    <div className="text-xl font-bold text-slate-800">{sessions}</div>
                </div>
                {tenant && (
                    <div className="bg-slate-900 p-6 rounded-xl text-white shadow-lg">
                        <div className="text-slate-400 text-sm font-medium mb-1">Licenza {tenant.name}</div>
                        <div className="text-lg font-bold capitalize mb-1">{tenant.plan} Plan</div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex justify-between">
                            <span>Storage</span>
                            <span>1.2 / 5 GB</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Activity / Tools Usage */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-lg mb-4">Utilizzo Strumenti</h3>
                <div className="space-y-4">
                    {Object.entries(toolsUsed).map(([toolId, count]) => (
                        <div key={toolId} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">{toolId}</span>
                            <span className="font-bold text-slate-900">{count} azioni</span>
                        </div>
                    ))}
                    {Object.keys(toolsUsed).length === 0 && <span className="text-slate-400 italic text-sm">Nessuna attività registrata.</span>}
                </div>
            </div>
        </div>
    );
};
