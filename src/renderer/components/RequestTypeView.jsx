import React, { useState } from 'react';

export function RequestTypeView({ onNext, onBack }) {
  const [selectedType, setSelectedType] = useState(null);

  const requestTypes = [
    { 
      id: 'AirShopping', 
      name: 'AirShopping', 
      description: 'Search and shop for flight offers',
      icon: '✈️'
    },
    { 
      id: 'OrderCreate', 
      name: 'OrderCreate', 
      description: 'Create a new order from selected offers',
      icon: '📝'
    },
    { 
      id: 'SeatAvailability', 
      name: 'SeatAvailability', 
      description: 'Check seat availability for flights',
      icon: '💺'
    },
    { 
      id: 'OrderReshop', 
      name: 'OrderReshop', 
      description: 'Reshop an existing order for modifications',
      icon: '🔄'
    },
    { 
      id: 'OrderChange', 
      name: 'OrderChange', 
      description: 'Change an existing order',
      icon: '✏️'
    },
  ];

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
        }}>Select IATA Request Type</h2>
        <p style={{
          fontSize: 16,
          color: '#7a8ca7',
          marginBottom: 32,
        }}>Choose the NDC request type for your transaction</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          {requestTypes.map(type => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                padding: 24,
                borderRadius: 12,
                border: selectedType === type.id ? '2px solid #6c63ff' : '1.5px solid #dbe2ef',
                background: selectedType === type.id
                  ? 'linear-gradient(135deg, #f0efff 0%, #e8f5ff 100%)'
                  : 'linear-gradient(135deg, #f9fafe 0%, #f1f4fa 100%)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedType === type.id
                  ? '0 4px 16px rgba(108, 99, 255, 0.2)'
                  : '0 2px 8px rgba(60,80,120,0.05)',
              }}
              onMouseEnter={(e) => {
                if (selectedType !== type.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,80,120,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedType !== type.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(60,80,120,0.05)';
                }
              }}
            >
              <div style={{
                fontSize: 32,
                marginBottom: 12,
              }}>{type.icon}</div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#2d3552',
                marginBottom: 8,
              }}>{type.name}</h3>
              <p style={{
                fontSize: 14,
                color: '#7a8ca7',
                lineHeight: 1.5,
                margin: 0,
              }}>{type.description}</p>
            </div>
          ))}
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
            disabled={!selectedType}
            style={{
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 600,
              color: selectedType ? '#fff' : '#bfc8e6',
              background: selectedType
                ? 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)'
                : 'linear-gradient(90deg, #e9ecf3 0%, #dbe2ef 100%)',
              border: 'none',
              borderRadius: 8,
              cursor: selectedType ? 'pointer' : 'not-allowed',
              boxShadow: selectedType ? '0 2px 8px rgba(108, 99, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedType) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedType) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(108, 99, 255, 0.3)';
              }
            }}
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}
