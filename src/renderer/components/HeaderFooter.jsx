import React from 'react';

export function Header() {
  return (
    <header style={{
      background: 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)',
      color: '#fff',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h1 style={{
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}>NDC Request Builder</h1>
      <div style={{
        fontSize: 14,
        fontWeight: 500,
        opacity: 0.9,
      }}>v1.0.0</div>
    </header>
  );
}

export function Footer({ status = 'Ready' }) {
  return (
    <footer style={{
      background: 'linear-gradient(90deg, #f6f8fa 0%, #e9ecf3 100%)',
      borderTop: '1px solid #dbe2ef',
      padding: '12px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{
        fontSize: 14,
        color: '#3a4663',
        fontWeight: 500,
      }}>{status}</span>
      <span style={{
        fontSize: 13,
        color: '#7a8ca7',
      }}>
        {/* Additional info can go here */}
      </span>
    </footer>
  );
}
