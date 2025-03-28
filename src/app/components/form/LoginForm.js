"use client"

import { login, signup } from '../../login/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function LoginForm({ onSuccess, onRegisterClick }) {
  const [error, setError] = useState("");
  
  const handleSubmit = async (formData) => {
    try {
      await login(formData);
      if (onSuccess) onSuccess();
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };
  
  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (onRegisterClick) {
      onRegisterClick();
    } 
  };

  return (
    <>
      <h2>Logga in</h2> 
      <form action={handleSubmit}>
        <label htmlFor="email">E-post</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          placeholder="Skriv din inloggningsmail"
        />
        <label htmlFor="password">Lösenord</label>
        <a href=''>Glömt ditt lösenord?</a>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          placeholder="Skriv ditt lösenord"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button formAction={login}>Logga in</button>
        <div className="auth-buttons">
          <button
            type="button"
            className="login-btn"
            onClick={(e) => handleRegisterClick(e)}
          >
            Inget konto? Skapa nu
          </button>
        </div>
      </form>
    </>
  );
}