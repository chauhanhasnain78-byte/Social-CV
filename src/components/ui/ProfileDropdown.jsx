import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, Briefcase, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SettingsModal from '@/components/ui/SettingsModal';

export default function ProfileDropdown({ user, logout, theme = 'light' }) {
  const [open, setOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#F0F0FF' : '#0D0D0F';
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280';
  const bgMain = isDark ? '#1a1a24' : '#fff';
  const bgHover = isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div 
        onClick={() => setOpen(!open)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', 
          padding: '4px 10px', borderRadius: 20, transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ fontSize: '0.85rem', color: mutedColor, fontWeight: 500 }}>
          Hi, <strong style={{ color: textColor }}>{user?.displayName?.split(' ')[0] || 'there'}</strong>
        </span>
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            referrerPolicy="no-referrer"
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${borderColor}` }} 
          />
        ) : (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#6C47FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 12,
          width: 240, background: bgMain, border: `1px solid ${borderColor}`,
          borderRadius: 14, boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.08)',
          overflow: 'hidden', zIndex: 100, animation: 'fadeInDown 0.2s ease forwards',
          transformOrigin: 'top right'
        }}>
          {/* Header */}
          <div style={{ padding: '16px', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: textColor, marginBottom: 4 }}>
              {user?.displayName || 'User'}
            </div>
            <div style={{ fontSize: '0.75rem', color: mutedColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || 'No email provided'}
            </div>
          </div>

          {/* Options */}
          <div style={{ padding: '8px' }}>
            {user?.role === 'HR' && (
              <>
                <div 
                  onClick={() => { setOpen(false); navigate('/hr-feed'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', color: textColor, transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = bgHover}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Briefcase size={16} color={mutedColor} />
                  Talent Feed
                </div>
                <div 
                  onClick={() => { setOpen(false); navigate('/hr-setup'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', color: textColor, transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = bgHover}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={16} color={mutedColor} />
                  Company Settings
                </div>
              </>
            )}

            <div 
              onClick={() => { setOpen(false); navigate('/dashboard'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', color: textColor, transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = bgHover}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <LayoutDashboard size={16} color={mutedColor} />
              Dashboard
            </div>
          </div>

          <div style={{ padding: '8px', borderTop: `1px solid ${borderColor}` }}>
            <div 
              onClick={() => { setOpen(false); logout(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', color: '#EF4444',
                transition: 'all 0.2s', fontWeight: 600
              }}
              onMouseOver={e => { e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut size={16} />
              Logout
            </div>
          </div>
        </div>
      )}
      
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
      
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: scale(0.95) translateY(-5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
} 
