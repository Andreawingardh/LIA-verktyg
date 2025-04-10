"use client";

import React from "react";
import styles from "./privacypolicy.module.css";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { Button } from "../components/button/Button";
import CreateCompanyProfileBanner from "../components/cards/CreateCompanyProfileBanner";

export default function PrivacyPolicy() {
  const router = useRouter();
  function previous() {
    router.back();
  }

  return (
    <div className={styles.privacyPolicy}>
      <section className={styles.contentWrapper}>
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
          className="no-frame"
        />
        <section className={styles.textWrapper}>
          <h3>Sekretesspolicy</h3>
          <p className={styles.largeLeadingNormalRegular}>
            Vi värnar om din integritet och hanterar alltid dina personuppgifter
            i enlighet med gällande lagar och regler, inklusive GDPR.
          </p>

          <article>
            <p className={styles.largeLeadingNormalMedium}>
              Vilka uppgifter samlar vi in och varför?
            </p>
            Vid registrering av konto: Namn, e-postadress och lösenord. Används
            för kontoregistrering, autentisering och för att skicka nödvändig
            information om tjänsten. Vid anmälan till event:
            <ul>
              <li>Namn och e-postadress.</li>
              <li>Används för administration av eventet och eventuellt för </li>
              <li>informationsutskick inför eventet.</li>
            </ul>
            Vid skapande av företagsprofil (offentliga uppgifter): Företagsnamn,
            beskrivning, logotyp, omslagsbild, plats, länk till webbplats,
            kontaktmejl. Dessa uppgifter blir offentliga och är synliga för alla
            besökare på webbplatsen.
          </article>
          <article>
            <p className={styles.largeLeadingNormalMedium}>
              Laglig grund för behandling
            </p>
            <p>
              Vi behandlar dina personuppgifter baserat på samtycke eller vårt
              berättigade intresse vid skapande av konto och företagsprofiler.
            </p>
          </article>
          <article>
            <p className={styles.largeLeadingNormalMedium}>
              Hur länge sparas uppgifterna?
            </p>
            <p>
              Vi sparar dina personuppgifter så länge ditt konto är aktivt eller
              tjänsten är tillgänglig. Vid avslut av konto eller tjänst raderas
              uppgifterna inom rimlig tid.
            </p>
          </article>
          <article>
            <p className={styles.largeLeadingNormalMedium}>Dina rättigheter</p>
            <p>Du har rätt att:</p>
            <ul>
              <li>
                Begära information om vilka personuppgifter vi har sparat om
                dig.
              </li>
              <li>
                Begära rättelse av felaktiga eller ofullständiga uppgifter.
              </li>
              <li>Begära radering av dina personuppgifter.</li>
            </ul>
            För att utnyttja dessa rättigheter kontaktar du någon av följande:
            <p className={styles.bolded}>
              Marie Kalmnäs 
            </p>
            <p>Lärare, Yrgo Digital Designer</p>
            <p>marie.kalmnas@educ.goteborg.se </p>
            <p className={styles.bolded}>
              Hans Andersson
            </p>
            <p>Lärare, Yrgo Webbutvecklare</p>
            <p> hans.2.andersson@educ.goteborg.se</p>
            <p>
              Du kan enkelt redigera eller radera företagsprofilen direkt på
              webbplatsen genom att logga in och välja ”redigera
              företagsprofil”.
            </p>
          </article>
          <article>
            {" "}
            <p className={styles.largeLeadingNormalMedium}>
              Säkerhet och datalagring
            </p>
            <p>
              Datalagring sker via tjänsten Supabase. Supabase har
              säkerhetsrutiner som inkluderar kryptering av data för att skydda
              känslig information.
            </p>
          </article>
          <article>
            <p className={styles.largeLeadingNormalMedium}>
              Delning med tredje part
            </p>
            <p>
              Utöver datalagringsverktyget Supabase sker ingen delning med
              trejde part.
            </p>
          </article>
          <article>
            <p>
              Vid frågor gällande hantering av personuppgifter och integritet,
              vänligen kontakta någon av följande:
            </p>
            <p className={styles.bolded}>
              Marie Kalmnäs 
            </p>
            <p>Lärare, Yrgo Digital Designer</p>
            <p>marie.kalmnas@educ.goteborg.se </p>
            <p className={styles.bolded}>
              Hans Andersson
            </p>
            <p>Lärare, Yrgo Webbutvecklare</p>
            <p> hans.2.andersson@educ.goteborg.se</p>
          </article>
        </section>
      </section>
      <CreateCompanyProfileBanner />
    </div>
  );
}
