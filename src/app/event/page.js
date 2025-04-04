import { EventCard } from "../components/cards/EventCard";
import styles from "./event.module.css";

export default function Positions() {
  return (
    <>
      <section className={styles.hero}>
        <img className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h3>Välkommen på LIA-event!</h3>
          <p className={styles.large}>
            Kom och mingla med Digital Designers och Webbutvecklare.
          </p>
          <div className={styles.content}>
            <div>
              <p>Plats</p>
              <p>Visual Arena, Göteborg</p>
            </div>
            <div>
              <p>Tid</p>
              <p>15:00–17:00, 23 april</p>
            </div>
          </div>
        </div>
      </section>
      <EventCard />
    </>
  );
}
