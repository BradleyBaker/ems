import api from './api';

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const registerForEvent = async (eventId, token) => {
  const { data } = await api.post(
    `/registrations/register/${eventId}`,
    {},
    authConfig(token)
  );
  return data;
};

export const getMyRegistrations = async (token) => {
  const { data } = await api.get(
    '/registrations/my-registrations',
    authConfig(token)
  );
  return data;
};

export const checkIfRegistered = async (eventId, token) => {
  try {
    const { data } = await api.get(
      '/registrations/my-registrations',
      authConfig(token)
    );
    const isRegistered = data.registrations.some(
      reg => reg.event._id === eventId
    );
    return { isRegistered };
  } catch (err) {
    return { isRegistered: false };
  }
};
