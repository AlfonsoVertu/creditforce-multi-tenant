import React from 'react';
import { UserCog, LogOut } from 'lucide-react';
import { Meteor } from 'meteor/meteor';

export const ImpersonationBanner = ({ originalUserId, currentName }) => {
    const handleStop = () => {
        const originalToken = localStorage.getItem('originalLoginToken');

        if (originalToken) {
            Meteor.loginWithToken(originalToken, (err) => {
                if (err) {
                    console.error("Failed to restore identity", err);
                    Meteor.logout(); // Fallback
                }
                // Cleanup and reload
                localStorage.removeItem('originalUserId');
                localStorage.removeItem('originalLoginToken');
                window.location.reload();
            });
        } else {
            // Fallback if no token found
            Meteor.call('admin.stopImpersonate', (err) => {
                if (err) console.error(err);
                localStorage.removeItem('originalUserId');
                window.location.reload();
            });
        }
    };

    return (
        <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between shadow-md relative z-50">
            <div className="flex items-center gap-2 font-medium text-sm">
                <UserCog size={20} className="animate-pulse" />
                <span>MODALITÀ IMPERSONIFICAZIONE ATTIVA</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-xs">Agendo come: <strong>{currentName}</strong></span>
            </div>
            <button
                onClick={handleStop}
                className="bg-white text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-amber-50 transition-colors shadow-sm flex items-center gap-2"
            >
                <LogOut size={14} /> TORNA ADMIN
            </button>
        </div>
    );
};
