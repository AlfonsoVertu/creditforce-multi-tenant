const admin = Meteor.users.findOne({ 'emails.0.address': 'admin@system.core' });
console.log('Admin User:', JSON.stringify(admin, null, 2));

const laura = Meteor.users.findOne({ 'emails.0.address': 'manager@tenant-alpha.com' });
console.log('Laura User:', JSON.stringify(laura, null, 2));
