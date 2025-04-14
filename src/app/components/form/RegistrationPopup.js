"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase/client";
import "./popup.css";

export default function RegistrationPopup({ isOpen, onClose, onShowLogin }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Password requirements
  const passwordRequirements = {
    minLength: 8,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  };

  const handleLoginClick = () => {
    onClose();
    if (onShowLogin) {
      onShowLogin();
    }
  };

  const validateCheckbox = () => {
    if (!checkbox) {
      setErrors((prev) => ({
        ...prev,
        checkbox: "Du måste godkänna sekretesspolicyn för att fortsätta.",
      }));
      return false;
    } else {
      setErrors((prev) => {
        const { checkbox, ...rest } = prev;
        return rest;
      });
      return true;
    }
  };

  const validateEmail = () => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Mail följer inte rätt format. Exempel:",
        }));
        return false;
      } else {
        // Clear email error if valid
        setErrors((prev) => {
          const { email, ...rest } = prev;
          return rest;
        });
        return true;
      }
    }
    return true;
  };

  const validatePassword = () => {
    if (password) {
      const missingRequirements = [];
      let isValid = true;

      if (password.length < passwordRequirements.minLength) {
        missingRequirements.push("minLength");
        isValid = false;
      }

      if (!/[A-Z]/.test(password)) {
        missingRequirements.push("uppercase");
        isValid = false;
      }

      if (!/[a-z]/.test(password)) {
        missingRequirements.push("lowercase");
        isValid = false;
      }

      if (!/\d/.test(password)) {
        missingRequirements.push("number");
        isValid = false;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        missingRequirements.push("special");
        isValid = false;
      }

      if (!isValid) {
        setErrors((prev) => ({
          ...prev,
          password: "Lösenordet uppfyller inte kraven",
          passwordRequirements: missingRequirements,
        }));
        return false;
      } else {
        // Clear password error if valid
        setErrors((prev) => {
          const { password, passwordRequirements, ...rest } = prev;
          return rest;
        });
        return true;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate both fields on submit
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isCheckboxValid = validateCheckbox();

    if (!isEmailValid || !isPasswordValid || !isCheckboxValid || redirecting) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        checkbox,
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already in use")
        ) {
          setErrors({
            ...errors,
            email: "E-postadress används redan av ett annat konto",
          });
        } else if (
          error.message.includes("email") ||
          error.message.includes("Email")
        ) {
          setErrors({ ...errors, email: error.message });
        } else if (
          error.message.includes("password") ||
          error.message.includes("Password")
        ) {
          setErrors({ ...errors, password: error.message });
        } else if (
          error.message.includes("too many requests") ||
          error.message.includes("rate limit")
        ) {
          setErrors({
            ...errors,
            general: "För många försök. Vänligen försök igen senare.",
          });
        } else if (
          error.message.includes("checkbox") ||
          error.message.includes("Checkbox")
        ) {
          setErrors({
            ...errors,
            checkbox: error.message,
          });
        } else {
          setErrors({ ...errors, general: error.message });
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
      if (!errors.email && !errors.password) {
        setErrors({
          ...errors,
          general: err.message || "Ett fel uppstod vid registrering",
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
              className={`inputs ${errors.email ? "input-error" : ""}`}
              
              placeholder="Skriv din inloggningsmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              disabled={loading}
            />

            {errors.email && (
              <div className="email-error-container">
                <p className="error-message">{errors.email}</p>
                {errors.email === "Mail följer inte rätt format. Exempel:" && (
                  <ul className="password-requirements">
                    <li className="requirement-error">exempel@exempel.com</li>
                  </ul>
                )}
              </div>
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
              className={`inputs ${errors.password ? "input-error" : ""}`}
    
              placeholder="Skriv ett starkt lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              disabled={loading}
            />
          </div>

          <div className="password-requirements-container">
            {errors.password && errors.passwordRequirements && (
              <>
                <p className="password-requirements-heading">
                  Lösenordet behöver innehålla:
                </p>
                <ul className="password-requirements">
                  {errors.passwordRequirements.includes("minLength") && (
                    <li className="requirement-error">
                      Minst {passwordRequirements.minLength} karaktärer
                    </li>
                  )}
                  {errors.passwordRequirements.includes("uppercase") && (
                    <li className="requirement-error">
                      Minst 1 stor bokstav (A, B, C)
                    </li>
                  )}
                  {errors.passwordRequirements.includes("number") && (
                    <li className="requirement-error">
                      Minst 1 nummer (1, 2, 3)
                    </li>
                  )}
                  {errors.passwordRequirements.includes("special") && (
                    <li className="requirement-error">
                      Minst 1 symbol (!, *, #)
                    </li>
                  )}
                </ul>
              </>
            )}
            <div className="checkbox-group">
              <input
                id="checkbox"
                name="checkbox"
                type="checkbox"
                className={`checkbox ${
                  errors.checkbox ? "checkbox-error" : ""
                }`}
                checked={checkbox}
                onChange={(e) => setCheckbox(e.target.checked)}
                onBlur={() => validateCheckbox()}
              
              />
              <label className="gdpr-text" htmlFor="checkbox">
                Jag godkänner{" "}
                <a className="gdpr" href="/privacy-policy">
                  sekretesspolicy
                </a>
                <span className="asterix"> *</span>
              </label>
            </div>

            {errors.checkbox && (
              <div className="email-error-container">
                <p className="error-message">{errors.checkbox}</p>
              </div>
            )}
          </div>

          {errors.general && <p className="error-message">{errors.general}</p>}

          <footer className="button-group">
            <button
              type="submit"
              id="createButton"
              disabled={loading || redirecting}
              className={
                Object.keys(errors).length > 0 ? "button-disabled" : ""
              }
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
