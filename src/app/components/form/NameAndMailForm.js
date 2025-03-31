"use client";

import { login, signup } from "../../login/actions";
import { useContext, useState } from "react";
import { FormContext } from "./FormContext";
import { useRouter } from "next/navigation";
import { createAccount } from "../../login/actions";

export function CustomNameAndMailForm({ goToNextStep, onLoginClick }) {
  const { updateFormData } = useContext(FormContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({ password, email });
    goToNextStep();
  };

  const handleCreateAccount = async (formData) => {
    const result = await createAccount(formData);

    if (result.success) {
      goToNextStep();
    } else {
      setError(result.error || "An error occurred during account creation");
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <>
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
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input id="checkbox" name="checkbox" type="checkbox" required />
        <label htmlFor="checkbox">Jag godkänner</label>
        <a href="">sekretesspolicy</a>

        <div className="button-group">
          <button formAction={handleCreateAccount}>
            Skapa Företagsprofil
          </button>
        </div>
        <div className="auth-buttons">
          <button
            type="button"
            className="login-btn"
            onClick={handleLoginClick}
          >
            Logga in
          </button>
        </div>
      </form>
    </>
  );
}