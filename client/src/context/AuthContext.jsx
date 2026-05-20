import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';
import { AUTH_STORAGE_KEY } from '../utils/constants';

const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    const savedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!savedAuth) {
      return { user: null, token: null };
    }

    const parsed = JSON.parse(savedAuth);

    if (parsed && typeof parsed === 'object' && 'user' in parsed) {
      return {
        user: parsed.user,
        token: parsed.token || null
      };
    }

    return {
      user: parsed,
      token: null
    };
  } catch {
    return { user: null, token: null };
  }
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => readStoredAuth());

  useEffect(() => {
    setAuthToken(authState.token);
  }, [authState.token]);

  const persistAuth = (nextAuth) => {
    setAuthState(nextAuth);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setAuthToken(nextAuth.token);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persistAuth({ user: data.user, token: data.token });
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    persistAuth({ user: data.user, token: data.token });
    return data;
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: Boolean(authState.user && authState.token),
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
