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

export function ResumePreview({ resume, templateId, themeColor, fontFamily, fontSize, textAlignment }) {
  const Template = TEMPLATE_MAP[templateId] || MinimalProTemplate;
  const sectionOrder = useResumeStore((state) => state.sectionOrder);

  // Map "sm", "md", "lg" to actual pixel sizes that define the 1em base, or use the exact numeric value
  const sizeMap = {
    sm: '14px',
    md: '16px',
    lg: '18px'
  };
  const baseSize = sizeMap[fontSize] || (fontSize ? `${fontSize}px` : '16px');

  return (
    <div id="resume-preview" className="a4-page" style={{ fontSize: baseSize, textAlign: textAlignment || 'left' }}>
      <Template
        resume={resume}
        themeColor={themeColor || '#6C47FF'}
        fontFamily={fontFamily || 'sans-serif'}
        sectionOrder={sectionOrder}
      />
    </div>
  );
}
