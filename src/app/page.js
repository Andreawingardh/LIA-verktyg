"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from 'react';
import RegistrationPopup from './components/form/RegistrationPopup';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Träffa nya talanger på mingel-event</h1>

        {/* Button that looks like a link to open registration popup */}
        <button 
          className={styles.a} 
          onClick={() => setShowPopup(true)}
        >
          Skriv upp ditt företag
        </button>
        
        <Link href="/companies" className={styles.a}>Upptäck LIA-platser</Link>

        {/* Registration popup */}
        {showPopup && (
          <RegistrationPopup 
            isOpen={showPopup} 
            onClose={() => setShowPopup(false)} 
          />
        )}
      </main>
    </div>
  );
}