"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import RegistrationPopup from "./components/form/RegistrationPopup";
import LoginPopup from "./components/form/LoginPopup";
import { supabase } from "../utils/supabase/client";
import { useSupabaseAuth } from "../hook/useSupabaseAuth";
import EditProfileOverlay from "./components/profile/EditProfileOverlay";
import { Button } from "./components/buttons/Button";
import { useRouter } from "next/navigation";
import { CardCompany } from "./components/cards/CompanyCard";

export default function Home() {
  const landingRef = useRef(null);
  const router = useRouter();
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

  function goToEvent() {
    router.push("/event");
  }

  function goToCompanyPage() {
    router.push("/companies");
  }

  const scrollToLanding = () => {
    landingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <img
              src="/images/yrgo-logo-mobile.svg"
              className={styles.yrgoLogo}
              alt="YRGO logo"
            />
          </div>

          <div className={styles.ellipseTextWrapper}>
            <div className={styles.ellipseMobile}></div>
            <div className={styles.ellipseDesktop}></div>

            <div className={styles.heroTextContainer}>
              <h1 className={styles.mingelstundHeading}>Mingelstund</h1>
              <div className={styles.eventDetails}>
                <p>23 april • 13:00–15:00</p>
                <p>Visual Arena, Göteborg</p>
              </div>
              <div className={styles.footerDesc}>
                <p className={styles.heroDescription}>
                  Välkommen till en avslappnad mingelstund med Yrgos digital
                  designers och webbutvecklare. Upptäck din nästa kollega i en
                  lättsam och personlig miljö.
                </p>
                <Button
                  text="Anmäl dig nu"
                  className={styles.registerButton}
                  onClick={goToEvent}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scrollPrompt}>
          <p>Upptagen 23 april?</p>
          <Button
            className={styles.scrollButton}
            onClick={scrollToLanding}
            text="Skrolla ner"
          />
        </div>
      </div>

      <div className={styles.sectionWrapper}>
        <section className={styles.mainContentWrapper} ref={landingRef}>
          <div className={styles.ctaText}>
            <h2>Skapa er företagsprofil och bli upptäckt i vårt nätverk.</h2>
            <p>
              Bli upptäckt av Yrgos digital designers och webbutvecklare. Bli
              kontaktad av relevanta praktikanter.
            </p>
            <p>Spara tid och stärk branschens framtid.</p>
            <Button
              text="Skapa företagsprofil"
              className={styles.createProfileButton}
              onClick={handleShowRegistration}
            />
          </div>
          <div className={styles.companyList}>
            <CardCompany
              logoUrl="/images/grebban.svg"
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company="Grebban"
              headerClassName="design-component-instance-node"
              location="Göteborg"
              statusProperty="internship-matching"
              id="/"
              showApply={true}
              showLogotype={true}
            />
            <CardCompany
              logoUrl="/images/hiq.svg"
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company="HiQ"
              headerClassName="design-component-instance-node"
              location="Göteborg"
              statusProperty="internship-matching"
              id="/"
              showApply={true}
              showLogotype={true}
            />
            <CardCompany
              logoUrl="/images/simmalugnt.svg"
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company="Simma Lugnt"
              headerClassName="design-component-instance-node"
              location="Göteborg"
              statusProperty="internship-matching"
              id="/"
              showApply={true}
              showLogotype={true}
            />
            <Button
              className="no-frame"
              text="Till företagslistan"
              style={{ textDecoration: "underline" }}
              onClick={goToCompanyPage}
            />
          </div>
        </section>
      </div>
      {showEditPopup && (
        <EditProfileOverlay
          isOpen={showEditPopup}
          onClose={() => setShowEditPopup(false)}
          companyId={companyId}
        />
      )}

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
    </div>
  );
}
