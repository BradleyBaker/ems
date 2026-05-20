import React, { createContext, useContext, useState, useCallback } from 'react';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback(({ message, type = 'info', timeout = 4000 }) => {
    const id = Date.now() + Math.random();
    const entry = { id, message, type };
    setToasts((t) => [entry, ...t]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
  }, []);

  const value = {
    showToast,
    setLoading,
    loading
  };

  return (
    <UiContext.Provider value={value}>
      {children}

      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <div className="toast__message">{t.message}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading-overlay" role="status" aria-label="Loading">
          <div className="spinner" />
        </div>
      )}
    </UiContext.Provider>
  );
}

export const useUI = () => {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUI must be used within UiProvider');
  return ctx;
};

export default UiContext;
