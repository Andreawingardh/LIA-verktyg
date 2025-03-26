"use client";

import { createContext, useState } from 'react';

export const FormContext = createContext();

export function FormProvider({ children }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
}