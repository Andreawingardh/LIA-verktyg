"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase/client';
import './popup.css';

export default function RegistrationPopup({ isOpen, onClose, onShowLogin }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginClick = () => {
    onClose();
    if (onShowLogin) {
      onShowLogin();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      localStorage.setItem('registrationEmail', email);
      localStorage.setItem('registrationPassword', password);
      localStorage.setItem('registrationStep', 'baseInfo');
      
      onClose();
      
      router.push('/company/baseInfo');
    } catch (err) {
      console.error('Registration error:', err);
      setError("Ett fel uppstod vid registrering");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div 
      className="popup-overlay" 
      style={{ display: isOpen ? 'flex' : 'none' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
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
        
        <h2>Skapa Företagskonto</h2>
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
            disabled={loading}
          />

          <label htmlFor="password">Lösenord</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Skriv ett starkt lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}

          <input id="checkbox" name="checkbox" type="checkbox" required />
          <label htmlFor="checkbox">Jag godkänner</label>
          <a href="">sekretesspolicy</a>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Skapar konto..." : "Skapa Företagsprofil"}
            </button>
          </div>
          <div className="auth-buttons">
            <button
              type="button"
              className="login-btn"
              onClick={handleLoginClick}
              disabled={loading}
            >
              Logga in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}