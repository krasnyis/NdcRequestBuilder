import React from 'react';
import { AirShoppingXmlEditor } from './AirShoppingXmlEditor';

export function RequestComponentsView({ onNext, onBack }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
    }}>
      <div style={{
        padding: '24px 40px 16px 40px',
        borderBottom: '1px solid #e0e4ea',
      }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#2d3552',
          marginBottom: 8,
          margin: 0,
        }}>Request Components</h2>
        <p style={{
          fontSize: 16,
          color: '#7a8ca7',
          margin: 0,
        }}>Build your request by dragging and dropping components</p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 20px',
      }}>
        <AirShoppingXmlEditor />
      </div>

      {/* Navigation buttons */}
      <div style={{
        padding: '16px 40px',
        borderTop: '1px solid #e0e4ea',
        background: '#f9fafe',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          maxWidth: 900,
          margin: '0 auto',
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
