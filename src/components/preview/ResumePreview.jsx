import { Component, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { MinimalProTemplate } from './MinimalProTemplate';
import { BoldEdgeTemplate   } from './BoldEdgeTemplate';
import { NordicTemplate      } from './NordicTemplate';
import { PortraitTemplate    } from './PortraitTemplate';
import { MagazineTemplate    } from './MagazineTemplate';
import { PassportTemplate    } from './PassportTemplate';
import { useResumeStore } from '@/store/resumeStore';

const TEMPLATE_MAP = {
  'minimal-pro': MinimalProTemplate,
  'bold-edge':   BoldEdgeTemplate,
  'nordic':      NordicTemplate,
  'portrait':    PortraitTemplate,
  'magazine':    MagazineTemplate,
  'passport':    PassportTemplate,
};

// ── Error Boundary ────────────────────────────────────────────────────────────
// Wraps the template so a crash in ONE template doesn't kill the whole app.
class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ResumePreview] Template crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: 794, minHeight: 400,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 12, background: '#FEF2F2',
          border: '2px dashed #EF4444', borderRadius: 8,
          padding: 40,
        }}>
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <p style={{ fontWeight: 700, color: '#B91C1C', fontSize: '1rem' }}>
            Template Render Error
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.82rem', textAlign: 'center', maxWidth: 340 }}>
            Something went wrong while rendering this template. Try switching to a different template, or refresh the page.
          </p>
          <code style={{ fontSize: '0.72rem', color: '#9CA3AF', background: '#F3F4F6', padding: '4px 8px', borderRadius: 4 }}>
            {this.state.error?.message || 'Unknown error'}
          </code>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 8, padding: '8px 20px', borderRadius: 8,
              background: '#6C47FF', color: '#fff', border: 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ResumePreview({ resume, templateId, themeColor, fontFamily, fontSize, textAlignment, candidateUid }) {
  const Template     = TEMPLATE_MAP[templateId] || MinimalProTemplate;
  const sectionOrder = useResumeStore((state) => state.sectionOrder);

  const sizeMap  = { sm: '14px', md: '16px', lg: '18px' };
  const baseSize = sizeMap[fontSize] || (fontSize ? `${fontSize}px` : '16px');

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (candidateUid) {
      const publicLink = `${window.location.origin}/p/${candidateUid}`;
      QRCode.toDataURL(publicLink, { margin: 1, width: 64, color: { dark: '#0D0D0F', light: '#FFFFFF' } })
        .then(setQrDataUrl)
        .catch(err => console.error('QR Gen error:', err));
    }
  }, [candidateUid]);

  return (
    <PreviewErrorBoundary>
      <div id="resume-preview" className="a4-page" style={{ fontSize: baseSize, textAlign: textAlignment || 'left', position: 'relative' }}>
        <Template
          resume={resume}
          themeColor={themeColor  || '#6C47FF'}
          fontFamily={fontFamily  || 'sans-serif'}
          sectionOrder={sectionOrder}
        />
        {/* ── QR Code Overlay ── */}
        {qrDataUrl && (
          <div style={{
            position: 'absolute', bottom: '20px', right: '20px',
            background: '#fff', padding: '6px', borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 100
          }}>
            <img src={qrDataUrl} alt="Public CV Link" style={{ width: 50, height: 50, display: 'block' }} />
            <span style={{ fontSize: '0.45rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scan to View</span>
          </div>
        )}
      </div>
    </PreviewErrorBoundary>
  );
}
