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
import { Button } from "./components/buttons/Button";
import { useRouter } from "next/navigation";
import { CardCompany } from "./components/cards/CompanyCard";
import { useRef } from "react";

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
    <section className={styles.page}>
      <section className={styles.landingPageHero}>
        <div className={styles.spacer}></div>
        <div className={styles.heroContentWrapper}>
          <div className={styles.header}>
          <div className={styles.ellipseMobile}></div>
          <div className={styles.ellipseDesktop}></div>
          <img src="/images/yrgo-logo-mobile.svg" className={styles.yrgoLogo} />
          <h1 className={styles.headLine}>Mingelstund</h1>
          <div className={styles.subheadingMobile}>
            <p>23 april • 13:00–15:00</p>
            <p>Visual Arena, Göteborg</p>
            </div>
            </div>
          <div className={styles.footer}>
            <p>
              Välkommen till en avslappnad mingelstund med Yrgos digital
              designers och webbutvecklare. Upptäck din nästa kollega i en
              lättsam och personlig miljö.
            </p>
            <Button
              text="Anmäl dig nu"
              className={styles.eventButton}
              onClick={goToEvent}
            />
          </div>
        </div>
        <div className={styles.busyContentWrapper}>
          Upptagen 23 april?{" "}
          <Button
            className={styles.scrollButton}
            onClick={scrollToLanding}
            text="Scrolla ner"
          />
        </div>
      </section>
      <section className={styles.mainContentWrapper} ref={landingRef}>
        <div className={styles.ctaText}>
          <h3>Skapa er företagsprofil och bli upptäckt i vårt nätverk.</h3>
          <p>
            Bli upptäckt av Yrgos digital designers och webbutvecklare. Bli
            kontaktad av relevanta praktikanter.{" "}
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
            logoUrl=" /images/grebban.svg"
            applyNowClassName="card-company-2"
            className="card-company-instance"
            company="Grebban"
            headerClassName="design-component-instance-node"
            location="Göteborg"
            statusProperty="internship-matching"
            id="/"
            showApply={true}
            showLogotype={true}
          ></CardCompany>
          <CardCompany
            logoUrl=" /images/hiq.svg"
            applyNowClassName="card-company-2"
            className="card-company-instance"
            company="HiQ"
            headerClassName="design-component-instance-node"
            location="Göteborg"
            statusProperty="internship-matching"
            id="/"
            showApply={true}
            showLogotype={true}
          ></CardCompany>
          <CardCompany
            logoUrl=" /images/simmalugnt.svg"
            applyNowClassName="card-company-2"
            className="card-company-instance"
            company="Simma Lugnt"
            headerClassName="design-component-instance-node"
            location="Göteborg"
            statusProperty="internship-matching"
            id="/"
            showApply={true}
            showLogotype={true}
          ></CardCompany>
          <Button
            className="no-frame"
            text="Till företagslistan"
            style={{ textDecoration: "underline" }}
            onClick={goToCompanyPage}
          ></Button>
        </div>
      </section>

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
    </section>
  );
}
