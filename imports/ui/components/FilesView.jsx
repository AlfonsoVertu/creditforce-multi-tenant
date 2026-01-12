import React, { useState } from 'react';
import { FileText, Trash2, Upload, Hourglass, Filter } from 'lucide-react';
import { useTracker } from 'meteor/react-meteor-data';
import { FilesCollection } from '/imports/api/files/FilesCollection';
import { Meteor } from 'meteor/meteor';
import { PERMISSIONS_REGISTRY } from '/imports/api/core/permissions/registry';

export const FilesView = ({ files, currentUser, tenants }) => {
    const [filterTenantId, setFilterTenantId] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Filtering logic (client-side for now, based on passed props)
    const filteredFiles = filterTenantId
        ? files.filter(f => f.tenantId === filterTenantId)
        : files;

    const canUpload = true; // TODO: Check specific permissions
    const canDelete = true; // TODO: Check ownership or admin

    const handleSimulateUpload = () => {
        if (!canUpload) return;
        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            const types = ['PDF', 'JPG', 'PNG', 'DOCX'];
            const randType = types[Math.floor(Math.random() * types.length)];

            Meteor.call('files.upload', {
                name: `Documento_Caricato_${Date.now()}.${randType.toLowerCase()}`,
                size: `${(Math.random() * 5).toFixed(1)} MB`,
                type: randType,
                tenantId: currentUser.profile.tenantId || 'global'
            }, (err) => {
                setIsUploading(false);
                if (err) alert(err.message);
            });
        }, 1000);
    };

    const handleDelete = (id) => {
        if (confirm('Eliminare questo file?')) {
            Meteor.call('files.delete', id);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Archivio Documentale</h2>
                    <p className="text-slate-500">Gestione file centralizzata con permessi granulari.</p>
                </div>
                {canUpload && (
                    <button
                        onClick={handleSimulateUpload}
                        disabled={isUploading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
                    >
                        {isUploading ? <Hourglass className="animate-spin" size={18} /> : <Upload size={18} />}
                        {isUploading ? 'Caricamento...' : 'Upload File'}
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                        <tr>
                            <th className="p-4 w-8"></th>
                            <th className="p-4">Nome File</th>
                            <th className="p-4">Caricato Da</th>
                            <th className="p-4">Tenant</th>
                            <th className="p-4">Data</th>
                            <th className="p-4 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredFiles.map(file => (
                            <tr key={file._id} className="hover:bg-slate-50 group transition-colors">
                                <td className="p-4 text-indigo-500"><FileText size={20} /></td>
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{file.name}</div>
                                    <div className="text-xs text-slate-400">{file.size} &bull; {file.type}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-slate-900">{file.uploaderId}</div>
                                    {/* TODO: Resolve uploader name via Meteor.users or denormalization */}
                                </td>
                                <td className="p-4">
                                    <span className="text-xs text-slate-400 font-mono">{file.tenantId}</span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">{new Date(file.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(file._id)}
                                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Elimina File"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredFiles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                                    Nessun documento trovato.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
