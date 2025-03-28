"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import RegistrationPopup from "./components/form/RegistrationPopup";
import LoginPopup from "./components/form/LoginPopup";
import { useSupabaseAuth } from "../hook/useSupabaseAuth";

export default function Home() {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user } = useSupabaseAuth();

  const handleShowLogin = () => {
    setShowRegistrationPopup(false);
    setShowLoginPopup(true);
  };

  const handleShowRegistration = () => {
    setShowRegistrationPopup(true);
    setShowLoginPopup(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Träffa nya talanger på mingel-event</h1>

        {user ? (
          <button className={styles.a}>
            Hantera ditt företag
          </button>
        ) : (
          <button
            className={styles.a}
            onClick={() => setShowRegistrationPopup(true)}
          >
            Skriv upp ditt företag
          </button>
        )}

        <Link href="/companies" className={styles.a}>
          Upptäck LIA-platser
        </Link>

        {/* Registration Popup */}
        {showRegistrationPopup && (
          <RegistrationPopup
            isOpen={showRegistrationPopup}
            onClose={() => setShowRegistrationPopup(false)}
            onShowLogin={handleShowLogin}
          />
        )}

        {/* Login Popup */}
        {showLoginPopup && (
          <LoginPopup
            isOpen={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
            onShowRegistration={handleShowRegistration}
          />
        )}
      </main>
    </div>
  );
}
