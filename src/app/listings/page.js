import AuthenticationCheck from "../auth/AuthenticationCheck";
import CreateListingForm from "../components/form/listing/CreateListingForm";
import styles from "../page.module.css";


export default function Listings() {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
                <h1>Welcome to Listings</h1>
                <h2>Hello</h2>
                <AuthenticationCheck />
                <CreateListingForm />
        </main>
      </div>
    );
  }
  