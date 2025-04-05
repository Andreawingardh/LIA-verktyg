"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase/client";
import "./popup.css";

export default function RegistrationPopup({ isOpen, onClose, onShowLogin }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Password requirements
  const passwordRequirements = {
    minLength: 8,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  };

 
  useEffect(() => {
    const handler = setTimeout(() => {
      validateForm();
    }, 100); 
    
    return () => {
      clearTimeout(handler);
    };
  }, [email, password]);

  
  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;
    const missingRequirements = [];

   
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Mail följer inte rätt format. Exempel:";
        formIsValid = false;
      }
    }

   
    if (password) {
     
      if (password.length < passwordRequirements.minLength) {
        missingRequirements.push('minLength');
        formIsValid = false;
      }
      
     
      if (!/[A-Z]/.test(password)) {
        missingRequirements.push('uppercase');
        formIsValid = false;
      }
      
      
      if (!/[a-z]/.test(password)) {
        missingRequirements.push('lowercase');
        formIsValid = false;
      }
      
      
      if (!/\d/.test(password)) {
        missingRequirements.push('number');
        formIsValid = false;
      }
      
     
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        missingRequirements.push('special');
        formIsValid = false;
      }

      if (missingRequirements.length > 0) {
        newErrors.password = "Lösenordet uppfyller inte kraven";
        newErrors.passwordRequirements = missingRequirements;
      }
    }

    setErrors(newErrors);
    setIsFormValid(formIsValid);
  };

  const handleLoginClick = () => {
    onClose();
    if (onShowLogin) {
      onShowLogin();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    validateForm();
    if (!isFormValid || redirecting) {
      return;
    }
    
    setLoading(true);

    try {
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        
        console.log("Supabase registration error:", error);
        
        if (error.message.includes("already registered") || error.message.includes("already in use")) {
          setErrors({...errors, email: "E-postadress används redan av ett annat konto"});
        } else if (error.message.includes("email") || error.message.includes("Email")) {
          setErrors({...errors, email: error.message});
        } else if (error.message.includes("password") || error.message.includes("Password")) {
          setErrors({...errors, password: error.message});
          validateForm();
        } else if (error.message.includes("too many requests") || error.message.includes("rate limit")) {
          setErrors({...errors, general: "För många försök. Vänligen försök igen senare."});
        } else {
          setErrors({...errors, general: error.message});
        }
        setLoading(false);
        return;
      }

      setRedirecting(true);

      // Store registration data and proceed
      localStorage.setItem("registrationEmail", email);
      localStorage.setItem("registrationPassword", password);
      localStorage.setItem("registrationStep", "baseInfo");

      
      onClose();
      
      setTimeout(() => {
        router.push("/company/baseInfo");
      }, 100);
      
    } catch (err) {
      console.error("Registration error:", err);
      if (!errors.email && !errors.password) {
        setErrors({
          ...errors, 
          general: err.message || "Ett fel uppstod vid registrering"
        });
      }
      setLoading(false);
      setRedirecting(false);
    }
  };

  return (
    <div
      className="popup-overlay"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Skapa Företagskonto</h2>
          <button className="close-btn" onClick={onClose}>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L8 7.29289L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L8.70711 8L12.3536 11.6464C12.5488 11.8417 12.5488 12.1583 12.3536 12.3536C12.1583 12.5488 11.8417 12.5488 11.6464 12.3536L8 8.70711L4.35355 12.3536C4.15829 12.5488 3.84171 12.5488 3.64645 12.3536C3.45118 12.1583 3.45118 11.8417 3.64645 11.6464L7.29289 8L3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645Z"
                fill="#0F1314"
              />
            </svg>
            <p className="close-btn-text">Stäng</p>
          </button>
        </div>

        <form className="formwrapper" onSubmit={handleSubmit}>
        <div className='inputSingle'>
        <article className='inputHeader'>
              <label className="popupTitle" htmlFor="email">E-post</label>
              </article>
            <input
              id="email"
              name="email"
                type="email"
                className="inputs"
              required
              placeholder="Skriv din inloggningsmail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  const { email, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              disabled={loading}
            />
            
            {errors.email && (
              <div className="email-error-container">
                <p className="error-message">{errors.email}</p>
                <ul className="password-requirements">
                  <li className="requirement-error">exempel@exempel.com</li>
                </ul>
              </div>
            )}
          </div>

          <div className='inputSingle'>
            <article className='inputHeader'>
              <label className="popupTitle" htmlFor="password">Lösenord</label>
              </article>
            <input
              id="password"
              name="password"
                type="password"
                className="inputs"
              required
              placeholder="Skriv ett starkt lösenord"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Clear password error when user types
                if (errors.password) {
                  const { password, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              disabled={loading}
              
            />
            
            </div>
            {/* Fixed-height container for password requirements to prevent layout shifting */}
          <div className="password-requirements-container">
           
            {errors.password && errors.passwordRequirements && (
              <>
                <p className="password-requirements-heading">Lösenordet behöver innehålla:</p>
                <ul className="password-requirements">
                  {errors.passwordRequirements.includes('minLength') && (
                    <li className="requirement-error">Minst {passwordRequirements.minLength} karaktärer</li>
                  )}
                  {errors.passwordRequirements.includes('uppercase') && (
                    <li className="requirement-error">Minst 1 stor bokstav (A, B, C)</li>
                  )}
                  {errors.passwordRequirements.includes('number') && (
                    <li className="requirement-error">Minst 1 nummer (1, 2, 3)</li>
                  )}
                  {errors.passwordRequirements.includes('special') && (
                    <li className="requirement-error">Minst 1 symbol (!, *, #)</li>
                  )}
                </ul>
              </>

            )}
           <div className="checkbox-group">
            <input id="checkbox" name="checkbox" type="checkbox" required />
            <label className="gdpr-text "htmlFor="checkbox">Jag godkänner <a className="gdpr" href="">sekretesspolicy</a></label>
            
          </div>
            
          </div>

          {errors.general && <p className="error-message">{errors.general}</p>}

          <footer className="button-group">
            <button 
              type="submit" 
              id="createButton"
              disabled={loading || !isFormValid || redirecting}
              className={!isFormValid ? "button-disabled" : ""}
            >
              {loading ? "Skapar konto..." : "Skapa Företagskonto"}
            </button>
         
          <div className="auth-buttons">
            <button
              type="button"
              className="register-btn"
              onClick={handleLoginClick}
              disabled={loading}
            >
              Logga in istället
            </button>
            </div>
            </footer>
        </form>
      </div>
    </div>
  );
}