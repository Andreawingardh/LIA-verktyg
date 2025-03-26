"use client";

import { useContext, useState, useRef, use } from "react";
import { FormContext } from "../../../components/form/FormContext";
import { signup } from "../../../login/actions";
import { useSearchParams } from "next/navigation";

export default function PasswordForm() {
  const { formData } = useContext(FormContext);
  const searchParams = useSearchParams();
  
  // Get values from URL query parameters
  const name = searchParams.get('name') || formData.name;
  const email = searchParams.get('email') || formData.email;

  return (
    <>
      <h2>Välj lösenord</h2>
      <h3>Stäng</h3>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1.8 18L0 16.2L7.2 9L0 1.8L1.8 0L9 7.2L16.2 0L18 1.8L10.8 9L18 16.2L16.2 18L9 10.8L1.8 18Z" fill="#1C1B1F"/>
      </svg>
      <p>Skriv ett starkt lösenord för att logga</p>
      <form action={signup}>
        {/* Hidden email field that gets the email from context */}
        <input 
          type="hidden" 
          name="email" 
          value={email} 
        />
        {/* Hidden name field */}
        <input 
          type="hidden" 
          name="name" 
          value={name} 
        />
        <label htmlFor="password">Lösenord</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          placeholder="Skriv ett starkt lösenord här"
        />
        <button  formAction={signup}>Sign up</button>
      </form>
    </>
  );
}
