import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export function LoginForm({ onSwitchTab }) {
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
      toast.success('Welcome back!', { title: '👋 Logged in' });
      // Smart route based on role
      if (loggedUser.role === 'HR') {
        navigate(loggedUser.hrSetupDone ? '/hr-feed' : '/hr-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMap = {
        'auth/user-not-found':  'No account found with this email. Please sign up.',
        'auth/wrong-password':  'Incorrect password. Please try again.',
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
