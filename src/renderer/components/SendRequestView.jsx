import React, { useState } from 'react';

export function SendRequestView({ onBack }) {
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSendRequest = () => {
    setIsSending(true);
    // Placeholder for actual request sending logic
    setTimeout(() => {
      setIsSending(false);
      setResponse({
        status: 'success',
        message: 'Request functionality coming soon',
      });
    }, 1500);
  };

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
        }}>Send Request</h2>
        <p style={{
          fontSize: 16,
          color: '#7a8ca7',
          marginBottom: 32,
        }}>Review and send your NDC request</p>

        <div style={{
          padding: 40,
          borderRadius: 12,
          border: '1.5px solid #dbe2ef',
          background: 'linear-gradient(135deg, #f9fafe 0%, #f1f4fa 100%)',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div style={{
            fontSize: 48,
            marginBottom: 16,
          }}>📤</div>
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#2d3552',
            marginBottom: 8,
          }}>Ready to Send</h3>
          <p style={{
            fontSize: 15,
            color: '#7a8ca7',
            lineHeight: 1.6,
            marginBottom: 24,
          }}>Click the button below to send your NDC request to the endpoint</p>

          <button
            onClick={handleSendRequest}
            disabled={isSending}
            style={{
              padding: '14px 40px',
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
              background: isSending
                ? 'linear-gradient(90deg, #bfc8e6 0%, #9ca8c7 100%)'
                : 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)',
              border: 'none',
              borderRadius: 8,
              cursor: isSending ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 12px rgba(108, 99, 255, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSending) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(108, 99, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSending) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 12px rgba(108, 99, 255, 0.3)';
              }
            }}
          >
            {isSending ? 'Sending...' : 'Send Request'}
          </button>
        </div>

        {response && (
          <div style={{
            padding: 24,
            borderRadius: 12,
            border: '1.5px solid #c8e6c9',
            background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%)',
            marginBottom: 32,
          }}>
            <h4 style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#2e7d32',
              marginBottom: 8,
            }}>Response</h4>
            <p style={{
              fontSize: 14,
              color: '#4caf50',
              margin: 0,
            }}>{response.message}</p>
          </div>
        )}

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
        </div>
      </div>
    </div>
  );
}
