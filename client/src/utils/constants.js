export const APP_NAME = 'Event Management System';
export const AUTH_STORAGE_KEY = 'ems_auth_state';

export const NAV_LINKS = [
  { to: '/', label: 'Home' }
];

export const AUTH_NAV_LINKS = [
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' }
];

export const ORGANIZER_NAV_LINKS = [
  { to: '/organizer', label: 'Dashboard' },
  { to: '/organizer/events/new', label: 'Create Event' },
  { to: '/organizer/events', label: 'My Events' }
];

export const AUTH_ROLE_OPTIONS = [
  { value: 'organizer', label: 'Organizer' },
  { value: 'participant', label: 'Participant' }
];

export const DASHBOARD_LINKS = {
  organizer: { to: '/organizer', label: 'Organizer Dashboard' },
  admin: { to: '/admin', label: 'Admin Dashboard' }
};
