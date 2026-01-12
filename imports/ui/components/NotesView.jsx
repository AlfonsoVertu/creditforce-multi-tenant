import React, { useState } from 'react';
import { Plus, Trash2, Download, Lock, StickyNote } from 'lucide-react';
import { useTracker } from 'meteor/react-meteor-data';
import { NotesCollection } from '/imports/api/notes/NotesCollection';
import { Meteor } from 'meteor/meteor';
import { PERMISSIONS_REGISTRY } from '/imports/api/core/permissions/registry';

export const NotesView = ({ notes, currentUser }) => {
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [showForm, setShowForm] = useState(false);

    // Permissions Check
    const canView = currentUser?.permissions?.includes(PERMISSIONS_REGISTRY.PAGE_NOTES?.id) || currentUser?.profile?.role === 'admin';
    const canCreate = currentUser?.permissions?.includes(PERMISSIONS_REGISTRY.TOOL_NOTES_CREATE?.id) || currentUser?.profile?.role === 'admin';
    const canDelete = currentUser?.permissions?.includes(PERMISSIONS_REGISTRY.TOOL_NOTES_DELETE?.id) || currentUser?.profile?.role === 'admin';
    const canExport = currentUser?.permissions?.includes(PERMISSIONS_REGISTRY.TOOL_NOTES_EXPORT?.id) || currentUser?.profile?.role === 'admin';

    const handleCreate = (e) => {
        e.preventDefault();
        Meteor.call('notes.create', {
            title: newNote.title,
            content: newNote.content,
            tenantId: currentUser.profile.tenantId
        }, (err) => {
            if (err) alert(err.message);
            else {
                setNewNote({ title: '', content: '' });
                setShowForm(false);
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Eliminare nota?')) {
            Meteor.call('notes.delete', id);
        }
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Title,Content,Date\n"
            + notes.map(n => `"${n.title}","${n.content}","${n.createdAt}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "notes_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!canView) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                    <Lock size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Accesso Limitato</h2>
                <p className="text-slate-500">Non hai i permessi per visualizzare le note.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Le Mie Note</h2>
                <div className="flex gap-2">
                    {canExport && (
                        <button onClick={handleExport} className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                            <Download size={18} /> Export
                        </button>
                    )}
                    {canCreate && (
                        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm">
                            <Plus size={18} /> Nuova Nota
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4">Crea Nuova Nota</h3>
                    <div className="space-y-4">
                        <input
                            placeholder="Titolo"
                            required
                            className="w-full p-2 border rounded"
                            value={newNote.title}
                            onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Contenuto..."
                            required
                            className="w-full p-2 border rounded h-24"
                            value={newNote.content}
                            onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Annulla</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">Salva Nota</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => (
                    <div key={note._id} className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow relative group">
                        <h3 className="font-bold text-lg text-slate-800 mb-2">{note.title}</h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                        <div className="text-xs text-slate-400 flex justify-between items-center">
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            {canDelete && (
                                <button onClick={() => handleDelete(note._id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {notes.length === 0 && (
                    <div className="col-span-3 text-center py-10 text-slate-400 italic">Nessuna nota presente.</div>
                )}
            </div>
        </div>
    );
};
