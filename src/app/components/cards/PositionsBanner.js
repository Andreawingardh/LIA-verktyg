"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/components/cards/PositionsBanner.module.css";
import { supabase } from "@/utils/supabase/client";
import { Button } from "../buttons/Button";
import "@/app/components/buttons/button.css";
import RegistrationPopup from "../form/RegistrationPopup";
import Link from "next/link";
import LoginPopup from "../form/LoginPopup";

export const PositionsBanner = () => {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [fetchData, setFetchData] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleShowRegistration = () => {
    setShowRegistrationPopup(true);
    setShowLoginPopup(false);
  };

  const handleShowLogin = () => {
    setShowRegistrationPopup(false);
    setShowLoginPopup(true);
  };

  async function fetchCompanies() {
    try {
      const { data, error } = await supabase.from("companies").select();

      if (error) throw new Error();

      if (data) {
        setCompaniesData(data);
        setFetchData(false);
        return companiesData;
      }
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    if (fetchData) {
      fetchCompanies();
    }
  }, [fetchData]);

  if (error) {
    return (<div>{error}</div>)
  }

  return (
    <div className={styles.positionsBannerWrapper}>
      <section className={styles.positionsBanner}>
        <h1>Vill du också synas här och matchas med framtida kollegor?</h1>
        <p>Deltagande företag</p>
        <div className={styles.rollingBannerContent}>
          <div className={styles.rollingBannerImageWrapper}>
            {companiesData.map((company) =>
              company.logo_url != null ? (
                <img
                  key={`first-${company.id}`}
                  src={company.logo_url}
                  alt={company.name || "Company logo"}
                />
              ) : null
            )}
            {companiesData.map((company) =>
              company.logo_url != null ? (
                <img
                  key={`first-${company.id}`}
                  src={company.logo_url}
                  alt={company.name || "Company logo"}
                />
              ) : null
            )}
          </div>
        </div>

        {!isLoading && !user && (
          <Button
            text="Skapa företagsprofil"
            className="light-button"
            onClick={() => setShowRegistrationPopup(true)}
          />
        )}

        <Link href="/companies" className="no-frame">Gå till företagslistan<svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.00016 2.33301C4.59441 2.33301 1.8335 5.09392 1.8335 8.49967C1.8335 11.9054 4.59441 14.6663 8.00016 14.6663C11.4059 14.6663 14.1668 11.9054 14.1668 8.49967C14.1668 5.09392 11.4059 2.33301 8.00016 2.33301ZM0.833496 8.49967C0.833496 4.54163 4.04212 1.33301 8.00016 1.33301C11.9582 1.33301 15.1668 4.54163 15.1668 8.49967C15.1668 12.4577 11.9582 15.6663 8.00016 15.6663C4.04212 15.6663 0.833496 12.4577 0.833496 8.49967ZM7.6466 5.47945C7.84186 5.28419 8.15844 5.28419 8.3537 5.47945L11.0204 8.14612C11.1141 8.23989 11.1668 8.36706 11.1668 8.49967C11.1668 8.63228 11.1141 8.75946 11.0204 8.85323L8.3537 11.5199C8.15844 11.7152 7.84186 11.7152 7.6466 11.5199C7.45134 11.3246 7.45134 11.008 7.6466 10.8128L9.45971 8.99967L5.33349 8.99966C5.05735 8.99966 4.8335 8.7758 4.8335 8.49966C4.8335 8.22352 5.05735 7.99966 5.3335 7.99966L9.45971 7.99967L7.6466 6.18656C7.45134 5.9913 7.45134 5.67472 7.6466 5.47945Z"
                  fill="#00287E"
                />
              </svg>
        </Link>

        {/* Registration Popup */}
        {showRegistrationPopup && (
          <RegistrationPopup
            isOpen={showRegistrationPopup}
            onClose={() => setShowRegistrationPopup(false)}
            onShowLogin={handleShowLogin}
          />
        )}

        {showLoginPopup && (
          <LoginPopup
            isOpen={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
            onShowRegistration={handleShowRegistration}
          />
        )}
      </section>
    </div>
  );
};
