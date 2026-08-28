import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

export function LoginForm({ onSwitchTab, targetRole = null }) {
  // targetRole: 'HR' | 'SEEKER' | null — passed from AuthPage based on ?role= param
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(form);

      // ✨ Smart role switching: if user came from HR door but has Seeker account (or vice versa),
      //    silently update their role in Firestore so they get the right experience.
      let effectiveRole = loggedUser.role;
      let effectiveHrSetupDone = loggedUser.hrSetupDone;

      if (targetRole && targetRole !== loggedUser.role) {
        // Update role in Firestore
        await updateDoc(doc(db, 'users', loggedUser.uid), { role: targetRole });
        effectiveRole = targetRole;
        // If switching TO HR, hrSetupDone stays false (they need to set up)
        if (targetRole === 'HR') effectiveHrSetupDone = loggedUser.hrSetupDone || false;
        toast.success(
          targetRole === 'HR'
            ? 'Switched to HR mode! Let\'s find great talent. 🚀'
            : 'Switched to Job Seeker mode! Time to shine. ✨',
          { title: '🔄 Mode Switched' }
        );
      } else {
        toast.success('Welcome back!', { title: '👋 Logged in' });
      }

      // Route based on effective role
      if (effectiveRole === 'HR') {
        navigate(effectiveHrSetupDone ? '/hr-feed' : '/hr-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMap = {
        'auth/user-not-found':    'No account found with this email. Please sign up.',
        'auth/wrong-password':    'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      const msg = errorMap[err.code] || err.message || 'Login failed. Please try again.';
      toast.error(msg, { title: '❌ Login Failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">Email Address</label>
        <div className="relative animated-border">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input id="login-email" type="email" required className="glass-input pl-11" placeholder="you@example.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
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
        <button id="login-submit" type="submit" className="btn-primary" disabled={loading}>
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
