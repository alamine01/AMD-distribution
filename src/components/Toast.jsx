import { useState, useEffect } from 'react';
import './Toast.css';

let toastId = 0;
const listeners = [];

export const showToast = (message, type = 'success') => {
  const id = toastId++;
  listeners.forEach(listener => listener({ id, message, type }));
  return id;
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (toast) => {
      setToasts(prev => [...prev, toast]);
      
      // Supprimer automatiquement après 3 secondes
      const timeoutId = setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
      
      // Stocker le timeoutId dans l'objet toast pour pouvoir l'annuler
      toast.timeoutId = timeoutId;
    };

    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (toastId, timeoutId) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id, toast.timeoutId)}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
