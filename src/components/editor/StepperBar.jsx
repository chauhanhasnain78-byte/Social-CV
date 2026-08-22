import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { User, Briefcase, GraduationCap, Wrench, FolderGit2, Globe } from 'lucide-react';

const steps = [
  { id: 0, label: 'Personal Info',  icon: User },
  { id: 1, label: 'Experience',     icon: Briefcase },
  { id: 2, label: 'Education',      icon: GraduationCap },
  { id: 3, label: 'Skills',         icon: Wrench },
  { id: 4, label: 'Projects',       icon: FolderGit2 },
  { id: 5, label: 'Extras',         icon: Globe },
];


export function StepperBar() {
  const { wizardStep, setWizardStep } = useResumeStore();

  return (
    <div style={{ width: '100%', padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = wizardStep === step.id;
          const isPast = wizardStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setWizardStep(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: isActive || isPast ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? '#6C47FF' : isPast ? '#6C47FF' : '#F3F4F6',
                  color: isActive || isPast ? '#FFFFFF' : '#9CA3AF',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  {isActive ? <Icon size={16} /> : (isPast ? '✓' : step.id + 1)}
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#111827' : '#6B7280'
                }}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div style={{
                  width: 24,
                  height: 2,
                  background: isPast ? '#6C47FF' : '#E5E7EB',
                  transition: 'background 0.3s'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
