"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import RegistrationPopup from "./components/form/RegistrationPopup";

export default function Home() {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Träffa nya talanger på mingel-event</h1>

        <button
          className={styles.a}
          onClick={() => setShowRegistrationPopup(true)}
        >
          Skriv upp ditt företag
        </button>

        <Link href="/companies" className={styles.a}>
          Upptäck LIA-platser
        </Link>



        {showRegistrationPopup && (
          <RegistrationPopup
            isOpen={showRegistrationPopup}
            onClose={() => setShowRegistrationPopup(false)}
          />
        )}

       
      </main>
      
    </div>
  );
}
