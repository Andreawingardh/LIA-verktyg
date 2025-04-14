import { EventCard } from "../components/cards/EventCard";
import styles from "./event.module.css";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { PositionsBanner } from "../components/cards/PositionsBanner";

export default function Positions() {
  return (
    <>
      
      <div className={styles.headerWrapper}>
        <section className={styles.hero}>
          <img className={styles.heroImage} src="/images/eventpage-hero-image.png" alt="Illustration av fyra personer som samarbetar med programmering kring en laptop."/>
          <div className={styles.heroContent}>
            <div className={styles.textHeader}>
              <h1>Välkommen på LIA-event!</h1>
                <p className={styles.large}>
                  Kom och mingla med Digital Designers och Webbutvecklare.
                </p>
            </div>
            <div className={styles.content}>
              <div>
                <p>Plats</p>
                <p>Visual Arena, Göteborg</p>
              </div>
              <div>
                <p>Tid</p>
                <p>15:00–17:00, 23 april</p>
              </div>
              <div className={styles.eventButton}>
                <AddToCalendarButton
                  name="Mingelevent"
                  options={[
                    "Apple",
                    "Google",
                    "Outlook.com",
                    "iCal",
                    "Microsoft365",
                    "Microsoft Teams",
                  ]}
                  location="Visual Arena, Göteborg"
                  organiser="YRGO"
                  startDate="2025-04-23"
                  endDate="2025-04-23"
                  startTime="15:00"
                  endTime="17:00"
                  timeZone="Europe/Stockholm"
                  label="Lägg till i kalendern"
                  icsFile
                  styleLight="--btn-background: #E51236; 
                --btn-text: #fff; 
                --font: Inter, serif; 
                --btn-border: none; 624.9375rem;
                --btn-shadow: none; --btn-hover-shadow: none; --btn-active-shadow: none;
                --btn-hover-text: #001A52; 
                --btn-hover-text: #E51236;"
                ></AddToCalendarButton>
              </div>
            </div>
          </div>
        </section>
      </div>
      <EventCard />
      <PositionsBanner />
    </>
  );
}
