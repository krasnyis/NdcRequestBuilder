import React from 'react';

export function RequestValidationView({ onNext, onBack }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: 40,
      background: '#ffffff',
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#2d3552',
          marginBottom: 12,
        }}>Request Validation</h2>
        <p style={{
          fontSize: 16,
          color: '#7a8ca7',
          marginBottom: 32,
        }}>Validate your NDC request before sending</p>

        <div style={{
          padding: 40,
          borderRadius: 12,
          border: '1.5px solid #dbe2ef',
          background: 'linear-gradient(135deg, #f9fafe 0%, #f1f4fa 100%)',
          textAlign: 'center',
          marginBottom: 40,
        }}>
          <div style={{
            fontSize: 48,
            marginBottom: 16,
          }}>✓</div>
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#2d3552',
            marginBottom: 8,
          }}>Validation Coming Soon</h3>
          <p style={{
            fontSize: 15,
            color: '#7a8ca7',
            lineHeight: 1.6,
            margin: 0,
          }}>This step will validate your request against NDC schema and business rules</p>
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          paddingTop: 24,
          borderTop: '1px solid #e0e4ea',
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 600,
              color: '#3a4663',
              background: 'linear-gradient(90deg, #f9fafe 0%, #f1f4fa 100%)',
              border: '1.5px solid #bfc8e6',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(60,80,120,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(60,80,120,0.07)';
            }}
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            style={{
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(108, 99, 255, 0.3)';
            }}
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}
