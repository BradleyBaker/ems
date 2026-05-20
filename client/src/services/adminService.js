import api from './api';

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAllUsers = async (token) => {
  const { data } = await api.get('/admin/users', authConfig(token));
  return data;
};

export const deleteUser = async (userId, token) => {
  const { data } = await api.delete(`/admin/users/${userId}`, authConfig(token));
  return data;
};

export const getAllEvents = async (token) => {
  const { data } = await api.get('/admin/events', authConfig(token));
  return data;
};

export const deleteEvent = async (eventId, token) => {
  const { data } = await api.delete(`/admin/events/${eventId}`, authConfig(token));
  return data;
};