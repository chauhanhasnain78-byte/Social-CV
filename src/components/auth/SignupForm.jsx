import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { generateSecurePassword, getPasswordStrength } from '@/utils/passwordUtils';

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

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em' }}>OR</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
    </div>
  );
}

export function SignupForm({ onSwitchTab, role = 'SEEKER' }) {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const strength = getPasswordStrength(form.password);

  const handleAutoGenerate = () => {
    const pwd = generateSecurePassword(18);
    setForm({ ...form, password: pwd });
    setShowPwd(true);
    toast.success(`Password ready — save it now!`, { title: '🔐 Auto-Generated Password', copyText: pwd });
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const newUser = await loginWithGoogle({ role });
      toast.success('Account ready! Welcome to Social-CV 🎉', { title: '✅ Signed in with Google' });
      if (newUser.role === 'HR') {
        navigate(newUser.hrSetupDone ? '/hr-feed' : '/hr-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return;
      toast.error(err.message || 'Google sign-in failed.', { title: '❌ Google Signup Failed' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const newUser = await signup({ ...form, role });
      toast.success('Account created! Welcome to Social-CV 🎉', { title: '✅ Success' });
      if (newUser.role === 'HR') {
        navigate('/hr-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.success(
          role === 'HR'
            ? 'You already have an account! Login to access the HR portal.'
            : 'You already have an account! Login to continue.',
          { title: '👋 Welcome back!' }
        );
        onSwitchTab();
        return;
      }
      const errorMap = {
        'auth/weak-password':  'Password must be at least 6 characters.',
        'auth/invalid-email':  'Invalid email address format.',
      };
      toast.error(errorMap[err.code] || err.message || 'Sign up failed.', { title: '❌ Signup Failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
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
        <label className="label">Full Name</label>
        <div className="relative animated-border">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="signup-name" type="text" required className="glass-input pl-11" placeholder="Hasnain Chauhan"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Email Address</label>
        <div className="relative animated-border">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="signup-email" type="email" required className="glass-input pl-11" placeholder="you@example.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Password</label>
          <button type="button" onClick={handleAutoGenerate}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.2)', color: '#6C47FF' }}>
            <Sparkles size={12} /> Auto-Generate
          </button>
        </div>
        <div className="relative animated-border">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="signup-password" type={showPwd ? 'text' : 'password'} required className="glass-input pl-11 pr-12" placeholder="Min. 8 characters"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.password && (
          <div className="mt-3 space-y-1.5">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300" style={{ background: strength.score >= i ? strength.color : '#E5E7EB' }} />
              ))}
            </div>
            <p className="text-xs font-semibold" style={{ color: strength.color || '#6B7280' }}>{strength.label}</p>
          </div>
        )}
      </div>
      <div className="pt-2">
        <button id="signup-submit" type="submit" className="btn-primary" disabled={loading || googleLoading}>
          {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : null}
          {loading ? 'Creating account…' : 'Create Free Account'}
        </button>
      </div>
      <p className="text-center text-[0.9rem] text-gray-500 font-medium">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchTab} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C47FF' }} className="font-bold hover:underline">Login</button>
      </p>
    </form>
  );
}
