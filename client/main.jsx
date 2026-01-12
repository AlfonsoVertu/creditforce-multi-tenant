import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '/imports/ui/App';
import './main.css';

Meteor.startup(() => {
    // Workaround Meteor 3.0: crea div se non esiste
    let container = document.getElementById('react-root');
    if (!container) {
        container = document.createElement('div');
        container.id = 'react-root';
        document.body.appendChild(container);
    }
    const root = createRoot(container);
    root.render(<App />);
});
