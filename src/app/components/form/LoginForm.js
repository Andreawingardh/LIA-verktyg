"use client"

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm({ onSuccess, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    setIsLoading(true);
    
    // Basic validation before API call
    let hasErrors = false;
    const newErrors = { email: "", password: "", general: "" };
    
    if (!email.trim()) {
      newErrors.email = "E-post krävs";
      hasErrors = true;
    } else {
      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Ogiltig e-postadress";
        hasErrors = true;
      }
    }
    
    if (!password.trim()) {
      newErrors.password = "Lösenord krävs";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Attempting client-side login");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (data) {
        console.log("Login successful:", data);
        
        
        router.refresh();
        
       
        router.push('/dashboard');
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      // Map Supabase error codes to user-friendly messages
      const errorCode = error.code;
      const errorMessage = error.message;
      
      if (errorMessage.includes("Invalid login credentials")) {
        setErrors({
          ...newErrors,
          general: "Fel e-post eller lösenord. Vänligen försök igen."
        });
      } else if (errorMessage.includes("Email not confirmed")) {
        setErrors({
          ...newErrors,
          email: "Din e-postadress har inte bekräftats. Kolla din inbox."
        });
      } else if (errorMessage.includes("Too many requests")) {
        setErrors({
          ...newErrors,
          general: "För många inloggningsförsök. Vänligen försök igen senare."
        });
      } else if (errorMessage.includes("Invalid email")) {
        setErrors({
          ...newErrors,
          email: "Ogiltig e-postadress. Kontrollera och försök igen."
        });
      } else {
        setErrors({
          ...newErrors,
          general: "Inloggningen misslyckades: " + errorMessage
        });
      }
      
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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
      
        <form className="formwrapper" onSubmit={handleSubmit}>
          <div className='inputSingle'>
            <article className='inputHeader'>
            <label className="popupTitle" htmlFor="email">E-post</label>
            </article>
            <input 
              id="email" 
              name="email" 
                type="email" 
                className='inputs'
              required 
              placeholder="Skriv din inloggningsmail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors(prev => ({ ...prev, email: "", general: "" })); // Clear errors when user types
              }}
              />
              
          </div>
          <div className='inputSingle'>
            <article className='inputHeader'>
            <label className="popupTitle" htmlFor="password">Lösenord</label>
            </article>
            <input 
              id="password" 
              name="password" 
                type="password" 
                className='inputs'
              required 
              placeholder="Skriv ditt lösenord"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: "", general: "" })); // Clear errors when user types
              }}
            />
              {errors.email && <p className="error-message" style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{errors.email}</p>}
              <a className="passwordReset"href=''>Glömt ditt lösenord?</a>
          </div>
          {errors.password && <p className="error-message" style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{errors.password}</p>}
          {errors.general && <p className="error-message" style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{errors.general}</p>}
          
          <footer className='button-group'>
            <button type="submit" disabled={isLoading} className='submitButton'>
              {isLoading ? "Loggar in..." : "Logga in"}
            </button>
           
        
              <button
                type="button"
                className="register-btn"
                onClick={(e) => handleRegisterClick(e)}
                disabled={isLoading}
              >
                Skapa konto istället
          </button>
          </footer>
            
          
      </form>
      
      
    </>
  );
}