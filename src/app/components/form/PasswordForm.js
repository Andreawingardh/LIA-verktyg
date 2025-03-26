"use client";

import { useContext, useState, useRef, use } from "react";
import { FormContext } from "./FormContext";
import { signup } from "../../login/actions";

export function CustomPasswordForm({ onSuccess }) {
  const { formData } = useContext(FormContext);
  
  const handleSubmit = async (formData) => {
    try {
      await signup(formData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  
  return (
    <>
      <h2>Välj lösenord</h2>
      <p>Skriv ett starkt lösenord för att logga in</p>
      <form action={handleSubmit}>
        {/* Hidden email field that gets the email from context */}
        <input 
          type="hidden" 
          name="email" 
          value={formData.email} 
        />
        {/* Hidden name field */}
        <input 
          type="hidden" 
          name="name" 
          value={formData.name} 
        />
        <label htmlFor="password">Lösenord</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          placeholder="Skriv ett starkt lösenord här"
        />
        <button formAction={signup}>Skapa konto</button>
      </form>
    </>
  );
}