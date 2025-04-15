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
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Set up animation end listeners
  useEffect(() => {
    const floatingLogos = document.querySelectorAll(`.${styles.floatingLogo}`);

    // Function to handle animation end
    const handleAnimationEnd = (event) => {
      const logo = event.target;

      // If it was a return animation, reset to floating
      if (logo.classList.contains(styles["scroll-up"])) {
        logo.classList.remove(styles["scroll-up"]);
      }
    };

    // Add animation end listeners to all logos
    floatingLogos.forEach((logo) => {
      logo.addEventListener("animationend", handleAnimationEnd);
    });

    // Cleanup
    return () => {
      floatingLogos.forEach((logo) => {
        logo.removeEventListener("animationend", handleAnimationEnd);
      });
    };
  }, [styles]);

  // Scroll animation effect
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Get the hero container and floating logos
          const heroContainer = document.querySelector(
            `.${styles.heroContainer}`
          );
          const floatingLogos = document.querySelectorAll(
            `.${styles.floatingLogo}`
          );

          if (heroContainer && floatingLogos.length > 0) {
            const heroHeight = heroContainer.offsetHeight;

            // Only apply animations when within or near the hero section
            if (currentScrollY <= heroHeight * 1.2) {
              // Determine scroll direction
              const scrollingDown = currentScrollY > lastScrollY;

              // Apply the appropriate animation to each logo with staggered timing
              floatingLogos.forEach((logo, index) => {
                const delay = index * 80; // Staggered timing

                setTimeout(() => {
                  if (scrollingDown) {
                    // When scrolling down, always fly away
                    logo.classList.remove(styles["scroll-up"]);
                    logo.classList.add(styles["scroll-down"]);
                  } else if (
                    !scrollingDown &&
                    logo.classList.contains(styles["scroll-down"])
                  ) {
                    // Only apply fly-back if previously flying away
                    logo.classList.remove(styles["scroll-down"]);
                    logo.classList.add(styles["scroll-up"]);
                  }
                }, delay);
              });
            }
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, styles]);

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
        <div className={styles.floatingLogoContainer}>
          <div className={styles.floatingLogo}>
            <svg
              viewBox="0 0 200 100"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="100"
                rx="10"
                fill="#2D3748"
              />
              <text
                x="100"
                y="50"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                fontSize="24"
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                CodeCraft
              </text>
              <path
                d="M40,30 L60,50 L40,70"
                stroke="#4FD1C5"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M160,30 L140,50 L160,70"
                stroke="#4FD1C5"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <div className={styles.floatingLogo}>
            <svg
              viewBox="0 0 200 100"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="100"
                rx="0"
                fill="#6B46C1"
              />
              <rect x="30" y="30" width="40" height="40" fill="#9F7AEA" />
              <rect x="70" y="30" width="40" height="40" fill="#F6AD55" />
              <rect x="110" y="30" width="40" height="40" fill="#38B2AC" />
              <text
                x="100"
                y="85"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                fontSize="16"
                fill="white"
                textAnchor="middle"
              >
                PIXEL PERFECT
              </text>
            </svg>
          </div>
          <div className={styles.floatingLogo}>
            <svg
              viewBox="0 0 200 120"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="50" r="50" fill="#F56565" />
              <path
                d="M70,50 L130,50 M100,30 L100,70"
                stroke="white"
                strokeWidth="8"
              />
              <text
                x="100"
                y="110"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                fontSize="24"
                fill="#2D3748"
                textAnchor="middle"
              >
                WebForge
              </text>
            </svg>
          </div>

          <div className={styles.floatingLogo}>
            <svg
              viewBox="0 0 200 100"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="100"
                rx="50"
                fill="#3182CE"
              />
              <circle cx="70" cy="40" r="10" fill="white" />
              <circle cx="130" cy="40" r="10" fill="white" />
              <circle cx="100" cy="70" r="10" fill="white" />
              <line
                x1="70"
                y1="40"
                x2="130"
                y2="40"
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="40"
                x2="100"
                y2="70"
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1="130"
                y1="40"
                x2="100"
                y2="70"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x="100"
                y="95"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                fontSize="18"
                fill="white"
                textAnchor="middle"
              >
                NEXUSWEB
              </text>
            </svg>
          </div>

          <div className={styles.floatingLogo}>
            <svg
              viewBox="0 0 200 100"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="200" height="100" fill="#1A202C" />
              <rect x="45" y="20" width="15" height="15" fill="#48BB78" />
              <rect
                x="65"
                y="20"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.5"
              />
              <rect x="85" y="20" width="15" height="15" fill="#48BB78" />
              <rect
                x="105"
                y="20"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.3"
              />
              <rect x="125" y="20" width="15" height="15" fill="#48BB78" />

              <rect
                x="45"
                y="40"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.2"
              />
              <rect x="65" y="40" width="15" height="15" fill="#48BB78" />
              <rect
                x="85"
                y="40"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.4"
              />
              <rect x="105" y="40" width="15" height="15" fill="#48BB78" />
              <rect
                x="125"
                y="40"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.7"
              />

              <rect x="45" y="60" width="15" height="15" fill="#48BB78" />
              <rect
                x="65"
                y="60"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.6"
              />
              <rect x="85" y="60" width="15" height="15" fill="#48BB78" />
              <rect
                x="105"
                y="60"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.5"
              />
              <rect
                x="125"
                y="60"
                width="15"
                height="15"
                fill="#48BB78"
                opacity="0.2"
              />

              <text
                x="100"
                y="95"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                fontSize="16"
                fill="white"
                textAnchor="middle"
              >
                DEVMATRIX
              </text>
            </svg>
          </div>

          <div className={styles.floatingLogo}>
            <svg
              viewBox="0 0 200 100"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="200" height="100" fill="#DD6B20" />
              <rect x="60" y="25" width="25" height="25" fill="white" />
              <rect
                x="85"
                y="25"
                width="25"
                height="25"
                fill="white"
                opacity="0.7"
              />
              <rect
                x="110"
                y="25"
                width="25"
                height="25"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="60"
                y="50"
                width="25"
                height="25"
                fill="white"
                opacity="0.8"
              />
              <rect
                x="85"
                y="50"
                width="25"
                height="25"
                fill="white"
                opacity="0.6"
              />
              <text
                x="100"
                y="90"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                fontSize="18"
                fill="white"
                textAnchor="middle"
              >
                BYTE BUILDERS
              </text>
            </svg>
          </div>
        </div>
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
              kontaktad av relevanta praktikanter.<br></br>
              Spara tid och stärk branschens framtid.
            </p>
            <Button
              text="Skapa företagsprofil"
              className={styles.createProfileButton}
              onClick={handleShowRegistration}
            />
          </div>
          <div className={styles.companyList}>
            <CardCompany
              logoUrl="images/fakelogos/Codecraft.svg"
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company="Codecraft"
              headerClassName="design-component-instance-node"
              location="Göteborg"
              statusProperty="internship-matching"
              id={64}
              showApply={true}
              showLogotype={true}
            />
            <CardCompany
              logoUrl="images/fakelogos/Pixelperfect.svg"
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company="Pixelperfect"
              headerClassName="design-component-instance-node"
              location="Göteborg"
              statusProperty="internship-matching"
              id={61}
              showApply={true}
              showLogotype={true}
            />
            <CardCompany
              logoUrl="images/fakelogos/Devmatrix.svg"
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company="Devmatrix"
              headerClassName="design-component-instance-node"
              location="Göteborg"
              statusProperty="internship-matching"
              id={67}
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
