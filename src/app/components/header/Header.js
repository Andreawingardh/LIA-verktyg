"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { logout } from "../../login/actions";
import LoginPopup from "../form/LoginPopup";
import RegistrationPopup from "../form/RegistrationPopup";
import styles from "./Header.module.css";

export default function Header({ metadata }) {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 960);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";

      const menuElement = menuRef.current;
      if (menuElement) {
        const focusableElements = menuElement.querySelectorAll(
          'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          focusableElements[0].focus();

          const handleTabKey = (e) => {
            if (e.key === "Tab") {
              const firstElement = focusableElements[0];
              const lastElement =
                focusableElements[focusableElements.length - 1];

              if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
              else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }

            if (e.key === "Escape") {
              setIsMenuOpen(false);
              menuButtonRef.current?.focus();
            }
          };

          menuElement.addEventListener("keydown", handleTabKey);
          return () => menuElement.removeEventListener("keydown", handleTabKey);
        }
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleShowLogin = () => {
    setShowRegistrationPopup(false);
    setShowLoginPopup(true);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleShowRegistration = () => {
    setShowRegistrationPopup(true);
    setTimeout(() => {
      setShowLoginPopup(false);
    }, 50);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      await supabase.auth.signOut();
      router.refresh();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileButtonClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }

    if (user) {
      router.push("/dashboard");
    } else {
      handleShowRegistration();
    }
  };

  const InternifyLogo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="98"
      height="24"
      viewBox="0 0 98 24"
      fill="none"
      aria-hidden="true"
      role="img"
    >
      <title>Internify Logo</title>
      <path
        d="M86.1708 23.9345C79.6506 23.9345 74.3447 18.5674 74.3447 11.9689C74.3447 9.75024 74.9486 7.5841 76.0921 5.70457C76.5003 5.0322 77.3743 4.81961 78.0477 5.22769C78.7172 5.63677 78.9315 6.5124 78.5231 7.1835C77.6503 8.61794 77.1896 10.2715 77.1896 11.9689C77.1896 16.9966 81.2174 21.0883 86.1708 21.0883C91.1242 21.0883 95.1556 16.9966 95.1556 11.9689C95.1556 6.94125 91.124 2.84614 86.1708 2.84614C84.7234 2.84741 83.3431 3.18529 82.068 3.85244C81.3704 4.218 80.512 3.9451 80.1493 3.249C79.7851 2.55261 80.055 1.6928 80.7508 1.32822C82.4119 0.460914 84.2869 0.00127129 86.1697 0C92.6937 0 98.0001 5.36838 98.0001 11.9689C98.0001 18.5695 92.6937 23.9345 86.1708 23.9345Z"
        fill="#E51236"
      />
      <path
        d="M68.5436 11.8418H62.7819C61.9969 11.8418 61.3594 12.4783 61.3594 13.2652C61.3594 14.0521 61.9969 14.6881 62.7819 14.6881H67.1206V21.8789C67.1206 22.6651 67.7568 23.3025 68.5435 23.3025C69.3301 23.3025 69.966 22.6651 69.966 21.8789V13.2652C69.966 12.4783 69.3281 11.8418 68.5435 11.8418"
        fill="#E51236"
      />
      <path
        d="M61.5071 24.0005C54.9839 24.0005 49.6782 18.6319 49.6782 12.0312C49.6782 5.43056 54.9838 0.0654297 61.5071 0.0654297C64.0753 0.0654297 66.519 0.885272 68.5747 2.43766C69.2009 2.91072 69.3244 3.80416 68.853 4.43076C68.38 5.05779 67.4883 5.18379 66.8602 4.70917C65.302 3.53351 63.4516 2.91171 61.5073 2.91171C56.5538 2.91171 52.5224 7.00315 52.5224 12.0312C52.5224 17.0593 56.5538 21.1545 61.5073 21.1545C62.1337 21.1545 62.7657 21.0875 63.3823 20.9554C64.155 20.7842 64.9074 21.2802 65.0715 22.0493C65.2355 22.818 64.7466 23.5736 63.9768 23.7383C63.1658 23.9126 62.3336 24.0005 61.5073 24.0005"
        fill="#E51236"
      />
      <path
        d="M44.3968 23.2829C44.0329 23.2829 43.6686 23.1442 43.3912 22.866L39.1057 18.5754C38.5517 18.0199 38.5517 17.1175 39.1077 16.5637C39.6631 16.0074 40.5631 16.0074 41.1185 16.5637L45.4038 20.8536C45.9578 21.4097 45.9578 22.312 45.4022 22.866C45.1242 23.1442 44.7608 23.2829 44.3968 23.2829Z"
        fill="#E51236"
      />
      <path
        d="M38.6292 0.688477H28.4949C27.9041 0.688477 27.3984 1.04755 27.1832 1.55959C27.106 1.7356 27.0615 1.92883 27.0615 2.13266V21.8185C27.0615 22.6051 27.6975 23.2419 28.4839 23.2419C29.2703 23.2419 29.9062 22.6051 29.9062 21.8185V3.53532H38.6292C41.0139 3.53532 42.9548 5.47616 42.9548 7.86393C42.9548 10.2517 41.0139 12.1931 38.6292 12.1931H33.6483C32.8619 12.1931 32.2257 12.8297 32.2257 13.6164C32.2257 14.403 32.8619 15.0397 33.6483 15.0397H38.6292C42.5821 15.0397 45.7996 11.8203 45.7996 7.86393C45.7996 3.90753 42.5821 0.688477 38.6292 0.688477Z"
        fill="#E51236"
      />
      <path
        d="M11.5414 23.2405C10.7559 23.2405 10.1191 22.6037 10.1191 21.8172V13.3171C10.1191 12.5313 10.7559 11.8945 11.5414 11.8945C12.3269 11.8945 12.9642 12.5313 12.9642 13.3171V21.8172C12.9642 22.6037 12.3271 23.2405 11.5414 23.2405Z"
        fill="#E51236"
      />
      <path
        d="M14.5131 9.62678C14.1055 9.62678 13.7007 9.45177 13.4198 9.11459C12.9165 8.50932 12.9995 7.6132 13.6029 7.10991L20.8938 1.03977C21.4971 0.536622 22.3935 0.617985 22.8961 1.22354C23.3992 1.82755 23.3168 2.72395 22.7129 3.22639L15.4226 9.29794C15.1566 9.51858 14.8343 9.62678 14.5131 9.62678Z"
        fill="#E51236"
      />
      <path
        d="M8.71715 9.62628C8.3961 9.62628 8.07407 9.51807 7.80823 9.29743L0.512763 3.22589C-0.090922 2.72486 -0.173512 1.8269 0.328665 1.22304C0.8307 0.619033 1.72832 0.536117 2.33215 1.03927L9.62762 7.1094C10.2309 7.61128 10.3139 8.50881 9.81172 9.11409C9.5302 9.45126 9.12488 9.62628 8.71715 9.62628Z"
        fill="#E51236"
      />
    </svg>
  );

  return (
    <header className={styles.header} role="banner">
      <div className={styles.navContainer}>
        {/* Mobile view */}
        {isMobile && (
          <div className={styles.mobileHeader}>
            <div className={styles.mobileTop}>
              <div className={styles.logo}>
                <Link
                  className={styles.linkWrapper}
                  href="/"
                  aria-label="Internify Home"
                >
                  <span className={styles.logoText} aria-hidden="true">
                    <InternifyLogo />
                  </span>
                  <span className={styles.logoSub}>Internify</span>
                </Link>
              </div>
              <div className={styles.menuWrapper}>
                <button
                  className={`${styles.menuButton} ${
                    isMenuOpen ? styles.menuButtonOpen : ""
                  }`}
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  ref={menuButtonRef}
                >
                  {isMenuOpen ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.02876 3.52827C4.28911 3.26792 4.71122 3.26792 4.97157 3.52827L8.50016 7.05687L12.0288 3.52827C12.2891 3.26792 12.7112 3.26792 12.9716 3.52827C13.2319 3.78862 13.2319 4.21073 12.9716 4.47108L9.44297 7.99967L12.9716 11.5283C13.2319 11.7886 13.2319 12.2107 12.9716 12.4711C12.7112 12.7314 12.2891 12.7314 12.0288 12.4711L8.50016 8.94248L4.97157 12.4711C4.71122 12.7314 4.28911 12.7314 4.02876 12.4711C3.76841 12.2107 3.76841 11.7886 4.02876 11.5283L7.55735 7.99967L4.02876 4.47108C3.76841 4.21073 3.76841 3.78862 4.02876 3.52827Z"
                          fill="#0F1314"
                        />
                      </svg>
                      <span>Stäng</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.3335 3.99967C1.3335 3.63148 1.63197 3.33301 2.00016 3.33301H14.0002C14.3684 3.33301 14.6668 3.63148 14.6668 3.99967C14.6668 4.36786 14.3684 4.66634 14.0002 4.66634H2.00016C1.63197 4.66634 1.3335 4.36786 1.3335 3.99967ZM1.3335 7.99967C1.3335 7.63148 1.63197 7.33301 2.00016 7.33301H14.0002C14.3684 7.33301 14.6668 7.63148 14.6668 7.99967C14.6668 8.36786 14.3684 8.66634 14.0002 8.66634H2.00016C1.63197 8.66634 1.3335 8.36786 1.3335 7.99967ZM1.3335 11.9997C1.3335 11.6315 1.63197 11.333 2.00016 11.333H14.0002C14.3684 11.333 14.6668 11.6315 14.6668 11.9997C14.6668 12.3679 14.3684 12.6663 14.0002 12.6663H2.00016C1.63197 12.6663 1.3335 12.3679 1.3335 11.9997Z"
                          fill="#0F1314"
                        />
                      </svg>
                      <span>Meny</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <nav
              id="mobile-menu"
              className={`${styles.mobileNav} ${
                isMenuOpen ? styles.mobileNavOpen : styles.mobileNavClosed
              }`}
              aria-label="Mobile Navigation"
              aria-hidden={!isMenuOpen}
              ref={menuRef}
            >
              <ul className={styles.mobileNavList}>
                <li className={styles.mobileNavItem}>
                  <Link
                    href="/"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Mingelevent</span>
                    <span className={styles.arrow} aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289L19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071L12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071C10.9024 19.3166 10.9024 18.6834 11.2929 18.2929L16.5858 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H16.5858L11.2929 5.70711C10.9024 5.31659 10.9024 4.68342 11.2929 4.29289Z"
                          fill="#0F1314"
                        />
                      </svg>
                    </span>
                  </Link>
                </li>
                <li className={styles.mobileNavItem}>
                  <Link
                    href="/companies"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Företagslistan</span>
                    <span className={styles.arrow} aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289L19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071L12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071C10.9024 19.3166 10.9024 18.6834 11.2929 18.2929L16.5858 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H16.5858L11.2929 5.70711C10.9024 5.31659 10.9024 4.68342 11.2929 4.29289Z"
                          fill="#0F1314"
                        />
                      </svg>
                    </span>
                  </Link>
                </li>
              </ul>

              <div className={styles.mobileButtons}>
                {loading ? (
                  <div className={styles.loading} aria-live="polite">
                    Loading...
                  </div>
                ) : (
                  <>
                    {user ? (
                      <span
                        className={styles.userEmail}
                        aria-label="Logged in as"
                      >
                        {user.email}
                      </span>
                    ) : (
                      <h4 className={styles.mobileButtonHeading}>
                        Bli upptäckt av Yrgos elever!
                      </h4>
                    )}

                    <div className={styles.mobileButtonsWrapper}>
                      <button
                        className={styles.createProfileButton}
                        onClick={handleProfileButtonClick}
                      >
                        {user ? "Din företagsprofil" : "Skapa företagsprofil"}
                      </button>

                      {user ? (
                        <button
                          className={styles.logoutButton}
                          onClick={handleLogout}
                        >
                          Logga ut
                        </button>
                      ) : (
                        <button
                          className={styles.loginButton}
                          onClick={handleShowLogin}
                        >
                          Logga in
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Desktop view */}
        {!isMobile && (
          <div className={styles.desktopHeader}>
            <div className={styles.desktopWrapper}>
              <div className={styles.desktopContent}>
                <Link
                  className={styles.desktopLogo}
                  href="/"
                  aria-label="Internify Home"
                >
                  <span className={styles.desktopLogoText} aria-hidden="true">
                    <InternifyLogo />
                  </span>
                  <span className={styles.desktopLogoSub}>Internify</span>
                </Link>

                <nav className={styles.desktopNav} aria-label="Main Navigation">
                  <ul className={styles.desktopNavList}>
                    <li className={styles.desktopNavItem}>
                      <Link href="/event" className={styles.desktopNavLink}>
                        Mingelevent
                      </Link>
                    </li>
                    <li className={styles.desktopNavItem}>
                      <Link href="/companies" className={styles.desktopNavLink}>
                        Företagslistan
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div
                className={styles.desktopButtons}
                role="navigation"
                aria-label="User actions"
              >
                {loading ? (
                  <div className={styles.loading} aria-live="polite">
                    Loading...
                  </div>
                ) : (
                  <>
                    {user && (
                      <>
                        <button
                          className={styles.desktopLogoutButton}
                          onClick={handleLogout}
                        >
                          Logga ut
                        </button>

                        <button
                          className={styles.desktopCompanyProfileButton}
                          onClick={handleProfileButtonClick}
                        >
                          Din företagsprofil
                        </button>
                      </>
                    )}

                    {!user && (
                      <>
                        <button
                          className={styles.desktopCreateProfileButton}
                          onClick={handleProfileButtonClick}
                        >
                          Skapa företagsprofil
                        </button>
                        <button
                          className={styles.desktopLoginButton}
                          onClick={handleShowLogin}
                        >
                          Logga in
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login/Registration popups */}
      {showLoginPopup && !user && (
        <LoginPopup
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onShowRegistration={handleShowRegistration}
        />
      )}

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
