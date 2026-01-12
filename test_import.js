try {
    require('react');
    console.log('✅ React found');
    require('react-meteor-data');
    console.log('✅ React-Meteor-Data found');
    require('simpl-schema');
    console.log('✅ Simpl-Schema found');
} catch (e) {
    console.error('❌ Error importing:', e.message);
}
