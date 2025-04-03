"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import RegistrationPopup from "./components/form/RegistrationPopup";
import LoginPopup from "./components/form/LoginPopup";
import { supabase } from "../utils/supabase/client";
import { useSupabaseAuth } from "../hook/useSupabaseAuth";
import EditProfileOverlay from "./components/profile/EditProfileOverlay";

export default function Home() {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user } = useSupabaseAuth();
  const [companyId, setCompanyId] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("companies")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setCompanyId(data.id);
        }
      }
    };

    fetchCompanyId();
  }, [user]);

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


  
        <Link href="/companies" className={styles.a}>
          Upptäck LIA-platser
        </Link>

         {showEditPopup && (
        <EditProfileOverlay 
        isOpen={showEditPopup} 
        onClose={() => setShowEditPopup(false)} 
        companyId={companyId} 
          />
        )}

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
