import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTracker } from 'meteor/react-meteor-data';
import { ContactsCollection } from '/imports/api/contacts/ContactsCollection';
import { Meteor } from 'meteor/meteor';

export const ContactsView = ({ contacts, currentUser }) => {
    // Subscription handled by App.jsx

    const handleAddMock = () => {
        Meteor.call('contacts.create', {
            name: `Contatto ${Date.now().toString().slice(-4)}`,
            email: `user${Date.now().toString().slice(-4)}@example.com`,
            phone: '3331234567',
            type: 'buyer',
            tenantId: currentUser.profile.tenantId
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Contatti</h2>
                <button onClick={handleAddMock} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Plus size={18} /> Aggiungi Mock
                </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                        <tr>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4">Data Inserimento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {contacts.map(c => (
                            <tr key={c._id} className="hover:bg-slate-50">
                                <td className="p-4 font-bold text-slate-800">{c.name}</td>
                                <td className="p-4 text-slate-600">{c.email}</td>
                                <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold uppercase">{c.type}</span></td>
                                <td className="p-4 text-slate-400 text-xs font-mono">{new Date(c.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
