"use client"

import { login, signup } from '../../login/actions'
import { useState } from 'react'


export default function LoginForm({ onSuccess }) {
  
  const handleSubmit = async (formData) => {
    try {
      await login(formData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <>
      <h2>Logga in</h2>
      <p>Ange din e-post och lösenord för att logga in</p>
      <form action={handleSubmit}>
        <label htmlFor="email">E-post</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          placeholder="Ange din e-post"
        />
        <label htmlFor="password">Lösenord</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          placeholder="Ange ditt lösenord"
        />
        <button formAction={login}>Logga in</button>
      </form>
    </>
  );
}