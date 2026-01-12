// Script to update user roles in profile
db.users.find({}).forEach(function (user) {
    var role = 'agent';
    if (!user.profile || !user.profile.tenantId) {
        role = 'admin';
    } else if (user.profile.jobTitle && (user.profile.jobTitle.includes('Manager') || user.profile.jobTitle.includes('Amministratore'))) {
        role = 'tenant-admin';
    }
    db.users.updateOne(
        { _id: user._id },
        { $set: { 'profile.role': role } }
    );
    print('Updated ' + (user.emails ? user.emails[0].address : user._id) + ' -> ' + role);
});
