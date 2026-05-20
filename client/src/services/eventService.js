import api from './api';

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// Public APIs
export const getAllEvents = async () => {
  const { data } = await api.get('/events');
  return data;
};

export const getEventById = async (eventId) => {
  const { data } = await api.get(`/events/${eventId}`);
  return data;
};

// Organizer APIs
export const createEvent = async (eventData, token) => {
  const { data } = await api.post('/events/create', eventData, authConfig(token));
  return data;
};

export const getMyEvents = async (token) => {
  const { data } = await api.get('/events/my-events', authConfig(token));
  return data;
};

export const updateEvent = async (eventId, eventData, token) => {
  const { data } = await api.put(`/events/${eventId}`, eventData, authConfig(token));
  return data;
};

export const deleteEvent = async (eventId, token) => {
  const { data } = await api.delete(`/events/${eventId}`, authConfig(token));
  return data;
};