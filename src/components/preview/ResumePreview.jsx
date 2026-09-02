import { Component } from 'react';
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

export function ResumePreview({ resume, templateId, themeColor, fontFamily, fontSize, textAlignment }) {
  const Template     = TEMPLATE_MAP[templateId] || MinimalProTemplate;
  const sectionOrder = useResumeStore((state) => state.sectionOrder);

  const sizeMap  = { sm: '14px', md: '16px', lg: '18px' };
  const baseSize = sizeMap[fontSize] || (fontSize ? `${fontSize}px` : '16px');

  return (
    <PreviewErrorBoundary>
      <div id="resume-preview" className="a4-page" style={{ fontSize: baseSize, textAlign: textAlignment || 'left' }}>
        <Template
          resume={resume}
          themeColor={themeColor  || '#6C47FF'}
          fontFamily={fontFamily  || 'sans-serif'}
          sectionOrder={sectionOrder}
        />
      </div>
    </PreviewErrorBoundary>
  );
}
