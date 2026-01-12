/**
 * Client-side constants (types and initial UI data)
 * Derived from the demo code provided
 */

export { PERMISSIONS_REGISTRY, ALL_PERMISSIONS } from '../api/core/permissions/registry';

// Export types (already defined in types.ts but replicated for JSX compatibility)
export const ROLE_DISPLAY_NAMES = {
    'admin': 'Super Admin',
    'tenant-admin': 'Tenant Manager',
    'agent': 'Agent',
    'viewer': 'Viewer'
};

export const PLAN_DISPLAY_NAMES = {
    'basic': 'Basic',
    'growth': 'Growth',
    'enterprise': 'Enterprise'
};
