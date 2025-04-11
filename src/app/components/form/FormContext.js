"use client";

import { createContext, useState, useEffect } from "react";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";

export const FormContext = createContext();

export function FormProvider({ children }) {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    companyName: "",
    description: "",
    location: "",
    website: "",
    contactEmail: "",
    logoUrl: "",
    displayImageUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          userId: user.id,
          email: user.email,
        }));
      } else {
        const email = localStorage.getItem("registrationEmail");
        if (email) {
          setFormData((prev) => ({
            ...prev,
            email,
          }));
        }
      }
      setLoading(false);
    }
  }, [user, authLoading]);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        user,
        loading: loading || authLoading,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
