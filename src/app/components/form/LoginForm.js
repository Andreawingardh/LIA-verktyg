"use client"

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm({ onSuccess, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Attempting client-side login");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("Login successful:", data);
      
      // Force a refresh
      router.refresh();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError("Login failed: " + (error.message || "Please check your credentials."));
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-post</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          placeholder="Skriv din inloggningsmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Lösenord</label>
        <a href=''>Glömt ditt lösenord?</a>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          placeholder="Skriv ditt lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Logga in</button>
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