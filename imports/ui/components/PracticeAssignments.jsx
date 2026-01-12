import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PracticeAssignmentsCollection } from '/imports/api/practices/PracticesCollection';
import { Plus, Trash2, User, Shield } from 'lucide-react';

export const PracticeAssignments = ({ practiceId }) => {
    const [isAssigning, setIsAssigning] = useState(false);
    const [email, setEmail] = useState('');
    const [scope, setScope] = useState('FULL');
    const [roleOverride, setRoleOverride] = useState('');
    const [feedback, setFeedback] = useState(null);

    const { assignments, users, isLoading } = useTracker(() => {
        Meteor.subscribe('practices.assignments', practiceId);
        // We need users to show names. In a real app, we'd publish only relevant users.
        // Assuming 'users.all' or similar is accessible to Servicer.
        const allUsers = Meteor.users.find().fetch();
        return {
            isLoading: false,
            assignments: PracticeAssignmentsCollection.find({ practiceId }).fetch(),
            users: allUsers
        };
    });

    const handleAssign = (e) => {
        e.preventDefault();

        // Find user by email (mock logic, in real world we need userId)
        const targetUser = users.find(u => u.emails[0].address === email);
        if (!targetUser) {
            setFeedback({ type: 'error', msg: 'Utente non trovato nel sistema' });
            return;
        }

        Meteor.call('practices.assign', {
            practiceId,
            targetUserId: targetUser._id,
            scope,
            roleOverride
        }, (err) => {
            if (err) {
                setFeedback({ type: 'error', msg: err.reason });
            } else {
                setFeedback({ type: 'success', msg: 'Assegnazione completata' });
                setIsAssigning(false);
                setEmail('');
            }
        });
    };

    const getUserLabel = (userId) => {
        const u = users.find(x => x._id === userId);
        return u ? (u.profile?.name || u.emails[0].address) : userId;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Team di Lavoro</h3>
                <button
                    onClick={() => setIsAssigning(true)}
                    className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-bold"
                >
                    <Plus size={16} /> Aggiungi Membro
                </button>
            </div>

            {feedback && (
                <div className={`p-3 rounded text-sm ${feedback.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {feedback.msg}
                </div>
            )}

            {isAssigning && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <form onSubmit={handleAssign} className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Utente</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Scope</label>
                                <select value={scope} onChange={e => setScope(e.target.value)} className="w-full p-2 border rounded">
                                    <option value="FULL">Full Access</option>
                                    <option value="READONLY">Read Only</option>
                                    <option value="LIMITED">Limited</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Ruolo Operativo</label>
                                <input type="text" value={roleOverride} onChange={e => setRoleOverride(e.target.value)} className="w-full p-2 border rounded" placeholder="es. Legal Specialist" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 text-sm">
                            <button type="button" onClick={() => setIsAssigning(false)} className="px-3 py-1 text-slate-500">Annulla</button>
                            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded font-bold">Confirma</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-2">
                {assignments.length === 0 ? <p className="text-slate-400 text-sm">Nessun utente assegnato esplicitamente.</p> : null}

                {assignments.map(a => (
                    <div key={a._id} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <User size={16} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-sm">{getUserLabel(a.userId)}</div>
                                <div className="text-xs text-slate-400 flex gap-2">
                                    <span>Scope: {a.scope}</span>
                                    {a.roleOverride && <span>• {a.roleOverride}</span>}
                                </div>
                            </div>
                        </div>
                        {/* Remove button could go here */}
                    </div>
                ))}
            </div>
        </div>
    );
};
