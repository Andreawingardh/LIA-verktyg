"use client";

import { useState, useContext, createContext } from 'react';
import { signup } from '../../login/actions'; 
import { CustomNameAndMailForm } from './NameAndMailForm';
import { CustomPasswordForm } from './PasswordForm';
import { FormProvider } from './FormContext';
import { CompanyForm } from './CompanyInformationForm';
import './popup.css';

export default function RegistrationPopup({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  return (
    <div 
      className="popup-overlay" 
      style={{ display: isOpen ? 'flex' : 'none' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Popup content container */}
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-btn" onClick={onClose}>
        <p>Stäng</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M1.8 18L0 16.2L7.2 9L0 1.8L1.8 0L9 7.2L16.2 0L18 1.8L10.8 9L18 16.2L16.2 18L9 10.8L1.8 18Z"
              fill="#1C1B1F"
            />
          </svg>
        </button>
        
        {/* Form content with context provider */}
        <FormProvider>
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <CustomNameAndMailForm goToNextStep={goToNextStep} />
          </div>
          
          <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            <CustomPasswordForm goToNextStep={goToNextStep} />
          </div>

          <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
            <CompanyForm onSuccess={onClose} />
          </div>
        </FormProvider>
      </div>
    </div>
  );
}