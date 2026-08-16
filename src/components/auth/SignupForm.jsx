import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { generateSecurePassword, getPasswordStrength } from '@/utils/passwordUtils';

export function SignupForm({ onSwitchTab }) {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(form.password);

  const handleAutoGenerate = () => {
    const pwd = generateSecurePassword(18);
    setForm({ ...form, password: pwd });
    setShowPwd(true);
    toast.success(`Password ready — save it now!`, {
      title: '🔐 Auto-Generated Password',
      copyText: pwd,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await signup(form);
      toast.success('Account created! Welcome to Social-CV 🎉', { title: '✅ Success' });
      navigate('/dashboard');
    } catch (err) {
      const errorMap = {
        'auth/email-already-in-use': 'This email is already registered. Try logging in.',
        'auth/weak-password':        'Password must be at least 6 characters.',
        'auth/invalid-email':        'Invalid email address format.',
      };
      const msg = errorMap[err.code] || err.message || 'Sign up failed. Please try again.';
      toast.error(msg, { title: '❌ Signup Failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <button id="signup-submit" type="submit" className="btn-primary" disabled={loading}>
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
