import styles from "@/app/components/footer/Footer.module.css";
import { useSupabaseAuth } from "@/hook/useSupabaseAuth";

export default function CreateCompanyProfileBanner() {
  const { user, loading, logout } = useSupabaseAuth();

  return (
    <>
      {!user && (
        <section className={styles.ctaSection} aria-labelledby="cta-heading">
          <div className={styles.container}>
            <h2 id="cta-heading" className={styles.ctaHeading}>
              Redo att hitta rätt praktikant?
            </h2>
            <p className={styles.ctaDescription}>
              Skapa er företagsprofil och bli kontaktad av Yrgo-studenter med
              kunskaperna ni söker.
            </p>
            <div className={styles.ctaAction}>
              <button
                className={styles.ctaButton}
                onClick={() => setShowRegistrationPopup(true)}
              >
                Skapa företagsprofil
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
