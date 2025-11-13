import React from 'react';

export function ProgressSidebar({ currentStep, onStepChange }) {
  const steps = [
    { id: 1, label: 'Scenario' },
    { id: 2, label: 'Request Type' },
    { id: 3, label: 'Request Components' },
    { id: 4, label: 'Request Validation' },
    { id: 5, label: 'Send Request' },
  ];

  return (
    <div style={{
      minWidth: 280,
      maxWidth: 280,
      padding: '32px 24px',
      background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecf3 100%)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{
        margin: '0 0 32px 0',
        fontSize: 24,
        fontWeight: 700,
        color: '#2d3552',
        letterSpacing: '0.02em',
      }}>Progress</h2>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Vertical connecting line */}
        <div style={{
          position: 'absolute',
          left: 19,
          top: 28,
          bottom: 28,
          width: 2,
          background: 'linear-gradient(180deg, #6c63ff 0%, #3a4663 100%)',
          opacity: 0.3,
          zIndex: 0,
        }} />

        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div
              key={step.id}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <button
                onClick={() => onStepChange(step.id)}
                style={{
                  width: '100%',
                  padding: '14px 18px 14px 52px',
                  borderRadius: 10,
                  border: isActive ? '2px solid #6c63ff' : '1.5px solid #bfc8e6',
                  background: isActive
                    ? 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)'
                    : isCompleted
                    ? 'linear-gradient(90deg, #e8f5e9 0%, #c8e6c9 100%)'
                    : 'linear-gradient(90deg, #f9fafe 0%, #f1f4fa 100%)',
                  color: isActive ? '#fff' : isCompleted ? '#2e7d32' : '#3a4663',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: isActive 
                    ? '0 4px 12px rgba(108, 99, 255, 0.3)' 
                    : '0 2px 8px rgba(60,80,120,0.07)',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.transform = 'translateX(4px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(60,80,120,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.transform = 'translateX(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(60,80,120,0.07)';
                  }
                }}
              >
                {/* Step number circle */}
                <div style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isActive 
                    ? '#fff' 
                    : isCompleted 
                    ? '#4caf50' 
                    : '#bfc8e6',
                  color: isActive 
                    ? '#6c63ff' 
                    : isCompleted 
                    ? '#fff' 
                    : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                  {isCompleted ? '✓' : step.id}
                </div>
                {step.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
