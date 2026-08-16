import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Copy, Check } from 'lucide-react';

const TOAST_CONFIGS = {
  success: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)' },
  error:   { icon: XCircle,     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  info:    { icon: Info,        color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)' },
};

let _addToast = null;

export const toast = {
  success: (msg, opts) => _addToast?.({ type: 'success', message: msg, ...opts }),
  error:   (msg, opts) => _addToast?.({ type: 'error',   message: msg, ...opts }),
  warning: (msg, opts) => _addToast?.({ type: 'warning', message: msg, ...opts }),
  info:    (msg, opts) => _addToast?.({ type: 'info',    message: msg, ...opts }),
};

function ToastItem({ id, type, message, title, copyText, onRemove }) {
  const [leaving, setLeaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const cfg = TOAST_CONFIGS[type] || TOAST_CONFIGS.info;
  const Icon = cfg.icon;

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  useEffect(() => {
    const t = setTimeout(dismiss, 6000);
    return () => clearTimeout(t);
  }, [dismiss]);

  const handleCopy = async () => {
    if (!copyText) return;
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={leaving ? 'animate-toast-out' : 'animate-toast-in'}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        maxWidth: 380,
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        position: 'relative',
      }}
    >
      <Icon size={18} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <p style={{ fontWeight: 700, fontSize: '0.85rem', color: cfg.color, marginBottom: 3 }}>{title}</p>}
        <p style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.5 }}>{message}</p>
        {copyText && (
          <button
            onClick={handleCopy}
            style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: cfg.color, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy password'}
          </button>
        )}
      </div>
      <button
        onClick={dismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', flexShrink: 0, lineHeight: 1 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, ...t }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  useEffect(() => { _addToast = addToast; return () => { _addToast = null; }; }, [addToast]);

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem {...t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
