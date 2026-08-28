import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';

// Google Icon SVG (official colors)
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.1254-.8427 2.0786-1.7959 2.7164v2.2581h2.9087C16.6582 14.252 17.64 11.9454 17.64 9.2045z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5832-5.036-3.7096H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1027-1.17.2827-1.71V4.9582H.9574C.3477 6.1732 0 7.5482 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5813C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1636 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  );
}

// Divider with "or"
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em' }}>OR</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
    </div>
  );
}

export function LoginForm({ onSwitchTab, targetRole = null }) {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const routeAfterLogin = (loggedUser) => {
    if (loggedUser.role === 'HR') {
      navigate(loggedUser.hrSetupDone ? '/hr-feed' : '/hr-setup');
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const loggedUser = await loginWithGoogle({ role: targetRole || 'SEEKER' });
      toast.success('Welcome! Signed in with Google 🎉', { title: '✅ Success' });
      routeAfterLogin(loggedUser);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return; // user cancelled
      toast.error(err.message || 'Google sign-in failed.', { title: '❌ Google Login Failed' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login({ ...form, targetRole });
      if (targetRole && loggedUser.role === targetRole) {
        toast.success(
          targetRole === 'HR'
            ? "Switched to HR mode! Let's find great talent. 🚀"
            : 'Switched to Job Seeker mode! Time to shine. ✨',
          { title: '🔄 Mode Switched' }
        );
      } else {
        toast.success('Welcome back!', { title: '👋 Logged in' });
      }
      routeAfterLogin(loggedUser);
    } catch (err) {
      const errorMap = {
        'auth/user-not-found':     'No account found with this email. Please sign up.',
        'auth/wrong-password':     'Incorrect password. Please try again.',
        'auth/too-many-requests':  'Too many attempts. Please wait a moment.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      toast.error(errorMap[err.code] || err.message || 'Login failed.', { title: '❌ Login Failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '13px 20px', borderRadius: 14,
          background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
          cursor: googleLoading ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem', fontWeight: 700, color: '#1a1a2e', fontFamily: 'Inter',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.2s',
          opacity: googleLoading ? 0.7 : 1,
        }}
      >
        {googleLoading
          ? <span className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
          : <GoogleIcon />
        }
        {googleLoading ? 'Connecting…' : 'Continue with Google'}
      </button>

      <Divider />

      <div>
        <label className="label">Email Address</label>
        <div className="relative animated-border">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="login-email" type="email" required className="glass-input pl-11" placeholder="you@example.com"
            value={form.email} 
            onChange={(e) => {
              let val = e.target.value.replace(/\s/g, '').toLowerCase().replace(/[^a-z0-9@._-]/g, '');
              const match = val.match(/^(.*@[a-z-]+\.(com|in|org|net|co|edu|gov))(.*)$/);
              if (match) val = match[1];
              setForm({ ...form, email: val });
            }} 
          />
        </div>
      </div>
      <div>
        <label className="label">Password</label>
        <div className="relative animated-border">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="login-password" type={showPwd ? 'text' : 'password'} required className="glass-input pl-11 pr-12" placeholder="Your password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div className="pt-2">
        <button id="login-submit" type="submit" className="btn-primary" disabled={loading || googleLoading}>
          {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : null}
          {loading ? 'Logging in…' : 'Login to Social-CV'}
        </button>
      </div>
      <p className="text-center text-[0.9rem] text-gray-500 font-medium">
        No account?{' '}
        <button type="button" onClick={onSwitchTab} className="font-bold hover:underline" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C47FF' }}>Sign up free</button>
      </p>
    </form>
  );
}
