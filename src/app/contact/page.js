"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import styles from "./contact.module.css";
import { Button } from "../components/buttons/Button";
import CreateCompanyProfileBanner from "../components/cards/CreateCompanyProfileBanner";

export default function Contact() {
  const router = useRouter();
  function previous() {
    router.back();
  }

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.contentWrapper}>
          <Button
            text="Gå tillbaka"
            onClick={previous}
            hasIcon={true}
            leftIcon={
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
                  d="M8.47124 2.86195C8.73159 3.1223 8.73159 3.54441 8.47124 3.80476L4.94265 7.33334H12.6665C13.0347 7.33334 13.3332 7.63182 13.3332 8.00001C13.3332 8.3682 13.0347 8.66668 12.6665 8.66668H4.94264L8.47124 12.1953C8.73159 12.4556 8.73159 12.8777 8.47124 13.1381C8.21089 13.3984 7.78878 13.3984 7.52843 13.1381L2.86177 8.47141C2.73674 8.34639 2.6665 8.17682 2.6665 8.00001C2.6665 7.8232 2.73674 7.65363 2.86177 7.5286L7.52843 2.86195C7.78878 2.6016 8.21089 2.6016 8.47124 2.86195Z"
                  fill="#0F1314"
                />
              </svg>
            }
            className="go-back-button"
          />

          <article>
            <h1>Kontakt</h1>
            <p>
              Hör av dig om du har frågor om tjänsten, behöver support eller
              vill veta mer om hur Yrgos LIA fungerar!
            </p>
            <div className={styles.emailWrapper}>
              <h2>Kontaktpersoner</h2>
            </div>
            <div  className={styles.textWrapper}>
              <h4 className={styles.bolded}>Marie Kalmnäs</h4>
              <p>Lärare, Yrgo Digital Designer</p>
              <p>marie.kalmnas@educ.goteborg.se </p>
              <div className={styles.contactPerson}>
              <h4 className={styles.bolded}>Hans Andersson</h4>
              <p> Lärare, Yrgo Webbutvecklare</p>
              <p> hans.2.andersson@educ.goteborg.se</p>
              </div>
            </div>
          </article>
        </div>
      </div>
      <CreateCompanyProfileBanner />
    </>
  );
}
