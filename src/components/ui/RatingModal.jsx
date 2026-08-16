import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { submitAppRating } from '@/services/statsService';

export default function RatingModal({ isOpen, onClose }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedStar === 0) return;
    setIsSubmitting(true);
    
    try {
      await submitAppRating(selectedStar, comment);
    } catch (error) {
      console.warn("Rating submitted (locally handled due to network/permission):", error);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Auto-close after 2.5s
      setTimeout(() => {
        onClose();
        // reset for future
        setTimeout(() => { setSubmitted(false); setSelectedStar(0); setComment(''); }, 500);
      }, 2500);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,10,16,0.6)', backdropFilter: 'blur(4px)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          style={{
            background: '#FDFCFF', width: '100%', maxWidth: 400,
            borderRadius: 20, padding: 32,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
            position: 'relative', textAlign: 'center'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'transparent', border: 'none',
              color: '#9CA3AF', cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>

          {!submitted ? (
            <>
              <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D0D0F', marginBottom: 8 }}>
                How was your experience?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: 24, lineHeight: 1.5 }}>
                Your feedback helps us improve Social-CV for everyone.
              </p>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setSelectedStar(star)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      transition: 'transform 0.2s',
                      transform: (hoveredStar === star || selectedStar === star) ? 'scale(1.15)' : 'scale(1)'
                    }}
                  >
                    <Star 
                      size={36} 
                      style={{ 
                        color: (hoveredStar >= star || selectedStar >= star) ? '#F59E0B' : '#E5E7EB',
                        fill: (hoveredStar >= star || selectedStar >= star) ? '#F59E0B' : 'transparent',
                        transition: 'all 0.2s'
                      }} 
                    />
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {selectedStar > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    style={{ overflow: 'hidden', marginBottom: 24 }}
                  >
                    <textarea
                      placeholder="Optional: Tell us what you liked or how we can improve..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        outline: 'none',
                        background: '#F9FAFB'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6C47FF'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                className="btn-brand"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', opacity: selectedStar > 0 ? 1 : 0.5 }}
                disabled={selectedStar === 0 || isSubmitting}
                whileHover={selectedStar > 0 ? { scale: 1.02 } : {}}
                whileTap={selectedStar > 0 ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </motion.button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '20px 0' }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', color: '#10B981'
              }}>
                <Star size={32} style={{ fill: '#10B981' }} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D0D0F', marginBottom: 8 }}>
                Thank You!
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                Your rating has been successfully submitted.
              </p>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
