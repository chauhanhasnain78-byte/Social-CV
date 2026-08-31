import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { Loader2, Lock } from 'lucide-react';

export default function PublicResume() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    async function fetchResume() {
      if (!id) return;
      try {
        const ref = doc(db, 'resumes', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const docData = snap.data();

          // ✅ PRIVACY CHECK: Only show if user has enabled public sharing
          if (!docData.allowRecruiterView) {
            setIsPrivate(true);
            return;
          }

          setData(docData);
          
          // Increment view counter (only for publicly shared resumes)
          await updateDoc(ref, { views: increment(1) }).catch((e) => {
            console.warn('Could not increment views:', e);
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError(true);
      }
    }
    fetchResume();
  }, [id]);

  if (isPrivate) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(108,71,255,0.15)', border: '1px solid rgba(108,71,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={28} style={{ color: '#a78bfa' }} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>This Resume is Private</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: 340 }}>
          The owner has not enabled public sharing for this resume yet.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center text-white text-lg font-medium">
        Oops! This resume is not available.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="animate-spin text-brand-400" size={40} style={{ color: '#a78bfa' }} />
        <p className="text-slate-400 text-sm font-medium">Loading resume...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center pt-8 md:pt-16 pb-24 overflow-x-hidden">
      <div className="w-full max-w-5xl overflow-x-auto flex justify-center px-4">
        {/* We use scale down on smaller screens for mobile viewing */}
        <div className="transform origin-top-left md:origin-top scale-[0.6] sm:scale-75 md:scale-100 transition-transform duration-300">
          <ResumePreview resume={data.resume} templateId={data.templateId} themeColor={data.themeColor} fontFamily={data.fontFamily} candidateUid={id} />
        </div>
      </div>
      
      {/* Branding footer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full glass flex items-center gap-2 shadow-2xl z-50">
        <span className="text-sm font-semibold text-white">Built with Social<span className="gradient-text">-CV</span></span>
      </div>
    </div>
  );
}
