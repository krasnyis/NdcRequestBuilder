import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Header, Footer } from './components/HeaderFooter';
import { ProgressSidebar } from './components/ProgressSidebar';
import { ScenarioView } from './components/ScenarioView';
import { RequestTypeView } from './components/RequestTypeView';
import { RequestComponentsView } from './components/RequestComponentsView';
import { RequestValidationView } from './components/RequestValidationView';
import { SendRequestView } from './components/SendRequestView';

function MainApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState('Ready');

  const handleStepChange = (step) => {
    setCurrentStep(step);
    const stepNames = ['', 'Scenario', 'Request Type', 'Request Components', 'Request Validation', 'Send Request'];
    setStatus(`Step ${step}: ${stepNames[step]}`);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      handleStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1);
    }
  };

  const renderCurrentView = () => {
    switch (currentStep) {
      case 1:
        return <ScenarioView onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <RequestTypeView onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <RequestComponentsView onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <RequestValidationView onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <SendRequestView onBack={handleBack} />;
      default:
        return <ScenarioView onNext={handleNext} onBack={handleBack} />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: '#ffffff',
    }}>
      <Header />
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden',
      }}>
        <ProgressSidebar currentStep={currentStep} onStepChange={handleStepChange} />
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
          {renderCurrentView()}
        </div>
      </div>
      <Footer status={status} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <MainApp />
);
