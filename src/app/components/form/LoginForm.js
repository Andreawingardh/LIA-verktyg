"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm({ onSuccess, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Track whether fields have been touched
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  
  const router = useRouter();

  // Handle field blur (when user leaves a field)
  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });
    
    // Validate the field when it loses focus
    validateField(field);
  };

  // Validate a specific field
  const validateField = (field) => {
    let errorMessage = "";
    
    if (field === 'email') {
      if (!email.trim()) {
        errorMessage = "E-post krävs";
      } else {
        // Simple email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errorMessage = "Ogiltig e-postadress";
        }
      }
    } else if (field === 'password') {
      if (!password.trim()) {
        errorMessage = "Lösenord krävs";
      }
    }
    
    setErrors({
      ...errors,
      [field]: errorMessage
    });
    
    return !errorMessage; // Return true if valid, false if invalid
  };

  // Handle input change
  const handleChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
    
    // Clear the general error when user starts typing
    setErrors({
      ...errors,
      [field]: touched[field] ? validateField(field) ? "" : errors[field] : "",
      general: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    // Reset errors
    setErrors({ email: "", password: "", general: "" });
    
    // Validate all fields
    const isEmailValid = validateField('email');
    const isPasswordValid = validateField('password');
    
    // Check if there are validation errors
    if (!isEmailValid || !isPasswordValid) {
      return; // Don't proceed with submission
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data) {
        router.refresh();
        router.push("/dashboard");

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
          ...errors,
          general: "Fel e-post eller lösenord. Vänligen försök igen.",
        });
      } else if (errorMessage.includes("Email not confirmed")) {
        setErrors({
          ...errors,
          email: "Din e-postadress har inte bekräftats. Kolla din inbox.",
        });
      } else if (errorMessage.includes("Too many requests")) {
        setErrors({
          ...errors,
          general: "För många inloggningsförsök. Vänligen försök igen senare.",
        });
      } else if (errorMessage.includes("Invalid email")) {
        setErrors({
          ...errors,
          email: "E-postadressen är inte giltig. Försök igen eller skapa ett konto.",
        });
      } else {
        setErrors({
          ...errors,
          general: "Inloggningen misslyckades: " + errorMessage,
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
      <form className="formwrapper" onSubmit={handleSubmit} noValidate>
        <div className="inputSingle">
          <article className="inputHeader">
            <label className="popupTitle" htmlFor="email">
              E-post
            </label>
          </article>
          <input
            id="email"
            name="email"
            type="email"
            className={`inputs ${errors.email && touched.email ? "input-error" : ""}`}
            placeholder="Skriv din inloggningsmail"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {errors.email && touched.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        
        <div className="inputSingle">
          <article className="inputHeader">
            <label className="popupTitle" htmlFor="password">
              Lösenord
            </label>
          </article>
          <input
            id="password"
            name="password"
            type="password"
            className={`inputs ${errors.password && touched.password ? "input-error" : ""}`}
            placeholder="Skriv ditt lösenord"
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
          />
          {errors.password && touched.password && (
            <span className="error-message">{errors.password}</span>
          )}
          <a className="passwordReset" href="">
            Glömt ditt lösenord?
          </a>
        </div>
        
        {errors.general && (
          <p className="error-message">
            {errors.general}
          </p>
        )}

        <footer className="button-group">
          <button type="submit" disabled={isLoading} className="submitButton">
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