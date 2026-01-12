import React, { useState } from 'react';
import { Plus, Building2, MapPin, Tag } from 'lucide-react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PropertiesCollection } from '/imports/api/properties/PropertiesCollection';

export const PropertiesView = ({ currentUser }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', price: '', type: 'appartamento', city: '' });

    useTracker(() => {
        Meteor.subscribe('properties.byTenant', currentUser.profile.tenantId);
    });

    const properties = useTracker(() => {
        return PropertiesCollection.find({}, { sort: { createdAt: -1 } }).fetch();
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Meteor.call('properties.create', {
            title: formData.title,
            price: Number(formData.price),
            type: formData.type,
            tenantId: currentUser.profile.tenantId,
            address: {
                street: 'Via Roma 1', // Mock
                city: formData.city || 'Milano',
                country: 'Italia'
            },
            status: 'bozza'
        }, (err) => {
            if (err) alert(err.message);
            else {
                setFormData({ title: '', price: '', type: 'appartamento', city: '' });
                setShowForm(false);
            }
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Immobili</h2>
                <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Plus size={18} /> Nuovo Immobile
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 mb-8 animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="Titolo Annuncio" className="p-2 border rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required placeholder="Prezzo (€)" type="number" className="p-2 border rounded" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <select className="p-2 border rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                            <option value="appartamento">Appartamento</option>
                            <option value="villa">Villa</option>
                            <option value="ufficio">Ufficio</option>
                        </select>
                        <input required placeholder="Città" className="p-2 border rounded" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500">Annulla</button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Salva</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(p => (
                    <div key={p._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="h-40 bg-slate-200 flex items-center justify-center text-slate-400">
                            <Building2 size={48} />
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{p.title}</h3>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded uppercase font-bold">{p.status}</span>
                            </div>
                            <div className="text-xl font-bold text-indigo-600 mb-4">€ {p.price.toLocaleString()}</div>

                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2"><MapPin size={16} /> {p.address.city}</div>
                                <div className="flex items-center gap-2"><Tag size={16} /> {p.type}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
