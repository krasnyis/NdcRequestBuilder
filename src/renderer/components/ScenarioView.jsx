import React, { useState } from 'react';

export function ScenarioView({ onNext, onBack }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    { id: 1, name: 'One Step Order Create', description: 'Create an order in a single request' },
    { id: 2, name: 'Two Step Order Create', description: 'Search flights and create order separately' },
    { id: 3, name: 'Seat Change', description: 'Change seat assignment for existing order' },
    { id: 4, name: 'Order Reshop', description: 'Reshop an existing order for changes' },
    { id: 5, name: 'Order Cancel', description: 'Cancel an existing order' },
    { id: 6, name: 'Service List', description: 'Retrieve available ancillary services' },
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
        }}>Select a Scenario</h2>
        <p style={{
          fontSize: 16,
          color: '#7a8ca7',
          marginBottom: 32,
        }}>Choose a workflow scenario to build your NDC request</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              style={{
                padding: 24,
                borderRadius: 12,
                border: selectedScenario === scenario.id ? '2px solid #6c63ff' : '1.5px solid #dbe2ef',
                background: selectedScenario === scenario.id
                  ? 'linear-gradient(135deg, #f0efff 0%, #e8f5ff 100%)'
                  : 'linear-gradient(135deg, #f9fafe 0%, #f1f4fa 100%)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedScenario === scenario.id
                  ? '0 4px 16px rgba(108, 99, 255, 0.2)'
                  : '0 2px 8px rgba(60,80,120,0.05)',
              }}
              onMouseEnter={(e) => {
                if (selectedScenario !== scenario.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,80,120,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedScenario !== scenario.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(60,80,120,0.05)';
                }
              }}
            >
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#2d3552',
                marginBottom: 8,
              }}>{scenario.name}</h3>
              <p style={{
                fontSize: 14,
                color: '#7a8ca7',
                lineHeight: 1.5,
                margin: 0,
              }}>{scenario.description}</p>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          paddingTop: 24,
          borderTop: '1px solid #e0e4ea',
        }}>
          <button
            onClick={onNext}
            disabled={!selectedScenario}
            style={{
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 600,
              color: selectedScenario ? '#fff' : '#bfc8e6',
              background: selectedScenario
                ? 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)'
                : 'linear-gradient(90deg, #e9ecf3 0%, #dbe2ef 100%)',
              border: 'none',
              borderRadius: 8,
              cursor: selectedScenario ? 'pointer' : 'not-allowed',
              boxShadow: selectedScenario ? '0 2px 8px rgba(108, 99, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedScenario) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedScenario) {
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
