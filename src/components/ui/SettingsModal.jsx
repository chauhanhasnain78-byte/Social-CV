import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Key, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export default function SettingsModal({ onClose }) {
  const { user, resetPassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handlePasswordReset = async () => {
    setResetting(true);
    try {
      await resetPassword(user.email);
      toast.success('Password reset link sent to your email! 📧', { title: '✅ Email Sent' });
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email.');
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success('Your account has been deleted.', { title: 'Account Deleted' });
      navigate('/auth');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in to verify your identity before deleting your account.', { title: 'Security Requirement' });
      } else {
        toast.error(err.message || 'Failed to delete account.');
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Password Reset Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Key size={16} className="text-brand-500" /> Password & Security
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              We'll send a secure link to <strong>{user?.email}</strong> to reset your password.
            </p>
            <button
              onClick={handlePasswordReset}
              disabled={resetting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(108,71,255,0.1)', color: '#6C47FF' }}
            >
              {resetting ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Danger Zone */}
          <div>
            <h3 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} /> Danger Zone
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} /> Delete Account
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-sm text-red-800 font-medium mb-3">
                  Are you absolutely sure? All data will be wiped.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                    className="flex-1 py-2 rounded-lg font-semibold text-sm bg-white text-gray-700 border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 py-2 rounded-lg font-semibold text-sm bg-red-600 text-white flex justify-center items-center gap-2"
                  >
                    {deleting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
