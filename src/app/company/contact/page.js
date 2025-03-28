"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { supabase } from "../../../utils/supabase/client";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";

export default function ContactPage() {
  return (
    <FormProvider>
      <ContactForm />
    </FormProvider>
  );
}

function ContactForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      const registrationStep = localStorage.getItem("registrationStep");
      const description = localStorage.getItem("companyDescription");

      if (registrationStep === "contact" && description) {
        const email = localStorage.getItem("registrationEmail");
        if (email && !contactEmail) {
          setContactEmail(email);
        }

        setLoading(false);
      } else {
        router.push("/company/description");
      }
    }
  }, [authLoading, contactEmail, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const email = localStorage.getItem("registrationEmail");
      const password = localStorage.getItem("registrationPassword");
      const companyName = localStorage.getItem("companyName");
      const description = localStorage.getItem("companyDescription");
      const location = localStorage.getItem("companyLocation");

      if (!user) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
      }

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || user?.id;

      if (!userId) {
        throw new Error("Kunde inte hämta användarinformation");
      }

      const { error: insertError } = await supabase.from("companies").insert([
        {
          user_id: userId,
          name: companyName,
          description: description,
          location: location,
          website: website,
          email: contactEmail,
        },
      ]);

      if (insertError) throw insertError;

      // Handle file uploads if they exist
      const hasLogo = localStorage.getItem("hasLogo") === "true";
      const hasDisplayImage =
        localStorage.getItem("hasDisplayImage") === "true";

      // Here you would handle the file uploads and update the company profile
      // For now, we'll skip this part to simplify the implementation

      // Clear registration data from localStorage
      localStorage.removeItem("registrationStep");
      localStorage.removeItem("registrationEmail");
      localStorage.removeItem("registrationPassword");
      localStorage.removeItem("companyName");
      localStorage.removeItem("companyDescription");
      localStorage.removeItem("companyLocation");
      localStorage.removeItem("hasLogo");
      localStorage.removeItem("hasDisplayImage");

      router.push("/signupSuccess");
    } catch (err) {
      console.error("Error in Contact:", err);
      setError(err.message || "Ett fel uppstod när profilen skulle skapas");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="container">
      <h2>Skapa företagsprofil</h2>
      <p>
        Slutför din företagsprofil för att bli upptäckt av studenter. Lägg upp
        era LIA-platser och bli upptäckt av sökande.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="website">Hemsida</label>
        <input
          id="website"
          name="website"
          type="url"
          required
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={isSubmitting}
        />

        <label htmlFor="contactEmail">Kontaktmail</label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          disabled={isSubmitting}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Skapar profil..." : "Slutför Företagsprofil"}
          </button>
        </div>
      </form>
    </div>
  );
}
