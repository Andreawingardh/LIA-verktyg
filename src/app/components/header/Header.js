"use client";

import { useState, useEffect } from "react";
import LoginPopup from "../form/LoginPopup";
import RegistrationPopup from "../form/RegistrationPopup";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { logout } from "../../login/actions"; 
import styles from "./Header.module.css";


export default function Header({ metadata }) {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
 
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleShowLogin = () => {
    setShowRegistrationPopup(false);
    setShowLoginPopup(true);
  };

  const handleShowRegistration = () => {
    setShowRegistrationPopup(true);
    setTimeout(() => {
      setShowLoginPopup(false);
    }, 50);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      await supabase.auth.signOut();
      router.refresh();
    }
  };

  return (
    <header>
      <div className={styles.headerContent || ""}>
        <div className={styles.brand || ""}>
          {metadata?.title} by {metadata?.organization}
        </div>
        
        <nav>
          <div className="auth-buttons">
            {loading ? (
              <span>Loading...</span>
            ) : user ? (
              <div className={styles.userContainer || ""}>
                <span className={styles.userEmail || ""}>{user.email}</span>
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                >
                  Logga ut
                </button>
              </div>
            ) : (
              <button 
                className="login-btn" 
                onClick={() => setShowLoginPopup(true)}
              >
                Logga in
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Login Popup */}
      {showLoginPopup && !user && (
        <LoginPopup
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onShowRegistration={handleShowRegistration}
        />
      )}

      {/* Registration Popup */}
      {showRegistrationPopup && !user && (
        <RegistrationPopup
          isOpen={showRegistrationPopup}
          onClose={() => setShowRegistrationPopup(false)}
          onShowLogin={handleShowLogin}
        />
      )}
    </header>
  );
}