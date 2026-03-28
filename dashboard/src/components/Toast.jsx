import React, { useState, useCallback, useContext, createContext, useEffect, useRef } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

const VARIANT_STYLES = {
  success: {
    background: 'var(--color-success, #22c55e)',
    color: '#fff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.2)" />
        <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  error: {
    background: 'var(--color-danger, #ef4444)',
    color: '#fff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.2)" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  info: {
    background: 'var(--color-accent, #6366f1)',
    color: '#fff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.2)" />
        <path d="M8 5v1M8 8v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Slide in
    requestAnimationFrame(() => setVisible(true));

    // Auto dismiss
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 3000);

    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onRemove]);

  const variant = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;

  return (
    <div
      style={{
        background: variant.background,
        color: variant.color,
        padding: '10px 16px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        transform: visible && !exiting ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible && !exiting ? 1 : 0,
        transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease',
        pointerEvents: 'auto',
        maxWidth: '360px',
        cursor: 'pointer',
      }}
      onClick={() => {
        setExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
      }}
    >
      {variant.icon}
      <span>{toast.message}</span>
    </div>
  );
}

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = 'info', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, variant, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Wrap the object methods so they reference the latest addToast
  const toastApi = useRef(null);
  if (!toastApi.current) {
    toastApi.current = {
      success: (msg, duration) => addToast(msg, 'success', duration),
      error: (msg, duration) => addToast(msg, 'error', duration),
      info: (msg, duration) => addToast(msg, 'info', duration),
    };
  }
  // Keep methods up to date
  toastApi.current.success = (msg, duration) => addToast(msg, 'success', duration);
  toastApi.current.error = (msg, duration) => addToast(msg, 'error', duration);
  toastApi.current.info = (msg, duration) => addToast(msg, 'info', duration);

  return (
    <ToastContext.Provider value={toastApi.current}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
