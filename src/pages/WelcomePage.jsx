import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage({ onSelectSeeker, onSelectHR }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSeekerClick = async () => {
    sessionStorage.setItem('pendingRole', 'SEEKER');
    if (user) {
      if (user.role === 'HR') {
        await logout();
        navigate('/auth?role=seeker');
      } else {
        navigate('/dashboard');
      }
    } else {
      onSelectSeeker(); // Go to LandingPage
    }
  };

  const handleHRClick = async () => {
    sessionStorage.setItem('pendingRole', 'HR');
    if (user) {
      if (user.role === 'SEEKER') {
        await logout();
        navigate('/auth?role=hr');
      } else {
        navigate(user.hrSetupDone ? '/hr-feed' : '/hr-setup');
      }
    } else {
      onSelectHR(); // Go to AuthPage as HR
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: '#FDFCFF',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}
      >
        <img
          src="/logo.png"
          alt="Social-CV"
          style={{ height: 64, width: 'auto', objectFit: 'contain' }}
        />
        <span className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.02em' }}>
          Social<span style={{ color: '#6C47FF' }}>-CV</span>
        </span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display" 
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          color: '#0D0D0F',
          marginBottom: 12,
          textAlign: 'center',
          letterSpacing: '-0.03em'
        }}
      >
        Welcome to Social-CV
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: '1.1rem',
          color: '#5A5A72',
          marginBottom: 48,
          textAlign: 'center',
          maxWidth: 500
        }}
      >
        Please select your role to continue.
      </motion.p>

      {/* ── TWO DOORS — Role Selector ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 800 }}
      >
        {/* Job Seeker card */}
        <motion.button
          whileHover={{ scale: 1.04, y: -3, boxShadow: '0 24px 48px rgba(108,71,255,0.28)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSeekerClick}
          style={{
            flex: '1 1 300px', maxWidth: 350, padding: '32px',
            borderRadius: 24, border: '2px solid rgba(108,71,255,0.3)',
            background: 'linear-gradient(135deg, rgba(108,71,255,0.08) 0%, rgba(108,71,255,0.03) 100%)',
            cursor: 'pointer', textAlign: 'left',
            boxShadow: '0 8px 24px rgba(108,71,255,0.12)',
            transition: 'all 0.25s ease',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}
        >
          <div style={{ fontSize: '3rem' }}>👨‍💻</div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6C47FF', marginBottom: 8, letterSpacing: '-0.02em' }}>
              I'm a Job Seeker
            </div>
            <div style={{ fontSize: '0.9rem', color: '#5A5A72', lineHeight: 1.6 }}>
              Build an ATS-beating CV & get discovered by top recruiters
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6C47FF', fontSize: '0.9rem', fontWeight: 700, marginTop: 'auto' }}>
            Create My CV <ArrowRight size={16} />
          </div>
        </motion.button>

        {/* HR / Recruiter card */}
        <motion.button
          whileHover={{ scale: 1.04, y: -3, boxShadow: '0 24px 48px rgba(245,158,11,0.25)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleHRClick}
          style={{
            flex: '1 1 300px', maxWidth: 350, padding: '32px',
            borderRadius: 24, border: '2px solid rgba(245,158,11,0.35)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(255,107,53,0.04) 100%)',
            cursor: 'pointer', textAlign: 'left',
            boxShadow: '0 8px 24px rgba(245,158,11,0.12)',
            transition: 'all 0.25s ease',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}
        >
          <div style={{ fontSize: '3rem' }}>👔</div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706', marginBottom: 8, letterSpacing: '-0.02em' }}>
              I'm an HR / Recruiter
            </div>
            <div style={{ fontSize: '0.9rem', color: '#5A5A72', lineHeight: 1.6 }}>
              Browse top talent CVs in a swipeable Reels-style feed
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#D97706', fontSize: '0.9rem', fontWeight: 700, marginTop: 'auto' }}>
            Find Talent <ArrowRight size={16} />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
