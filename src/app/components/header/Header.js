"use client";

import { useState } from "react";
import styles from "../../page.module.css";
import Link from "next/link";
import LoginPopup from "../form/LoginPopup";

export default function Header({ metadata }) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
  
    <header>
      {metadata.title} by {metadata.organization}
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
          />
        )}
      </nav>
      </header>
      
  );
}
