import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AirShoppingXmlEditor } from './components/AirShoppingXmlEditor';
import { NdcRequestTypeSelector } from './components/NdcRequestTemplates';

function MainApp() {
  const [selectedType, setSelectedType] = useState(null);
  const [template, setTemplate] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
  <div style={{ minWidth: 340, maxWidth: 400, padding: '32px 0 32px 32px', background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecf3 100%)', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <NdcRequestTypeSelector
          onSelect={(type, tmpl) => {
            setSelectedType(type);
            setTemplate(tmpl);
          }}
        />
  {/* {selectedType && <pre style={{background:'#f7faff',padding:12,borderRadius:8, marginTop: 24, fontSize: 13, maxWidth: 220, overflowX: 'auto'}}>{JSON.stringify(template, null, 2)}</pre>} */}
      </div>
      <div style={{ flex: 1 }}>
        {selectedType === 'airShopping' && <AirShoppingXmlEditor />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <MainApp />
);
