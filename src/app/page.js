import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import LoginForm from "./components/form/LoginForm";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to our site</h1>
        <Link href="/login" className={styles.a}>Login</Link>
        <Link href="/company" className={styles.a}>Check out this company</Link>
      </main>
    </div>
  );
}