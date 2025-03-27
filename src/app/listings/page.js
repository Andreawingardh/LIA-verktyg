import AuthenticationCheck from "../auth/AuthenticationCheck";
import CreateListingForm from "../components/form/listing/CreateListingForm";
import styles from "../page.module.css";
import { createClient } from "@/utils/supabase/server";

export default async function Listings() {

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return <p>You must be logged in to create a listing.</p>
  }

  return <CreateListingForm user={user} />
  
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
  
  