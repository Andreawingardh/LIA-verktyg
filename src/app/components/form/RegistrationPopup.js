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

  // Password requirements
  const passwordRequirements = {
    minLength: 8,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  };

  // Debounced validation for smoother experience
  useEffect(() => {
    const handler = setTimeout(() => {
      validateForm();
    }, 100); // Small delay to prevent constant updates
    
    return () => {
      clearTimeout(handler);
    };
  }, [email, password]);

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;
    const missingRequirements = [];

    // Email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Mail följer inte rätt format. Exempel:";
        formIsValid = false;
      }
    }

    // Password validation
    if (password) {
      // Check for minimum length
      if (password.length < passwordRequirements.minLength) {
        missingRequirements.push('minLength');
        formIsValid = false;
      }
      
      // Check for uppercase letters
      if (!/[A-Z]/.test(password)) {
        missingRequirements.push('uppercase');
        formIsValid = false;
      }
      
      // Check for lowercase letters
      if (!/[a-z]/.test(password)) {
        missingRequirements.push('lowercase');
        formIsValid = false;
      }
      
      // Check for numbers
      if (!/\d/.test(password)) {
        missingRequirements.push('number');
        formIsValid = false;
      }
      
      // Check for special characters
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
    
    // Final validation before submission
    validateForm();
    if (!isFormValid) {
      return;
    }
    
    setLoading(true);

    try {
      // Try to register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Handle Supabase registration errors more specifically
        console.log("Supabase registration error:", error);
        
        if (error.message.includes("already registered") || error.message.includes("already in use")) {
          setErrors({...errors, email: "E-postadress används redan av ett annat konto"});
        } else if (error.message.includes("email") || error.message.includes("Email")) {
          setErrors({...errors, email: error.message});
        } else if (error.message.includes("password") || error.message.includes("Password")) {
          setErrors({...errors, password: error.message});
          // Always show password requirements when there's a password error
          validateForm();
        } else if (error.message.includes("too many requests") || error.message.includes("rate limit")) {
          setErrors({...errors, general: "För många försök. Vänligen försök igen senare."});
        } else {
          setErrors({...errors, general: error.message});
        }
        throw error;
      }

      // Store registration data and proceed
      localStorage.setItem("registrationEmail", email);
      localStorage.setItem("registrationPassword", password);
      localStorage.setItem("registrationStep", "baseInfo");

      onClose();
      router.push("/company/baseInfo");
    } catch (err) {
      console.error("Registration error:", err);
      // Only set a general error if no specific errors were set
      if (!errors.email && !errors.password) {
        setErrors({
          ...errors, 
          general: err.message || "Ett fel uppstod vid registrering"
        });
      }
    } finally {
      setLoading(false);
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
            <p>Stäng</p>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Skriv din inloggningsmail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear email error when user types
                if (errors.email) {
                  const { email, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              disabled={loading}
              className={errors.email ? "input-error" : ""}
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

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              name="password"
              type="password"
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
              className={errors.password ? "input-error" : ""}
            />
           
            {/* Fixed-height container for password requirements to prevent layout shifting */}
          <div className="password-requirements-container">
            {errors.password && errors.passwordRequirements && (
              <>
                <p className="password-requirements-heading" style={{ color: "#B40509" }}>Lösenordet behöver innehålla:</p>
                <ul className="password-requirements">
                  {errors.passwordRequirements.includes('minLength') && (
                    <li className="requirement-error">Minst {passwordRequirements.minLength} tecken</li>
                  )}
                  {errors.passwordRequirements.includes('uppercase') && (
                    <li className="requirement-error">Minst en stor bokstav</li>
                  )}
                  {errors.passwordRequirements.includes('lowercase') && (
                    <li className="requirement-error">Minst en liten bokstav</li>
                  )}
                  {errors.passwordRequirements.includes('number') && (
                    <li className="requirement-error">Minst en siffra</li>
                  )}
                  {errors.passwordRequirements.includes('special') && (
                    <li className="requirement-error">Minst ett specialtecken</li>
                  )}
                </ul>
              </>
            )}
          </div>
            
          </div>

          <div className="checkbox-group">
            <input id="checkbox" name="checkbox" type="checkbox" required />
            <label htmlFor="checkbox">Jag godkänner</label>
            <a href="">sekretesspolicy</a>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading || !isFormValid}
              className={!isFormValid ? "button-disabled" : ""}
            >
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