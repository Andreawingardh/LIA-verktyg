// src/app/layout.js
"use client";
import { FormProvider } from "../../components/form/FormContext.js";

export default function SignUpFormLayout({ children }) {
  return (
    <FormProvider>
      {children}
    </FormProvider>
  )
}
