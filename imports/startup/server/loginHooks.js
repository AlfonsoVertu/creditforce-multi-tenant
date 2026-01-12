import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

/**
 * Track login events for statistics.
 * This hook runs on successful login and updates user stats.
 */
Accounts.onLogin(async function ({ user }) {
    if (!user?._id) return;

    try {
        await Meteor.users.updateAsync(user._id, {
            $set: { 'stats.lastLogin': new Date() },
            $inc: { 'stats.totalSessions': 1 }
        });
        console.log(`[Stats] Login tracked for user ${user.emails?.[0]?.address || user._id}`);
    } catch (error) {
        console.error('[Stats] Error tracking login:', error);
    }
});
