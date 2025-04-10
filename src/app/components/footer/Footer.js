"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import RegistrationPopup from "../form/RegistrationPopup";
import LoginPopup from "../form/LoginPopup";
import Image from "next/image";

const Footer = () => {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleShowLogin = () => {
    setShowRegistrationPopup(false);
    setShowLoginPopup(true);
  };

  const handleShowRegistration = () => {
    setShowRegistrationPopup(true);
    setShowLoginPopup(false);
  };

  const students = [
    {
      id: 1,
      name: "Andrea Wingårdh",
      role: "Webbutvecklare",
      profileUrl: "#",
      avatar: "/images/Card/Andrea-avatar.png",
    },
    {
      id: 2,
      name: "Linnéa Malmström",
      role: "Digital Designer",
      profileUrl: "#",
      avatar: "/images/Card/Linnea-avatar.png",
    },
    {
      id: 3,
      name: "Mahtias Jebrand",
      role: "Webbutvecklare",
      profileUrl: "#",
      avatar: "/images/Card/Mahtias-avatar.png",
    },
    {
      id: 4,
      name: "Markus Zeljak",
      role: "Digital Designer",
      profileUrl: "#",
      avatar: "/images/Card/Markus-avatar.png",
    },
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
     

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

      <section className={styles.teamContainer} aria-labelledby="team-heading">
        <div className={styles.teamSection}>
          <h2 id="team-heading" className={styles.teamHeading}>
            Tjänst skapad av följande studerande vid Yrgo
          </h2>

          <ul className={styles.teamList}>
            {students.map((student) => (
              <li key={student.id} className={styles.teamMember}>
                <article className={styles.memberCard}>
                  <div className={styles.memberAvatar} aria-hidden="true">
                    <Image
                      src={student.avatar}
                      alt=""
                      fill
                      className={styles.avatarImage}
                      sizes="width: 100vw, height: 100vh"
                    />
                  </div>
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>{student.name}</h3>
                    <p className={styles.memberRole}>{student.role}</p>
                    <Link
                      href={student.profileUrl}
                      className={styles.memberLink}
                    >
                      <span>
                        Se min profil
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.6665 5.16602C4.39036 5.16602 4.1665 4.94216 4.1665 4.66602C4.1665 4.38987 4.39036 4.16602 4.6665 4.16602H11.3332C11.6093 4.16602 11.8332 4.38987 11.8332 4.66602V11.3327C11.8332 11.6088 11.6093 11.8327 11.3332 11.8327C11.057 11.8327 10.8332 11.6088 10.8332 11.3327V5.87312L5.02006 11.6862C4.8248 11.8815 4.50821 11.8815 4.31295 11.6862C4.11769 11.491 4.11769 11.1744 4.31295 10.9791L10.1261 5.16602H4.6665Z"
                            fill="#00287E"
                          />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.siteContainer}>
        <div className={styles.siteInfoSection}>
          <div className={styles.siteInfoLayout}>
            <div className={styles.brandInfo}>
              <div className={styles.brandLogo} aria-label="Yrgo logotyp">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="180"
                  height="44"
                  viewBox="0 0 180 44"
                  fill="none"
                >
                  <path
                    d="M157.979 43.8798C146.026 43.8798 136.298 34.0401 136.298 21.943C136.298 17.8754 137.405 13.9042 139.502 10.4584C140.25 9.22569 141.853 8.83595 143.087 9.5841C144.315 10.3341 144.707 11.9394 143.959 13.1698C142.359 15.7996 141.514 18.831 141.514 21.943C141.514 31.1604 148.898 38.6619 157.979 38.6619C167.061 38.6619 174.452 31.1604 174.452 21.943C174.452 12.7256 167.06 5.21792 157.979 5.21792C155.326 5.22025 152.795 5.8397 150.458 7.0628C149.179 7.73301 147.605 7.23268 146.94 5.95649C146.272 4.67979 146.767 3.10346 148.043 2.43506C151.088 0.845009 154.526 0.0023307 157.977 0C169.938 0 179.667 9.84203 179.667 21.943C179.667 34.044 169.938 43.8798 157.979 43.8798Z"
                    fill="#E51236"
                  />
                  <path
                    d="M125.664 21.7109H115.101C113.662 21.7109 112.493 22.8778 112.493 24.3205C112.493 25.7633 113.662 26.9291 115.101 26.9291H123.055V40.1123C123.055 41.5538 124.221 42.7222 125.663 42.7222C127.106 42.7222 128.271 41.5538 128.271 40.1123V24.3205C128.271 22.8778 127.102 21.7109 125.663 21.7109"
                    fill="#E51236"
                  />
                  <path
                    d="M112.763 44C100.804 44 91.0767 34.1577 91.0767 22.0565C91.0767 9.95522 100.803 0.119141 112.763 0.119141C117.471 0.119141 121.951 1.62218 125.72 4.46823C126.868 5.33551 127.095 6.97347 126.23 8.12225C125.363 9.2718 123.729 9.5028 122.577 8.63267C119.72 6.47729 116.328 5.33732 112.763 5.33732C103.682 5.33732 96.291 12.8383 96.291 22.0565C96.291 31.2747 103.682 38.7824 112.763 38.7824C113.912 38.7824 115.07 38.6596 116.201 38.4175C117.617 38.1036 118.997 39.0128 119.298 40.4229C119.598 41.8322 118.702 43.2174 117.291 43.5194C115.804 43.8389 114.278 44 112.763 44"
                    fill="#E51236"
                  />
                  <path
                    d="M81.3943 42.685C80.7271 42.685 80.0593 42.4306 79.5507 41.9207L71.6939 34.0546C70.6783 33.0361 70.6783 31.3818 71.6975 30.3664C72.7158 29.3466 74.3658 29.3466 75.384 30.3664L83.2406 38.2312C84.2562 39.2508 84.2562 40.9051 83.2374 41.9207C82.7278 42.4306 82.0616 42.685 81.3943 42.685"
                    fill="#E51236"
                  />
                  <path
                    d="M70.8203 1.26367H52.2407C51.1575 1.26367 50.2304 1.92197 49.8359 2.86072C49.6943 3.18339 49.6128 3.53766 49.6128 3.91135V40.002C49.6128 41.4442 50.7788 42.6116 52.2205 42.6116C53.6622 42.6116 54.828 41.4442 54.828 40.002V6.48289H70.8203C75.1922 6.48289 78.7506 10.0411 78.7506 14.4187C78.7506 18.7962 75.1922 22.3555 70.8203 22.3555H61.6885C60.2468 22.3555 59.0805 23.5226 59.0805 24.9648C59.0805 26.407 60.2468 27.5742 61.6885 27.5742H70.8203C78.0672 27.5742 83.966 21.6721 83.966 14.4187C83.966 7.16527 78.0672 1.26367 70.8203 1.26367"
                    fill="#E51236"
                  />
                  <path
                    d="M21.1597 42.6076C19.7196 42.6076 18.5522 41.4402 18.5522 39.9983V24.4147C18.5522 22.9741 19.7196 21.8066 21.1597 21.8066C22.5998 21.8066 23.7682 22.9741 23.7682 24.4147V39.9983C23.7682 41.4402 22.6001 42.6076 21.1597 42.6076Z"
                    fill="#E51236"
                  />
                  <path
                    d="M26.6079 17.6483C25.8606 17.6483 25.1186 17.3274 24.6035 16.7093C23.6808 15.5996 23.833 13.9567 24.9392 13.034L38.3059 1.90543C39.4119 0.982994 41.0552 1.13216 41.9767 2.24235C42.8991 3.34969 42.748 4.99309 41.641 5.91424L28.2753 17.0454C27.7876 17.4499 27.1967 17.6483 26.6079 17.6483"
                    fill="#E51236"
                  />
                  <path
                    d="M15.9814 17.6493C15.3929 17.6493 14.8025 17.4509 14.3151 17.0464L0.940066 5.91527C-0.16669 4.99671 -0.318106 3.35046 0.602552 2.24338C1.52295 1.13603 3.16859 0.98402 4.2756 1.90646L17.6506 13.035C18.7566 13.9551 18.9088 15.6006 17.9881 16.7103C17.472 17.3285 16.7289 17.6493 15.9814 17.6493"
                    fill="#E51236"
                  />
                </svg>
              </div>
              <p className={styles.brandDescription}>
                För dig som vill skaffa dig ett yrke. För dig som vill byta yrke
                och för dig som vill fördjupa dig i ett yrke.
              </p>
              <button className={styles.brandLink}>
                <a href="">Gå till yrgo.se</a>
              </button>
              <small className={styles.copyright}>© 2025 Yrgo</small>
            </div>

            <div className={styles.footerNavigation}>
              <nav
                className={styles.socialNav}
                aria-labelledby="social-heading"
              >
                <h2 id="social-heading" className={styles.navHeading}>
                  Följ Yrgo
                </h2>
                <ul className={styles.socialList}>
                  <li>
                    <a
                      href="https://linkedin.com"
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_1365_17299)">
                          <path d="M16 0H0V16H16V0Z" fill="#2867B2" />
                          <path
                            d="M12.2609 3H3.73908C3.33127 3 3 3.32135 3 3.71616V12.2838C3 12.68 3.33127 13 3.73908 13H12.2609C12.6687 13 13 12.6786 13 12.2838V3.71616C13 3.32004 12.6687 3 12.2609 3ZM6.03154 11.3722H4.52171V6.85624H6.03154V11.3722ZM5.27663 6.23977H5.26739C4.76059 6.23977 4.43328 5.89349 4.43328 5.45934C4.43328 5.02518 4.77115 4.67891 5.28718 4.67891C5.80322 4.67891 6.12129 5.016 6.13185 5.45934C6.13185 5.89218 5.80454 6.23977 5.27795 6.23977H5.27663ZM11.4783 11.3722H9.96846V8.95619C9.96846 8.3489 9.74937 7.93442 9.20298 7.93442C8.78593 7.93442 8.53781 8.2138 8.42827 8.484C8.38868 8.58106 8.37812 8.71485 8.37812 8.84995V11.3722H6.86829C6.86829 11.3722 6.88808 7.27991 6.86829 6.85624H8.37812V7.49633C8.57873 7.18809 8.93771 6.75131 9.73882 6.75131C10.7326 6.75131 11.4783 7.39664 11.4783 8.78437V11.3736V11.3722Z"
                            fill="white"
                          />
                        </g>
                        <path
                          d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8Z"
                          stroke="black"
                          strokeOpacity="0.1"
                        />
                        <defs>
                          <clipPath id="clip0_1365_17299">
                            <path
                              d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                              fill="white"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://facebook.com"
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_1365_17305)">
                          <path
                            d="M16 0H0V16H16V0Z"
                            fill="url(#paint0_linear_1365_17305)"
                          />
                          <path
                            d="M6.62729 10.4038V16.0007H8.98023V10.4038H10.843L11.2351 8.14535H9.07827V6.67249C9.07827 6.08334 9.37239 5.49419 10.3528 5.49419H11.3332V3.53037C11.3332 3.53037 10.4508 3.33398 9.56847 3.33398C7.80376 3.33398 6.62729 4.41409 6.62729 6.37791V8.14535H4.6665V10.4038H6.62729Z"
                            fill="white"
                          />
                        </g>
                        <path
                          d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8Z"
                          stroke="black"
                          strokeOpacity="0.1"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_1365_17305"
                            x1="8"
                            y1="0"
                            x2="8"
                            y2="16"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#1AAFFF" />
                            <stop offset="1" stopColor="#0563DF" />
                          </linearGradient>
                          <clipPath id="clip0_1365_17305">
                            <path
                              d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                              fill="white"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Facebook</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com"
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_1365_17311)">
                          <path
                            d="M16 0H0V16H16V0Z"
                            fill="url(#paint0_radial_1365_17311)"
                          />
                          <path
                            d="M16 0H0V16H16V0Z"
                            fill="url(#paint1_radial_1365_17311)"
                          />
                          <path
                            d="M8 3.49398C9.45783 3.49398 9.65663 3.49398 10.253 3.49398C10.7831 3.49398 11.0482 3.62651 11.247 3.69277C11.512 3.8253 11.7108 3.89157 11.9096 4.09036C12.1084 4.28916 12.241 4.48795 12.3072 4.75301C12.3735 4.95181 12.4398 5.21687 12.506 5.74699C12.506 6.34337 12.506 6.4759 12.506 8C12.506 9.5241 12.506 9.65663 12.506 10.253C12.506 10.7831 12.3735 11.0482 12.3072 11.247C12.1747 11.512 12.1084 11.7108 11.9096 11.9096C11.7108 12.1084 11.512 12.241 11.247 12.3072C11.0482 12.3735 10.7831 12.4398 10.253 12.506C9.65663 12.506 9.5241 12.506 8 12.506C6.4759 12.506 6.34337 12.506 5.74699 12.506C5.21687 12.506 4.95181 12.3735 4.75301 12.3072C4.48795 12.1747 4.28916 12.1084 4.09036 11.9096C3.89157 11.7108 3.75904 11.512 3.69277 11.247C3.62651 11.0482 3.56024 10.7831 3.49398 10.253C3.49398 9.65663 3.49398 9.5241 3.49398 8C3.49398 6.4759 3.49398 6.34337 3.49398 5.74699C3.49398 5.21687 3.62651 4.95181 3.69277 4.75301C3.8253 4.48795 3.89157 4.28916 4.09036 4.09036C4.28916 3.89157 4.48795 3.75904 4.75301 3.69277C4.95181 3.62651 5.21687 3.56024 5.74699 3.49398C6.34337 3.49398 6.54217 3.49398 8 3.49398ZM8 2.5C6.4759 2.5 6.34337 2.5 5.74699 2.5C5.1506 2.5 4.75301 2.63253 4.42169 2.76506C4.09036 2.89759 3.75904 3.09639 3.42771 3.42771C3.09639 3.75904 2.96386 4.0241 2.76506 4.42169C2.63253 4.75301 2.56627 5.1506 2.5 5.74699C2.5 6.34337 2.5 6.54217 2.5 8C2.5 9.5241 2.5 9.65663 2.5 10.253C2.5 10.8494 2.63253 11.247 2.76506 11.5783C2.89759 11.9096 3.09639 12.241 3.42771 12.5723C3.75904 12.9036 4.0241 13.0361 4.42169 13.2349C4.75301 13.3675 5.1506 13.4337 5.74699 13.5C6.34337 13.5 6.54217 13.5 8 13.5C9.45783 13.5 9.65663 13.5 10.253 13.5C10.8494 13.5 11.247 13.3675 11.5783 13.2349C11.9096 13.1024 12.241 12.9036 12.5723 12.5723C12.9036 12.241 13.0361 11.9759 13.2349 11.5783C13.3675 11.247 13.4337 10.8494 13.5 10.253C13.5 9.65663 13.5 9.45783 13.5 8C13.5 6.54217 13.5 6.34337 13.5 5.74699C13.5 5.1506 13.3675 4.75301 13.2349 4.42169C13.1024 4.09036 12.9036 3.75904 12.5723 3.42771C12.241 3.09639 11.9759 2.96386 11.5783 2.76506C11.247 2.63253 10.8494 2.56627 10.253 2.5C9.65663 2.5 9.5241 2.5 8 2.5Z"
                            fill="white"
                          />
                          <path
                            d="M8 5.1506C6.40964 5.1506 5.1506 6.40964 5.1506 8C5.1506 9.59036 6.40964 10.8494 8 10.8494C9.59036 10.8494 10.8494 9.59036 10.8494 8C10.8494 6.40964 9.59036 5.1506 8 5.1506ZM8 9.85542C7.00602 9.85542 6.14458 9.06024 6.14458 8C6.14458 7.00602 6.93976 6.14458 8 6.14458C8.99398 6.14458 9.85542 6.93976 9.85542 8C9.85542 8.99398 8.99398 9.85542 8 9.85542Z"
                            fill="white"
                          />
                          <path
                            d="M10.9157 5.74699C11.2816 5.74699 11.5783 5.45031 11.5783 5.08434C11.5783 4.71837 11.2816 4.42169 10.9157 4.42169C10.5497 4.42169 10.253 4.71837 10.253 5.08434C10.253 5.45031 10.5497 5.74699 10.9157 5.74699Z"
                            fill="white"
                          />
                        </g>
                        <path
                          d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8Z"
                          stroke="black"
                          strokeOpacity="0.1"
                        />
                        <defs>
                          <radialGradient
                            id="paint0_radial_1365_17311"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(5.66667 16.6667) rotate(-81.5289) scale(15.8395)"
                          >
                            <stop stopColor="#FFDD55" />
                            <stop offset="0.1" stopColor="#FFDD55" />
                            <stop offset="0.517936" stopColor="#FF442C" />
                            <stop offset="1" stopColor="#FF1ED2" />
                          </radialGradient>
                          <radialGradient
                            id="paint1_radial_1365_17311"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(3.33333 -1) rotate(77.1957) scale(7.52034 20.897)"
                          >
                            <stop offset="0.096473" stopColor="#7000C9" />
                            <stop
                              offset="0.408416"
                              stopColor="#9A00E2"
                              stopOpacity="0.723958"
                            />
                            <stop
                              offset="0.975495"
                              stopColor="#AD00FF"
                              stopOpacity="0"
                            />
                          </radialGradient>
                          <clipPath id="clip0_1365_17311">
                            <path
                              d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                              fill="white"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Instagram</span>
                    </a>
                  </li>
                </ul>
              </nav>

              <nav
                className={styles.siteNav}
                aria-labelledby="site-nav-heading"
              >
                <ul className={styles.siteNavList}>
                  <h2 id="site-nav-heading" className={styles.siteHeading}>
                    Navigera sidan
                  </h2>
                  <li>
                    <a href="/kontakt">Kontakt</a>
                  </li>
                  <li>
                    <a href="/mingelevent">Mingelevent</a>
                  </li>
                  <li>
                    <a href="/foretagssidan">Företagssidan</a>
                  </li>
                  <li>
                    <a href="/sekretess">Sekretesspolicy</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
