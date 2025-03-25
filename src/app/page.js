import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
<<<<<<< Updated upstream
import LoginForm from "./components/form/LoginForm";

=======
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
>>>>>>> Stashed changes

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to our site</h1>
<<<<<<< Updated upstream
        <Link href="/login" className={styles.a}>Login</Link>
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
        <Link href="/company" className={styles.a}>Check out this company</Link>
=======
        <Link href="/login" className={styles.a}>Login</Link>
        <Link href="/companies" className={styles.a}>Check out this company</Link>
>>>>>>> Stashed changes
      </main>
    </div>
  );
}