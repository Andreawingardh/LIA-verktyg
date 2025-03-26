import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Träffa nya talanger på mingel-event</h1>

        <Link href="/form/Signup/NameAndMailForm" className={styles.a}>Skriv upp ditt företag</Link>
        <Link href="/companies" className={styles.a}>Upptäck LIA-platser</Link>

      </main>
    </div>
  );
}