"use client";

import { useState } from "react";
import styles from "../../page.module.css";
import Link from "next/link";
import LoginPopup from "../form/LoginPopup";
import RegistrationPopup from "../form/RegistrationPopup";

export default function Header({ metadata }) {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleShowLogin = () => {
    setShowRegistrationPopup(false);
    setShowLoginPopup(true);
  };

  const handleShowRegistration = () => {
    setShowRegistrationPopup(true);
    setShowLoginPopup(false);
  };

  return (
    <header>
      {metadata?.title} by {metadata?.organization}
      <nav>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => setShowLoginPopup(true)}>
            Logga in
          </button>
        </div>

        {showLoginPopup && (
          <LoginPopup
            isOpen={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
            onShowRegistration={handleShowRegistration}
          />
        )}

        {showRegistrationPopup && (
          <RegistrationPopup
            isOpen={showRegistrationPopup}
            onClose={() => setShowRegistrationPopup(false)}
            onShowLogin={handleShowLogin}
          />
        )}
      </nav>
    </header>
  );
}
